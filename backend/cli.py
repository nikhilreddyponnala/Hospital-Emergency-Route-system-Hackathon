"""
RapidRoute+ Hospital Emergency Route System
Python CLI Interface & Algorithm Runner

Provides a clean JSON command line interface for executing Dijkstra, BFS,
and Priority Queue algorithms directly from Node/Express or external callers.
"""

import argparse
import json
import sys
import os

# Ensure backend root is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from algorithms.dijkstra import find_dijkstra_route
from algorithms.bfs import find_bfs_route
from algorithms.priority_queue import EmergencyPriorityQueue
from data.hospital_data import INITIAL_NODES, INITIAL_CORRIDORS, INITIAL_BLOCKED_CORRIDORS, INITIAL_EMERGENCIES


def parse_args():
    parser = argparse.ArgumentParser(description="RapidRoute+ Algorithm Runner")
    parser.add_argument("--action", required=True, choices=["dijkstra", "bfs", "queue_sort", "graph_data", "test"])
    parser.add_argument("--start", default="Emergency Gate")
    parser.add_argument("--destination", default="ICU")
    parser.add_argument("--blocked", default="[]", help="JSON array of blocked corridor keys")
    parser.add_argument("--emergencies", default="[]", help="JSON array of emergency cases")
    return parser.parse_args()


def main():
    args = parse_args()

    try:
        blocked_corridors = json.loads(args.blocked) if args.blocked else INITIAL_BLOCKED_CORRIDORS
    except Exception:
        blocked_corridors = INITIAL_BLOCKED_CORRIDORS

    if args.action == "graph_data":
        output = {
            "nodes": INITIAL_NODES,
            "corridors": INITIAL_CORRIDORS,
            "default_blocked": INITIAL_BLOCKED_CORRIDORS,
            "sample_emergencies": INITIAL_EMERGENCIES
        }
        print(json.dumps(output))
        return

    if args.action == "dijkstra":
        res = find_dijkstra_route(
            start=args.start,
            destination=args.destination,
            nodes=INITIAL_NODES,
            corridors=INITIAL_CORRIDORS,
            blocked_corridors_input=blocked_corridors
        )
        print(json.dumps(res))
        return

    if args.action == "bfs":
        res = find_bfs_route(
            start=args.start,
            destination=args.destination,
            nodes=INITIAL_NODES,
            corridors=INITIAL_CORRIDORS,
            blocked_corridors_input=blocked_corridors
        )
        print(json.dumps(res))
        return

    if args.action == "queue_sort":
        try:
            raw_cases = json.loads(args.emergencies) if args.emergencies else INITIAL_EMERGENCIES
        except Exception:
            raw_cases = INITIAL_EMERGENCIES

        pq = EmergencyPriorityQueue()
        for item in raw_cases:
            pq.push(item)

        sorted_queue = pq.to_sorted_list()
        peek_item = pq.peek()

        output = {
            "success": True,
            "queue_size": pq.size(),
            "next_emergency": peek_item,
            "sorted_queue": sorted_queue
        }
        print(json.dumps(output))
        return

    if args.action == "test":
        print(json.dumps({"status": "ok", "algorithms_available": ["dijkstra", "bfs", "priority_queue"]}))
        return


if __name__ == "__main__":
    main()
