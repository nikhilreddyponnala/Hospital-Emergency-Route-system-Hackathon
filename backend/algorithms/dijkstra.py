"""
RapidRoute+ Hospital Emergency Route System
Custom Dijkstra's Algorithm Implementation (DAA Hackathon)

Finds the minimum-cost / fastest safe path in a weighted hospital graph.
Excludes blocked corridors and produces an interpretable decision trace.
"""

from typing import Any, Dict, List, Set, Tuple


def canonical_corridor(u: str, v: str) -> str:
    """Returns canonical string identifier for undirected corridor between u and v."""
    return f"{u}::{v}" if u < v else f"{v}::{u}"


def is_corridor_blocked(u: str, v: str, blocked_corridors: Set[str]) -> bool:
    """Checks whether corridor between u and v is blocked."""
    c1 = canonical_corridor(u, v)
    c2 = f"{u}|{v}"
    c3 = f"{v}|{u}"
    return c1 in blocked_corridors or c2 in blocked_corridors or c3 in blocked_corridors


class DijkstraMinHeap:
    """Min-heap for (cost, node) pairs in Dijkstra's algorithm."""
    def __init__(self):
        self.heap: List[Tuple[float, str]] = []

    def push(self, cost: float, node: str) -> None:
        self.heap.append((cost, node))
        self._sift_up(len(self.heap) - 1)

    def pop(self) -> Tuple[float, str]:
        if not self.heap:
            raise IndexError("pop from empty heap")
        if len(self.heap) == 1:
            return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._sift_down(0)
        return root

    def is_empty(self) -> bool:
        return len(self.heap) == 0

    def _sift_up(self, idx: int) -> None:
        parent = (idx - 1) // 2
        while idx > 0 and self.heap[idx][0] < self.heap[parent][0]:
            self.heap[idx], self.heap[parent] = self.heap[parent], self.heap[idx]
            idx = parent
            parent = (idx - 1) // 2

    def _sift_down(self, idx: int) -> None:
        n = len(self.heap)
        while True:
            left = 2 * idx + 1
            right = 2 * idx + 2
            smallest = idx

            if left < n and self.heap[left][0] < self.heap[smallest][0]:
                smallest = left
            if right < n and self.heap[right][0] < self.heap[smallest][0]:
                smallest = right

            if smallest != idx:
                self.heap[idx], self.heap[smallest] = self.heap[smallest], self.heap[idx]
                idx = smallest
            else:
                break


def find_dijkstra_route(
    start: str,
    destination: str,
    nodes: List[Dict[str, Any]],
    corridors: List[Dict[str, Any]],
    blocked_corridors_input: List[str]
) -> Dict[str, Any]:
    """
    Executes Dijkstra's Algorithm from start to destination on weighted hospital graph.
    """
    # 0. Normalize blocked set
    blocked_set: Set[str] = set()
    for b in blocked_corridors_input:
        if "|" in b:
            parts = b.split("|")
            blocked_set.add(canonical_corridor(parts[0], parts[1]))
            blocked_set.add(b)
        elif "::" in b:
            parts = b.split("::")
            blocked_set.add(canonical_corridor(parts[0], parts[1]))
            blocked_set.add(b)
        else:
            blocked_set.add(b)

    # 1. Build adjacency list representation: graph[u] = [(v, weight)]
    node_names = {n["name"] for n in nodes}
    graph: Dict[str, List[Tuple[str, float]]] = {name: [] for name in node_names}
    
    for c in corridors:
        u = c["from"]
        v = c["to"]
        weight = float(c.get("weight", c.get("time", 1.0)))
        if u in graph and v in graph:
            graph[u].append((v, weight))
            graph[v].append((u, weight))

    # Validation
    if start not in node_names:
        return {
            "success": False,
            "error": f"Start location '{start}' not found in hospital network.",
            "algorithm": "Dijkstra"
        }
    if destination not in node_names:
        return {
            "success": False,
            "error": f"Destination location '{destination}' not found in hospital network.",
            "algorithm": "Dijkstra"
        }

    if start == destination:
        return {
            "success": True,
            "algorithm": "Dijkstra",
            "path": [start],
            "total_cost": 0.0,
            "visited_nodes": [start],
            "distance_table": {start: 0.0},
            "steps": [{
                "step": 1,
                "selected_node": start,
                "cost": 0.0,
                "action": "Start and destination are identical.",
                "evaluated_neighbors": []
            }],
            "edges_evaluated": 0,
            "why_this_route": "Origin is already destination (zero transit required)."
        }

    # 2. Dijkstra Data Structures
    # - distances: distance dictionary initialized to infinity
    # - previous: tracks predecessors to reconstruct shortest path
    # - visited_nodes: order in which nodes are finalized
    # - steps: recorded trace for educational visualization
    distances: Dict[str, float] = {name: float("inf") for name in node_names}
    distances[start] = 0.0
    previous: Dict[str, Optional[str]] = {name: None for name in node_names}
    visited_nodes: List[str] = []
    finalized_set: Set[str] = set()
    steps: List[Dict[str, Any]] = []

    pq = DijkstraMinHeap()
    pq.push(0.0, start)

    edges_evaluated = 0
    step_counter = 0

    while not pq.is_empty():
        curr_cost, curr_node = pq.pop()

        # Ignore outdated queue entries
        if curr_node in finalized_set:
            continue

        finalized_set.add(curr_node)
        visited_nodes.append(curr_node)
        step_counter += 1

        step_record = {
            "step": step_counter,
            "selected_node": curr_node,
            "cost": curr_cost,
            "evaluated_neighbors": [],
            "action": f"Settled {curr_node} with optimal cost {curr_cost:.1f} min"
        }

        # Early exit if we finalized destination
        if curr_node == destination:
            steps.append(step_record)
            break

        # Visit neighboring nodes
        for neighbor, edge_weight in graph[curr_node]:
            edges_evaluated += 1

            # Check if corridor is blocked
            is_blocked = is_corridor_blocked(curr_node, neighbor, blocked_set)
            
            if is_blocked:
                step_record["evaluated_neighbors"].append({
                    "neighbor": neighbor,
                    "edge_weight": edge_weight,
                    "status": "BLOCKED",
                    "note": f"Corridor {curr_node} <-> {neighbor} is obstructed"
                })
                continue

            if neighbor in finalized_set:
                step_record["evaluated_neighbors"].append({
                    "neighbor": neighbor,
                    "edge_weight": edge_weight,
                    "status": "ALREADY_FINALIZED",
                    "note": f"{neighbor} already has settled shortest path"
                })
                continue

            tentative_distance = curr_cost + edge_weight

            if tentative_distance < distances[neighbor]:
                old_dist = distances[neighbor]
                distances[neighbor] = tentative_distance
                previous[neighbor] = curr_node
                pq.push(tentative_distance, neighbor)
                
                step_record["evaluated_neighbors"].append({
                    "neighbor": neighbor,
                    "edge_weight": edge_weight,
                    "status": "UPDATED",
                    "old_distance": None if old_dist == float("inf") else old_dist,
                    "new_distance": tentative_distance,
                    "note": f"Relaxed edge: distance improved to {tentative_distance:.1f} min"
                })
            else:
                step_record["evaluated_neighbors"].append({
                    "neighbor": neighbor,
                    "edge_weight": edge_weight,
                    "status": "NOT_IMPROVED",
                    "current_best": distances[neighbor],
                    "tentative": tentative_distance,
                    "note": f"Path via {curr_node} ({tentative_distance:.1f}) not faster than current best ({distances[neighbor]:.1f})"
                })

        steps.append(step_record)

    # 3. Path reconstruction
    if distances[destination] == float("inf"):
        return {
            "success": False,
            "algorithm": "Dijkstra",
            "error": "No safe route is currently available between these locations. Please check blocked corridors.",
            "visited_nodes": visited_nodes,
            "steps": steps,
            "edges_evaluated": edges_evaluated,
            "why_this_route": "All feasible pathways to the target location are severed by corridor blockages."
        }

    path: List[str] = []
    curr = destination
    while curr is not None:
        path.append(curr)
        curr = previous[curr]
    path.reverse()

    # Friendly human explanation
    total_cost = distances[destination]
    direct_blocked = False
    for i in range(len(corridors)):
        c = corridors[i]
        if (c["from"] == start and c["to"] == destination) or (c["from"] == destination and c["to"] == start):
            if is_corridor_blocked(start, destination, blocked_set):
                direct_blocked = True

    if direct_blocked:
        why = (
            f"The direct corridor between {start} and {destination} is BLOCKED. "
            f"Dijkstra evaluated all alternate available corridors through {', '.join(path[1:-1])} "
            f"and selected the minimum-cost detour with total transit time of {total_cost:.1f} minutes."
        )
    elif len(blocked_set) > 0:
        blocked_names = list(blocked_set)[:2]
        why = (
            f"Dijkstra's algorithm minimized cumulative transit time ({total_cost:.1f} min) "
            f"over {len(path)-1} corridor segments while safely bypassing active blockages "
            f"({', '.join(blocked_names)})."
        )
    else:
        why = (
            f"Dijkstra's algorithm explored {len(visited_nodes)} nodes and evaluated {edges_evaluated} edges, "
            f"guaranteeing the mathematically optimal route ({total_cost:.1f} minutes total travel time)."
        )

    # Distance table with infinity formatted cleanly
    formatted_distances = {k: (v if v != float("inf") else None) for k, v in distances.items()}

    return {
        "success": True,
        "algorithm": "Dijkstra",
        "start": start,
        "destination": destination,
        "path": path,
        "total_cost": total_cost,
        "visited_nodes": visited_nodes,
        "distance_table": formatted_distances,
        "steps": steps,
        "edges_evaluated": edges_evaluated,
        "nodes_visited_count": len(visited_nodes),
        "why_this_route": why,
        "blocked_corridors_considered": list(blocked_set)
    }
