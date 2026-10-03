"""
RapidRoute+ Hospital Emergency Route System
Custom BFS (Breadth-First Search) Implementation (DAA Hackathon)

Explores the hospital graph level-by-level using a FIFO queue.
Finds the minimum-hop path (treating each corridor as 1 unweighted hop)
and verifies graph reachability while avoiding blocked corridors.
"""

from collections import deque
from typing import Any, Dict, List, Optional, Set


def canonical_corridor(u: str, v: str) -> str:
    return f"{u}::{v}" if u < v else f"{v}::{u}"


def is_corridor_blocked(u: str, v: str, blocked_corridors: Set[str]) -> bool:
    c1 = canonical_corridor(u, v)
    c2 = f"{u}|{v}"
    c3 = f"{v}|{u}"
    return c1 in blocked_corridors or c2 in blocked_corridors or c3 in blocked_corridors


def find_bfs_route(
    start: str,
    destination: str,
    nodes: List[Dict[str, Any]],
    corridors: List[Dict[str, Any]],
    blocked_corridors_input: List[str]
) -> Dict[str, Any]:
    """
    Executes manual Breadth-First Search (BFS) to find minimum-hop route.
    """
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

    # Build adjacency list (sorted alphabetically for deterministic traversal)
    node_names = {n["name"] for n in nodes}
    graph: Dict[str, List[str]] = {name: [] for name in node_names}
    corridor_weights: Dict[str, float] = {}

    for c in corridors:
        u = c["from"]
        v = c["to"]
        w = float(c.get("weight", c.get("time", 1.0)))
        corridor_weights[canonical_corridor(u, v)] = w
        if u in graph and v in graph:
            graph[u].append(v)
            graph[v].append(u)

    for k in graph:
        graph[k].sort()

    if start not in node_names or destination not in node_names:
        return {
            "success": False,
            "algorithm": "BFS",
            "error": "Specified start or destination does not exist."
        }

    if start == destination:
        return {
            "success": True,
            "algorithm": "BFS",
            "path": [start],
            "hops": 0,
            "total_cost": 0.0,
            "visited_nodes": [start],
            "steps": [{
                "step": 1,
                "current_node": start,
                "queue_snapshot": [],
                "visited_snapshot": [start],
                "action": "Start equals destination."
            }],
            "explanation": "Start is destination (0 hops)."
        }

    # BFS structures:
    # - queue: FIFO queue storing current node
    # - visited: set of discovered nodes
    # - parent: dictionary mapping node to its predecessor
    # - depth: dictionary tracking hop count from start
    queue = deque([start])
    visited: Set[str] = {start}
    visited_order: List[str] = [start]
    parent: Dict[str, Optional[str]] = {start: None}
    depth: Dict[str, int] = {start: 0}
    steps: List[Dict[str, Any]] = []

    target_found = False
    step_num = 0

    while queue:
        curr_node = queue.popleft()
        step_num += 1

        enqueued_this_step: List[str] = []
        ignored_blocked: List[str] = []

        if curr_node == destination:
            target_found = True
            steps.append({
                "step": step_num,
                "current_node": curr_node,
                "queue_snapshot": list(queue),
                "visited_snapshot": list(visited_order),
                "action": f"Reached target destination '{destination}' at hop level {depth[curr_node]}."
            })
            break

        for neighbor in graph[curr_node]:
            # Respect blocked corridor status
            if is_corridor_blocked(curr_node, neighbor, blocked_set):
                ignored_blocked.append(neighbor)
                continue

            if neighbor not in visited:
                visited.add(neighbor)
                visited_order.append(neighbor)
                parent[neighbor] = curr_node
                depth[neighbor] = depth[curr_node] + 1
                queue.append(neighbor)
                enqueued_this_step.append(neighbor)

        steps.append({
            "step": step_num,
            "current_node": curr_node,
            "depth": depth[curr_node],
            "enqueued": enqueued_this_step,
            "blocked_corridors": ignored_blocked,
            "queue_snapshot": list(queue),
            "visited_snapshot": list(visited_order),
            "action": f"Dequeued '{curr_node}'. Enqueued {len(enqueued_this_step)} accessible unvisited neighbor(s)."
        })

    if not target_found and destination not in parent:
        return {
            "success": False,
            "algorithm": "BFS",
            "error": "No reachable path found between start and destination due to blocked corridors.",
            "visited_nodes": visited_order,
            "steps": steps,
            "explanation": "BFS explored all accessible connected components without encountering destination."
        }

    # Reconstruct path
    path: List[str] = []
    curr = destination
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    path.reverse()

    hops = len(path) - 1

    # Calculate actual cumulative travel time along the BFS path for comparison
    total_time = 0.0
    for i in range(len(path) - 1):
        c_key = canonical_corridor(path[i], path[i+1])
        total_time += corridor_weights.get(c_key, 1.0)

    explanation = (
        f"BFS traversed {len(visited_order)} nodes in level-by-level breadth order, "
        f"identifying the minimum-hop path ({hops} hops). Notice that while BFS minimizes the number of edges, "
        f"its cumulative time ({total_time:.1f} min) may differ from Dijkstra's weighted shortest path."
    )

    return {
        "success": True,
        "algorithm": "BFS",
        "start": start,
        "destination": destination,
        "path": path,
        "hops": hops,
        "total_cost": total_time,
        "visited_nodes": visited_order,
        "steps": steps,
        "nodes_visited_count": len(visited_order),
        "explanation": explanation
    }
