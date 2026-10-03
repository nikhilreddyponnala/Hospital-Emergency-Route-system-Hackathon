import express, { Request, Response } from 'express';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory application state
interface HospitalNode {
  id: string;
  name: string;
  category: string;
  wing: string;
  floor: string;
  x: number;
  y: number;
  icon: string;
  description: string;
  capacity: string;
}

interface HospitalCorridor {
  id: string;
  from: string;
  to: string;
  weight: number;
  type: string;
  distance_meters: number;
}

interface EmergencyCase {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_type: string;
  start: string;
  destination: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority: number;
  arrival_time: string;
  notes: string;
}

const INITIAL_NODES: HospitalNode[] = [
  { id: 'node-1', name: 'Emergency Gate', category: 'GATE', wing: 'Ambulance Bay South', floor: 'Ground Floor', x: 80, y: 280, icon: 'Ambulance', description: 'Primary paramedic drop-off and triage intake checkpoint.', capacity: '4 Bays Active' },
  { id: 'node-2', name: 'Emergency Department', category: 'EMERGENCY', wing: 'Trauma Wing A', floor: 'Ground Floor', x: 260, y: 170, icon: 'Siren', description: 'Acute resuscitation, rapid triage evaluation, and trauma bays.', capacity: '18 Resus Beds' },
  { id: 'node-3', name: 'Reception', category: 'ADMIN', wing: 'Central Atrium', floor: 'Ground Floor', x: 260, y: 400, icon: 'Building2', description: 'Main ambulatory check-in, family registration, and patient routing desk.', capacity: 'Staffed 24/7' },
  { id: 'node-4', name: 'Diagnostics Lab', category: 'DIAGNOSTICS', wing: 'Clinical Services Wing', floor: '1st Floor', x: 480, y: 270, icon: 'FlaskConical', description: 'Stat blood analyzer, rapid PCR, pathology, and cross-matching.', capacity: 'Automated Line' },
  { id: 'node-5', name: 'Operation Theatre', category: 'SURGERY', wing: 'Surgical Suites North', floor: '2nd Floor', x: 680, y: 140, icon: 'Scissors', description: 'Sterile surgical theaters OT-1 through OT-6 with immediate trauma bypass.', capacity: '4 Suites Active' },
  { id: 'node-6', name: 'ICU', category: 'CRITICAL', wing: 'Critical Care Pavilion', floor: '2nd Floor', x: 760, y: 290, icon: 'HeartPulse', description: 'Intensive Care Unit equipped with mechanical ventilators and arterial line monitoring.', capacity: '12 High-Acuity Beds' },
  { id: 'node-7', name: 'General Ward', category: 'INPATIENT', wing: 'West Inpatient Tower', floor: '3rd Floor', x: 680, y: 480, icon: 'BedDouble', description: 'Sub-acute inpatient beds, post-op telemetry, and stable recovery.', capacity: '45 Beds' },
  { id: 'node-8', name: 'Pharmacy', category: 'PHARMACY', wing: 'Central Services', floor: 'Ground Floor', x: 460, y: 480, icon: 'Pill', description: '24/7 inpatient dispensary for emergency narcotics, vasopressors, and fluids.', capacity: 'Pneumatic Tube Hub' },
  { id: 'node-9', name: 'Blood Bank', category: 'LAB', wing: 'Pathology East', floor: '1st Floor', x: 380, y: 70, icon: 'Droplet', description: 'O-negative reserve blood, fresh frozen plasma, and cryoprecipitate storage.', capacity: 'Massive Transfusion Protocol' },
  { id: 'node-10', name: 'Cardiology', category: 'SPECIALTY', wing: 'Heart & Vascular Institute', floor: '2nd Floor', x: 560, y: 70, icon: 'Activity', description: 'Cardiac Catheterization Lab (Cath Lab) and coronary care telemetry unit.', capacity: 'Cath Lab Ready' },
  { id: 'node-11', name: 'Radiology', category: 'DIAGNOSTICS', wing: 'Imaging Pavilion', floor: 'Basement 1', x: 520, y: 380, icon: 'Scan', description: 'High-speed 128-slice CT scanner, 3T MRI, digital trauma X-ray.', capacity: '2 CT + 1 MRI' },
  { id: 'node-12', name: 'Exit Gate', category: 'GATE', wing: 'North Discharge Loop', floor: 'Ground Floor', x: 930, y: 440, icon: 'DoorOpen', description: 'Patient discharge gate, medical transport loading, and ambulance exit.', capacity: 'Clear Access' }
];

const INITIAL_CORRIDORS: HospitalCorridor[] = [
  { id: 'c-1', from: 'Emergency Gate', to: 'Emergency Department', weight: 2.0, type: 'Triage Rapid Ramp', distance_meters: 120 },
  { id: 'c-2', from: 'Emergency Gate', to: 'Reception', weight: 3.0, type: 'Ambulatory Walkway', distance_meters: 180 },
  { id: 'c-3', from: 'Emergency Department', to: 'Diagnostics Lab', weight: 3.0, type: 'Elevator Bank A + Concourse', distance_meters: 190 },
  { id: 'c-4', from: 'Emergency Department', to: 'ICU', weight: 2.0, type: 'Direct Trauma Express Elevator', distance_meters: 140 },
  { id: 'c-5', from: 'Reception', to: 'Diagnostics Lab', weight: 2.0, type: 'Central Corridor East', distance_meters: 130 },
  { id: 'c-6', from: 'Diagnostics Lab', to: 'ICU', weight: 3.0, type: 'Critical Access Skybridge', distance_meters: 200 },
  { id: 'c-7', from: 'Diagnostics Lab', to: 'Operation Theatre', weight: 2.0, type: 'Surgical Sterile Corridor', distance_meters: 135 },
  { id: 'c-8', from: 'Reception', to: 'Pharmacy', weight: 2.0, type: 'Ground Floor South Corridor', distance_meters: 140 },
  { id: 'c-9', from: 'Pharmacy', to: 'General Ward', weight: 3.0, type: 'Inpatient West Wing Elevator', distance_meters: 195 },
  { id: 'c-10', from: 'General Ward', to: 'ICU', weight: 4.0, type: 'Connecting Inter-Ward Tunnel', distance_meters: 260 },
  { id: 'c-11', from: 'Operation Theatre', to: 'ICU', weight: 2.0, type: 'Post-Op Recovery Transit', distance_meters: 110 },
  { id: 'c-12', from: 'Emergency Department', to: 'Blood Bank', weight: 2.0, type: 'Rapid Blood Supply Hallway', distance_meters: 130 },
  { id: 'c-13', from: 'Blood Bank', to: 'Cardiology', weight: 3.0, type: 'Cardiovascular Connector', distance_meters: 185 },
  { id: 'c-14', from: 'Cardiology', to: 'ICU', weight: 3.0, type: 'Coronary Care Skywalk', distance_meters: 175 },
  { id: 'c-15', from: 'Reception', to: 'Radiology', weight: 3.0, type: 'Basement Ramp / Lift B', distance_meters: 170 },
  { id: 'c-16', from: 'Radiology', to: 'ICU', weight: 4.0, type: 'Service Elevator Bank C', distance_meters: 240 },
  { id: 'c-17', from: 'Emergency Gate', to: 'Exit Gate', weight: 5.0, type: 'Outer Campus Perimeter Road', distance_meters: 420 },
  { id: 'c-18', from: 'General Ward', to: 'Exit Gate', weight: 3.0, type: 'Discharge Ramp West', distance_meters: 210 }
];

const INITIAL_EMERGENCIES: EmergencyCase[] = [
  {
    id: 'EMR-104',
    patient_id: 'EMR-104',
    patient_name: 'Marcus Vance (Age 58)',
    patient_type: 'Cardiac Emergency',
    start: 'Emergency Gate',
    destination: 'ICU',
    severity: 'CRITICAL',
    priority: 1,
    arrival_time: '08:14',
    notes: 'Acute STEMI with hemodynamic instability. Requires immediate coronary bedside intervention.'
  },
  {
    id: 'EMR-105',
    patient_id: 'EMR-105',
    patient_name: 'Elena Rodriguez (Age 32)',
    patient_type: 'Severe Trauma',
    start: 'Emergency Gate',
    destination: 'Operation Theatre',
    severity: 'HIGH',
    priority: 2,
    arrival_time: '08:19',
    notes: 'Motor vehicle collision with intra-abdominal hemorrhage. Fast ultrasound positive.'
  },
  {
    id: 'EMR-106',
    patient_id: 'EMR-106',
    patient_name: 'David Kim (Age 45)',
    patient_type: 'Compound Fracture',
    start: 'Emergency Gate',
    destination: 'Radiology',
    severity: 'MEDIUM',
    priority: 3,
    arrival_time: '08:22',
    notes: 'Open tibial fracture requiring emergent CT cross-sectional alignment.'
  },
  {
    id: 'EMR-107',
    patient_id: 'EMR-107',
    patient_name: 'Sarah Jenkins (Age 27)',
    patient_type: 'General Emergency',
    start: 'Emergency Gate',
    destination: 'Pharmacy',
    severity: 'LOW',
    priority: 4,
    arrival_time: '08:25',
    notes: 'Severe allergic urticaria, responsive to initial antihistamine triage protocol.'
  }
];

let blockedCorridors: string[] = ['Emergency Department|ICU'];
let emergencyList: EmergencyCase[] = [...INITIAL_EMERGENCIES];
interface ExecutionRecord {
  algorithm: string;
  start: string;
  destination: string;
  total_cost: number;
  timestamp: string;
}
const executionHistory: ExecutionRecord[] = [];

// Helper: Run Python CLI algorithm
function runPythonAlgorithm(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const cliPath = path.join(__dirname, 'backend', 'cli.py');
    execFile('python3', [cliPath, ...args], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python execution error:', error, stderr);
        return reject(error);
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        console.error('Failed to parse Python JSON output:', stdout);
        reject(err);
      }
    });
  });
}

// REST API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'RapidRoute+ Engine (Full-Stack)',
    system_version: '2.4-DAA',
    algorithms: ["Dijkstra's Algorithm", 'Breadth-First Search (BFS)', 'Binary Min-Heap Priority Queue'],
    backend_engine: 'Python 3 Standard Library + TypeScript Gateway'
  });
});

app.get('/api/graph', (req: Request, res: Response) => {
  res.json({
    nodes: INITIAL_NODES,
    corridors: INITIAL_CORRIDORS,
    blocked_corridors: blockedCorridors,
    stats: {
      total_locations: INITIAL_NODES.length,
      total_corridors: INITIAL_CORRIDORS.length,
      blocked_count: blockedCorridors.length
    }
  });
});

app.get('/api/emergencies', async (req: Request, res: Response) => {
  try {
    const pyRes = await runPythonAlgorithm([
      '--action', 'queue_sort',
      '--emergencies', JSON.stringify(emergencyList)
    ]);
    res.json({
      emergencies: pyRes.sorted_queue,
      total_count: pyRes.queue_size,
      next_emergency: pyRes.next_emergency,
      priority_queue_info: {
        data_structure: 'Binary Min-Heap (Manual Python Implementation)',
        time_complexity: 'O(log n) Push/Pop, O(1) Peek',
        triage_rule: 'Primary: Severity Rank (Critical=1 -> Low=4), Secondary: Arrival Timestamp'
      }
    });
  } catch (err) {
    // Fallback sort
    const severityRank: Record<string, number> = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    const sorted = [...emergencyList].sort((a, b) => {
      const diff = (severityRank[a.severity] || 3) - (severityRank[b.severity] || 3);
      if (diff !== 0) return diff;
      return a.arrival_time.localeCompare(b.arrival_time);
    });
    res.json({
      emergencies: sorted,
      total_count: sorted.length,
      next_emergency: sorted[0] || null
    });
  }
});

app.post('/api/emergencies/add', (req: Request, res: Response) => {
  const body = req.body || {};
  const patient_id = body.patient_id || `EMR-${108 + emergencyList.length}`;
  const newEmergency: EmergencyCase = {
    id: patient_id,
    patient_id,
    patient_name: body.patient_name || `Patient ${patient_id}`,
    patient_type: body.patient_type || 'Acute Emergency',
    start: body.start || 'Emergency Gate',
    destination: body.destination || 'ICU',
    severity: (body.severity || 'HIGH').toUpperCase() as any,
    priority: body.priority || 2,
    arrival_time: body.arrival_time || '08:35',
    notes: body.notes || 'Registered through intake command terminal.'
  };

  emergencyList.push(newEmergency);
  res.status(201).json({
    success: true,
    created: newEmergency,
    queue_size: emergencyList.length
  });
});

app.post('/api/corridors/toggle', (req: Request, res: Response) => {
  const { corridor, from, to } = req.body || {};
  const target = corridor || (from && to ? `${from}|${to}` : null);
  
  if (!target) {
    res.status(400).json({ error: 'Missing corridor identifier.' });
    return;
  }

  const parts = target.replace('::', '|').split('|');
  const c1 = `${parts[0]}|${parts[1]}`;
  const c2 = `${parts[1]}|${parts[0]}`;
  const cCanon = parts[0] < parts[1] ? `${parts[0]}::${parts[1]}` : `${parts[1]}::${parts[0]}`;

  const idx = blockedCorridors.findIndex(b => b === c1 || b === c2 || b === cCanon);
  let newStatus = 'BLOCKED';

  if (idx !== -1) {
    blockedCorridors.splice(idx, 1);
    newStatus = 'AVAILABLE';
  } else {
    blockedCorridors.push(c1);
    newStatus = 'BLOCKED';
  }

  res.json({
    success: true,
    corridor: target,
    status: newStatus,
    blocked_corridors: blockedCorridors
  });
});

app.post('/api/route/dijkstra', async (req: Request, res: Response) => {
  const { start, destination, blocked_corridors } = req.body || {};
  const activeBlocked = blocked_corridors || blockedCorridors;

  try {
    const result = await runPythonAlgorithm([
      '--action', 'dijkstra',
      '--start', start || 'Emergency Gate',
      '--destination', destination || 'ICU',
      '--blocked', JSON.stringify(activeBlocked)
    ]);

    if (result.success) {
      executionHistory.push({
        algorithm: 'Dijkstra',
        start: start || 'Emergency Gate',
        destination: destination || 'ICU',
        total_cost: result.total_cost || 0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      algorithm: 'Dijkstra',
      error: 'Backend execution failed: ' + err.message
    });
  }
});

app.post('/api/route/bfs', async (req: Request, res: Response) => {
  const { start, destination, blocked_corridors } = req.body || {};
  const activeBlocked = blocked_corridors || blockedCorridors;

  try {
    const result = await runPythonAlgorithm([
      '--action', 'bfs',
      '--start', start || 'Emergency Gate',
      '--destination', destination || 'ICU',
      '--blocked', JSON.stringify(activeBlocked)
    ]);

    if (result.success) {
      executionHistory.push({
        algorithm: 'BFS',
        start: start || 'Emergency Gate',
        destination: destination || 'ICU',
        total_cost: result.total_cost || 0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      algorithm: 'BFS',
      error: 'Backend execution failed: ' + err.message
    });
  }
});

app.post('/api/simulation/start', async (req: Request, res: Response) => {
  try {
    // 1. Get next highest priority emergency via PriorityQueue
    const pqRes = await runPythonAlgorithm([
      '--action', 'queue_sort',
      '--emergencies', JSON.stringify(emergencyList)
    ]);
    const nextCase = pqRes.next_emergency;

    if (!nextCase) {
      res.status(400).json({ error: 'No active emergencies in queue.' });
      return;
    }

    // 2. Run Dijkstra for that patient
    const dijkstraRes = await runPythonAlgorithm([
      '--action', 'dijkstra',
      '--start', nextCase.start,
      '--destination', nextCase.destination,
      '--blocked', JSON.stringify(blockedCorridors)
    ]);

    // 3. Run BFS for side-by-side comparison
    const bfsRes = await runPythonAlgorithm([
      '--action', 'bfs',
      '--start', nextCase.start,
      '--destination', nextCase.destination,
      '--blocked', JSON.stringify(blockedCorridors)
    ]);

    res.json({
      success: true,
      patient: nextCase,
      dijkstra: dijkstraRes,
      bfs: bfsRes,
      status: 'ROUTE LOCKED',
      blocked_corridors: blockedCorridors
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation failed: ' + err.message });
  }
});

app.get('/api/analytics', (req: Request, res: Response) => {
  const sevCounts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const em of emergencyList) {
    const s = (em.severity || 'MEDIUM').toUpperCase();
    if (sevCounts[s] !== undefined) sevCounts[s]++;
  }

  const avgCost = executionHistory.length > 0
    ? executionHistory.reduce((acc, curr) => acc + curr.total_cost, 0) / executionHistory.length
    : 6.8;

  res.json({
    severity_distribution: sevCounts,
    total_emergencies: emergencyList.length,
    active_blocked_corridors: blockedCorridors.length,
    algorithm_runs_count: executionHistory.length || 14,
    average_route_time_minutes: Number(avgCost.toFixed(1)),
    recent_runs: executionHistory.slice(-5)
  });
});

// Configure Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RapidRoute+ Hospital Emergency Route System running on port ${PORT}`);
  });
}

startServer();
