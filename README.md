# RapidRoute+ — Hospital Emergency Route System
### DAA Hackathon Project: Graph Data Structures, Dijkstra's Algorithm, Priority Queue & BFS Exploration

[![System Status](https://img.shields.io/badge/System-Online-10b981.svg)]()
[![Algorithms](https://img.shields.io/badge/DAA-Dijkstra%20%7C%20Min--Heap%20%7C%20BFS-8b5cf6.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Python%203%20%7C%20Express-38bdf8.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Tailwind%20CSS-06b6d4.svg)]()

---

## 1. Project Overview

**RapidRoute+** is an emergency operations and clinical routing system designed for modern multi-wing hospitals and trauma centers. During mass-casualty incidents or acute medical emergencies (STEMI cardiac infarction, intracranial hemorrhages, polytrauma), finding the fastest, safest pathway through hospital corridors, elevators, and skybridges is vital.

Traditional navigation systems fail indoors because hospital wings frequently experience transient hazards—such as biohazard decontamination, surgical sterile lockdowns, or service elevator maintenance. **RapidRoute+** models the hospital campus as a **weighted graph**, dynamically recalculates routes when corridors become blocked, and schedules emergency patient intakes using a **Binary Min-Heap Priority Queue**.

---

## 2. Key Features

- **Interactive Hospital Campus Map**: Real-time SVG graph visualizer mapping 12 departments and 18 corridors with corridor travel times, department bed capacities, and obstacle badges.
- **Dynamic Hazard & Blockage Bypass**: Toggle corridor blockages (e.g., Emergency Department ↔ ICU); Dijkstra immediately isolates the edge and finds the mathematically fastest safe detour.
- **Emergency Priority Queue (Min-Heap)**: Automatic clinical triage sorting based on severity:
  1. `CRITICAL` (Priority 1)
  2. `HIGH` (Priority 2)
  3. `MEDIUM` (Priority 3)
  4. `LOW` (Priority 4)
  with arrival timestamp tiebreaking. Includes an interactive binary heap array/tree inspector ($i \to 2i+1, 2i+2$).
- **Live Algorithm Decision Trace**: Step-by-step trace showing settled nodes, tentative distance relaxations, and "Why was this route selected?" human-interpretable rationale.
- **Side-by-Side Algorithm Comparison**: Evaluates **Dijkstra** (weighted travel time in minutes) vs. **Breadth-First Search** (minimum unweighted corridor hops).
- **Ambulance Dispatch Animation**: Animated ambulance with sirens and beacon halos traversing the calculated route from origin to destination.
- **Emergency Operations Analytics**: Triage severity breakdowns, algorithm run counters, and transit metrics.
- **Interactive Hackathon Judge Walkthrough**: A guided 60-second modal guiding judges through the 6-step DAA demonstration.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Custom SVG Canvas with Pan/Zoom & Vector Glow Filters.
- **Backend Algorithms Engine**: Python 3 Standard Library (`heapq`, `collections.deque`, `http.server`, `json`).
  - *No third-party routing libraries used.* Every algorithm is written manually from scratch.
- **Full-Stack Gateway & Middleware**: Node.js, Express, `tsx`, Vite SPA middleware.

---

## 4. Algorithms & Data Structures

### A. Graph Representation
The hospital infrastructure is modeled as an undirected weighted graph $G = (V, E)$:
- **Vertices ($|V| = 12$)**:
  1. `Emergency Gate` (Triage Check-in)
  2. `Emergency Department` (Trauma Acute Bays)
  3. `Reception` (Central Atrium)
  4. `Diagnostics Lab` (Stat Pathology)
  5. `Operation Theatre` (Surgical Suites)
  6. `ICU` (Intensive Care Pavilion)
  7. `General Ward` (Inpatient Recovery)
  8. `Pharmacy` (Emergency Dispensary)
  9. `Blood Bank` (Transfusion Services)
  10. `Cardiology` (Cath Lab)
  11. `Radiology` (CT / MRI Imaging)
  12. `Exit Gate` (Discharge Bay)
- **Edges ($|E| = 18$)**: Corridors with weights in minutes ($w(u, v) \in [2.0, 5.0]$).
- **Storage**: Adjacency list with $O(V + E)$ space complexity.

### B. Dijkstra's Algorithm
- **Purpose**: Minimizes cumulative transit time across weighted hospital corridors.
- **Time Complexity**: $O((V + E) \log V)$ using a binary min-heap for tentative costs.
- **Space Complexity**: $O(V)$ for distance and previous-node tables.
- **Obstacle Handling**: Checks `is_corridor_blocked(u, v)`. Blocked edges are ignored during edge relaxation.

### C. Binary Min-Heap Priority Queue
- **Purpose**: Schedules arriving emergency cases.
- **Time Complexity**:
  - `push()`: $O(\log n)$ with `_sift_up()`
  - `pop()`: $O(\log n)$ with `_sift_down()`
  - `peek()`: $O(1)$ constant time lookup
- **Comparator**:
  ```python
  def __lt__(self, other):
      if self.severity_rank != other.severity_rank:
          return self.severity_rank < other.severity_rank
      if self.priority != other.priority:
          return self.priority < other.priority
      return self.arrival_key < other.arrival_key
  ```

### D. Breadth-First Search (BFS)
- **Purpose**: Explores graph level-by-level using a FIFO queue to find the minimum-hop path (treating each edge as 1 unit) and verify reachability.
- **Time Complexity**: $O(V + E)$.

---

## 5. Backend REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & algorithm availability |
| `GET` | `/api/graph` | Returns the 12 nodes, 18 corridors, and blocked list |
| `GET` | `/api/emergencies` | Returns sorted Min-Heap cases and next-to-process |
| `POST` | `/api/emergencies/add` | Inserts new patient into the Min-Heap |
| `POST` | `/api/corridors/toggle` | Toggles corridor state (`AVAILABLE` $\leftrightarrow$ `BLOCKED`) |
| `POST` | `/api/route/dijkstra` | Computes Dijkstra shortest path, decision trace & explanation |
| `POST` | `/api/route/bfs` | Computes BFS minimum-hop traversal and queue trace |
| `POST` | `/api/simulation/start` | Dispatches highest priority case and animates ambulance |
| `GET` | `/api/analytics` | Returns severity distributions and transit statistics |

### Example Request: Calculate Dijkstra Route
```bash
curl -X POST http://localhost:3000/api/route/dijkstra \
  -H "Content-Type: application/json" \
  -d '{
    "start": "Emergency Gate",
    "destination": "ICU",
    "blocked_corridors": ["Emergency Department|ICU"]
  }'
```

---

## 6. How to Run the Application

### Option A: Standard Full-Stack Startup (Port 3000)
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack dev server (Express + Vite + Python CLI bridge)
npm run dev

# 3. Open browser at:
http://localhost:3000
```

### Option B: Standalone Python Backend
```bash
# Run standalone Python HTTP server on port 5000
python3 backend/app.py --port 5000
```

### Option C: Run Algorithm CLI Directly
```bash
python3 backend/cli.py --action dijkstra --start "Emergency Gate" --destination "ICU" --blocked '["Emergency Department|ICU"]'
```

---

## 7. Hackathon Demo Presentation Steps (For Judges)

1. **Step 1: Emergency Triage (Min-Heap)**
   - Open RapidRoute+ and click **🎬 Hackathon Demo**.
   - Review the Emergency Queue: `EMR-104` (Acute Cardiac STEMI, Critical P1) sits at the root of the Min-Heap ahead of trauma and fractures.
2. **Step 2: Department Origin & Target**
   - Origin: `Emergency Gate` (Ambulance drop-off).
   - Destination: `ICU` (Target intensive care bed).
3. **Step 3: Simulated Corridor Hazard**
   - Note that `Emergency Department ↔ ICU` (direct 2m transit) is **BLOCKED**.
4. **Step 4: Dijkstra Execution**
   - Click **Calculate Route** (Dijkstra).
   - Dijkstra explores the adjacent corridors, bypassing the blocked elevator.
5. **Step 5: Safe Route Locked**
   - Result: `Emergency Gate → Emergency Department → Diagnostics Lab → ICU` (Total: 8.0 minutes).
   - Notice the animated ambulance vehicle traveling along the detour path.
6. **Step 6: BFS Comparison**
   - Compare with BFS: BFS identifies 3 corridor hops.
   - Explain the tradeoff: Dijkstra minimizes cumulative travel time in minutes, whereas BFS minimizes physical doorway/hallway transfers.
