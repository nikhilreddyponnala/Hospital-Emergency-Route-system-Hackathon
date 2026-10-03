"""
RapidRoute+ Hospital Emergency Route System
Python Standalone Server (Zero-Dependency Standard Library)

Implements full REST API specification for RapidRoute+ with CORS support.
Can be executed directly via:
    python3 backend/app.py --port 5000
"""

import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from algorithms.dijkstra import find_dijkstra_route
from algorithms.bfs import find_bfs_route
from algorithms.priority_queue import EmergencyPriorityQueue
from data.hospital_data import INITIAL_NODES, INITIAL_CORRIDORS, INITIAL_BLOCKED_CORRIDORS, INITIAL_EMERGENCIES

# In-memory mutable state
STATE = {
    "nodes": list(INITIAL_NODES),
    "corridors": list(INITIAL_CORRIDORS),
    "blocked_corridors": list(INITIAL_BLOCKED_CORRIDORS),
    "emergencies": list(INITIAL_EMERGENCIES),
    "history": [],
    "simulation_active": False,
    "last_simulation": None
}


class RapidRouteHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json(self, status_code: int, data: dict):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def _read_json_body(self) -> dict:
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        try:
            return json.loads(body.decode("utf-8"))
        except Exception:
            return {}

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._send_json(200, {
                "status": "online",
                "service": "RapidRoute+ Engine",
                "algorithms": ["Dijkstra", "BFS", "PriorityQueue (MinHeap)"],
                "python_version": sys.version
            })
            return

        if path == "/api/graph":
            self._send_json(200, {
                "nodes": STATE["nodes"],
                "corridors": STATE["corridors"],
                "blocked_corridors": STATE["blocked_corridors"],
                "stats": {
                    "total_nodes": len(STATE["nodes"]),
                    "total_corridors": len(STATE["corridors"]),
                    "blocked_count": len(STATE["blocked_corridors"])
                }
            })
            return

        if path == "/api/emergencies":
            pq = EmergencyPriorityQueue()
            for em in STATE["emergencies"]:
                pq.push(em)
            sorted_cases = pq.to_sorted_list()
            self._send_json(200, {
                "emergencies": sorted_cases,
                "total_count": len(sorted_cases),
                "next_emergency": pq.peek(),
                "priority_queue_info": {
                    "data_structure": "Binary Min-Heap",
                    "time_complexity": "O(log n) insertion / extraction",
                    "triage_policy": "Severity (Critical=1 -> Low=4), tiebreaker=Arrival Time"
                }
            })
            return

        if path == "/api/analytics":
            # Compute real breakdown
            sev_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
            for em in STATE["emergencies"]:
                s = em.get("severity", "MEDIUM").upper()
                if s in sev_counts:
                    sev_counts[s] += 1
                else:
                    sev_counts["MEDIUM"] += 1

            total_runs = len(STATE["history"])
            avg_time = 0.0
            if total_runs > 0:
                avg_time = sum(h.get("total_cost", 0.0) for h in STATE["history"]) / total_runs
            else:
                avg_time = 6.8  # Seed baseline

            self._send_json(200, {
                "severity_distribution": sev_counts,
                "total_emergencies": len(STATE["emergencies"]),
                "active_blocked_corridors": len(STATE["blocked_corridors"]),
                "algorithm_runs_count": total_runs,
                "average_route_time_minutes": round(avg_time, 1),
                "recent_runs": STATE["history"][-6:],
                "system_status": {
                    "triage_state": "GREEN" if sev_counts["CRITICAL"] == 0 else "AMBER" if sev_counts["CRITICAL"] < 3 else "RED",
                    "dispatch_readiness": "100% Operational"
                }
            })
            return

        self._send_json(404, {"error": f"Endpoint '{path}' not found."})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._read_json_body()

        if path == "/api/route/dijkstra":
            start = body.get("start", "Emergency Gate")
            destination = body.get("destination", "ICU")
            blocked = body.get("blocked_corridors", STATE["blocked_corridors"])

            res = find_dijkstra_route(
                start=start,
                destination=destination,
                nodes=STATE["nodes"],
                corridors=STATE["corridors"],
                blocked_corridors_input=blocked
            )

            if res.get("success"):
                STATE["history"].append({
                    "algorithm": "Dijkstra",
                    "start": start,
                    "destination": destination,
                    "total_cost": res.get("total_cost", 0.0),
                    "path_length": len(res.get("path", []))
                })

            self._send_json(200 if res.get("success") else 400, res)
            return

        if path == "/api/route/bfs":
            start = body.get("start", "Emergency Gate")
            destination = body.get("destination", "ICU")
            blocked = body.get("blocked_corridors", STATE["blocked_corridors"])

            res = find_bfs_route(
                start=start,
                destination=destination,
                nodes=STATE["nodes"],
                corridors=STATE["corridors"],
                blocked_corridors_input=blocked
            )

            if res.get("success"):
                STATE["history"].append({
                    "algorithm": "BFS",
                    "start": start,
                    "destination": destination,
                    "total_cost": res.get("total_cost", 0.0),
                    "hops": res.get("hops", 0)
                })

            self._send_json(200 if res.get("success") else 400, res)
            return

        if path == "/api/emergencies/add":
            patient_id = body.get("patient_id", f"EMR-{108 + len(STATE['emergencies'])}")
            new_em = {
                "id": patient_id,
                "patient_id": patient_id,
                "patient_name": body.get("patient_name", f"Patient {patient_id}"),
                "patient_type": body.get("patient_type", "Acute Triage"),
                "start": body.get("start", "Emergency Gate"),
                "destination": body.get("destination", "ICU"),
                "severity": body.get("severity", "HIGH").upper(),
                "priority": body.get("priority", 2),
                "arrival_time": body.get("arrival_time", "08:30"),
                "notes": body.get("notes", "New triage intake registered by command center.")
            }
            STATE["emergencies"].append(new_em)
            
            # Recompute priority queue order
            pq = EmergencyPriorityQueue()
            for em in STATE["emergencies"]:
                pq.push(em)
                
            self._send_json(201, {
                "success": True,
                "created": new_em,
                "queue_size": len(STATE["emergencies"]),
                "next_emergency": pq.peek()
            })
            return

        if path == "/api/corridors/toggle":
            corridor_key = body.get("corridor")
            u = body.get("from")
            v = body.get("to")
            
            if not corridor_key and u and v:
                corridor_key = f"{u}|{v}"
                
            if not corridor_key:
                self._send_json(400, {"error": "Missing corridor identifier (format: 'DeptA|DeptB')"})
                return

            parts = corridor_key.replace("::", "|").split("|")
            c1 = f"{parts[0]}|{parts[1]}"
            c2 = f"{parts[1]}|{parts[0]}"
            c_canon = f"{parts[0]}::{parts[1]}" if parts[0] < parts[1] else f"{parts[1]}::{parts[0]}"

            # Check if currently blocked
            is_present = False
            for b in list(STATE["blocked_corridors"]):
                if b in (c1, c2, c_canon):
                    STATE["blocked_corridors"].remove(b)
                    is_present = True

            if not is_present:
                STATE["blocked_corridors"].append(c1)
                new_state = "BLOCKED"
            else:
                new_state = "AVAILABLE"

            self._send_json(200, {
                "success": True,
                "corridor": corridor_key,
                "status": new_state,
                "blocked_corridors": STATE["blocked_corridors"]
            })
            return

        if path == "/api/simulation/start":
            # 1. Pop highest priority emergency from MinHeap
            pq = EmergencyPriorityQueue()
            for em in STATE["emergencies"]:
                pq.push(em)
            next_case = pq.peek()
            
            if not next_case:
                self._send_json(400, {"error": "Emergency queue is currently empty."})
                return

            # 2. Run Dijkstra on the highest priority emergency
            dijkstra_res = find_dijkstra_route(
                start=next_case["start"],
                destination=next_case["destination"],
                nodes=STATE["nodes"],
                corridors=STATE["corridors"],
                blocked_corridors_input=STATE["blocked_corridors"]
            )

            bfs_res = find_bfs_route(
                start=next_case["start"],
                destination=next_case["destination"],
                nodes=STATE["nodes"],
                corridors=STATE["corridors"],
                blocked_corridors_input=STATE["blocked_corridors"]
            )

            sim_record = {
                "patient": next_case,
                "dijkstra": dijkstra_res,
                "bfs": bfs_res,
                "status": "ROUTE LOCKED",
                "timestamp": "Now"
            }
            STATE["last_simulation"] = sim_record

            self._send_json(200, {
                "success": True,
                "message": "Emergency dispatch simulation initiated.",
                "data": sim_record
            })
            return

        self._send_json(404, {"error": f"POST endpoint '{path}' not found."})


def run_server(port: int = 5000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, RapidRouteHandler)
    print(f"RapidRoute+ Python backend running on http://127.0.0.1:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down RapidRoute+ backend.")
        httpd.server_close()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5000)
    args = parser.parse_args()
    run_server(args.port)
