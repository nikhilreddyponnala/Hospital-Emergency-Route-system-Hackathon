export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface HospitalNode {
  id: string;
  name: string;
  category: 'GATE' | 'EMERGENCY' | 'ADMIN' | 'DIAGNOSTICS' | 'SURGERY' | 'CRITICAL' | 'INPATIENT' | 'PHARMACY' | 'LAB' | 'SPECIALTY';
  wing: string;
  floor: string;
  x: number;
  y: number;
  icon: string;
  description: string;
  capacity: string;
}

export interface HospitalCorridor {
  id: string;
  from: string;
  to: string;
  weight: number; // travel time in minutes
  type: string;
  distance_meters: number;
}

export interface EmergencyCase {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_type: string;
  start: string;
  destination: string;
  severity: SeverityLevel;
  priority: number;
  arrival_time: string;
  notes: string;
}

export interface DijkstraStepNeighbor {
  neighbor: string;
  edge_weight: number;
  status: 'UPDATED' | 'BLOCKED' | 'ALREADY_FINALIZED' | 'NOT_IMPROVED';
  old_distance?: number | null;
  new_distance?: number;
  current_best?: number;
  tentative?: number;
  note: string;
}

export interface DijkstraStep {
  step: number;
  selected_node: string;
  cost: number;
  action: string;
  evaluated_neighbors: DijkstraStepNeighbor[];
}

export interface DijkstraResult {
  success: boolean;
  algorithm: 'Dijkstra';
  start: string;
  destination: string;
  path: string[];
  total_cost: number;
  visited_nodes: string[];
  distance_table: Record<string, number | null>;
  steps: DijkstraStep[];
  edges_evaluated: number;
  nodes_visited_count: number;
  why_this_route: string;
  blocked_corridors_considered: string[];
  error?: string;
}

export interface BFSStep {
  step: number;
  current_node: string;
  depth?: number;
  enqueued?: string[];
  blocked_corridors?: string[];
  queue_snapshot: string[];
  visited_snapshot: string[];
  action: string;
}

export interface BFSResult {
  success: boolean;
  algorithm: 'BFS';
  start: string;
  destination: string;
  path: string[];
  hops: number;
  total_cost: number;
  visited_nodes: string[];
  steps: BFSStep[];
  nodes_visited_count: number;
  explanation: string;
  error?: string;
}

export interface GraphDataResponse {
  nodes: HospitalNode[];
  corridors: HospitalCorridor[];
  blocked_corridors: string[];
  stats: {
    total_locations: number;
    total_corridors: number;
    blocked_count: number;
  };
}

export interface PriorityQueueResponse {
  emergencies: EmergencyCase[];
  total_count: number;
  next_emergency: EmergencyCase | null;
  priority_queue_info?: {
    data_structure: string;
    time_complexity: string;
    triage_rule: string;
  };
}

export interface AnalyticsResponse {
  severity_distribution: Record<SeverityLevel, number>;
  total_emergencies: number;
  active_blocked_corridors: number;
  algorithm_runs_count: number;
  average_route_time_minutes: number;
  recent_runs: Array<{
    algorithm: string;
    start: string;
    destination: string;
    total_cost: number;
    timestamp: string;
  }>;
}
