"""
RapidRoute+ Hospital Emergency Route System
Custom Priority Queue Implementation (DAA Hackathon)

This module implements a custom Min-Heap from scratch without relying on external
priority queue libraries. The priority is determined by:
1. Severity rank: CRITICAL (1) > HIGH (2) > MEDIUM (3) > LOW (4)
2. Arrival timestamp: earlier arrivals receive higher priority for equal severity.
"""

from typing import Any, Dict, List, Optional


SEVERITY_WEIGHTS = {
    "CRITICAL": 1,
    "HIGH": 2,
    "MEDIUM": 3,
    "LOW": 4
}


class PriorityQueueNode:
    """Represents an emergency case in the priority queue."""
    def __init__(self, data: Dict[str, Any]):
        self.patient_id = data.get("id", data.get("patient_id", "EMR-UNKNOWN"))
        self.patient_name = data.get("patient_name", data.get("name", "Unknown Patient"))
        self.patient_type = data.get("patient_type", data.get("type", "General Emergency"))
        self.start = data.get("start", data.get("current_location", "Emergency Gate"))
        self.destination = data.get("destination", "ICU")
        
        # Severity ranking
        raw_severity = str(data.get("severity", "MEDIUM")).upper()
        self.severity = raw_severity if raw_severity in SEVERITY_WEIGHTS else "MEDIUM"
        self.severity_rank = SEVERITY_WEIGHTS[self.severity]
        
        # Priority numeric override if provided (lower number = higher priority)
        self.priority = int(data.get("priority", self.severity_rank))
        
        # Arrival time (can be timestamp float or HH:MM string converted to comparable value)
        arrival = data.get("arrival_time", "08:00")
        self.arrival_time = str(arrival)
        self.arrival_key = self._parse_arrival_key(arrival)
        
        self.notes = data.get("notes", "")

    def _parse_arrival_key(self, arrival: Any) -> float:
        """Converts arrival time into a sortable numeric key."""
        try:
            if isinstance(arrival, (int, float)):
                return float(arrival)
            s = str(arrival).strip()
            if ":" in s:
                parts = s.split(":")
                hh = int(parts[0])
                mm = int(parts[1]) if len(parts) > 1 else 0
                ss = int(parts[2]) if len(parts) > 2 else 0
                return hh * 3600 + mm * 60 + ss
            return float(s)
        except Exception:
            return 999999.0

    def __lt__(self, other: "PriorityQueueNode") -> bool:
        """Min-heap comparison rule: lower rank (higher severity) first, then earlier arrival."""
        if self.severity_rank != other.severity_rank:
            return self.severity_rank < other.severity_rank
        if self.priority != other.priority:
            return self.priority < other.priority
        return self.arrival_key < other.arrival_key

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.patient_id,
            "patient_id": self.patient_id,
            "patient_name": self.patient_name,
            "patient_type": self.patient_type,
            "start": self.start,
            "destination": self.destination,
            "severity": self.severity,
            "priority": self.priority,
            "severity_rank": self.severity_rank,
            "arrival_time": self.arrival_time,
            "notes": self.notes
        }


class EmergencyPriorityQueue:
    """
    Custom Binary Min-Heap Implementation for Emergency Patient Triage.
    Time Complexity:
      - Push: O(log n)
      - Pop: O(log n)
      - Peek: O(1)
      - Size: O(1)
    """
    def __init__(self):
        self.heap: List[PriorityQueueNode] = []

    def is_empty(self) -> bool:
        return len(self.heap) == 0

    def size(self) -> int:
        return len(self.heap)

    def push(self, emergency_data: Dict[str, Any]) -> None:
        """Inserts a new emergency case and sifts up to restore heap invariant."""
        node = PriorityQueueNode(emergency_data)
        self.heap.append(node)
        self._sift_up(len(self.heap) - 1)

    def pop(self) -> Optional[Dict[str, Any]]:
        """Removes and returns the highest priority emergency (root of min-heap)."""
        if self.is_empty():
            return None
        if len(self.heap) == 1:
            return self.heap.pop().to_dict()
        
        # Swap root with last element
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._sift_down(0)
        return root.to_dict()

    def peek(self) -> Optional[Dict[str, Any]]:
        """Returns the highest priority emergency without removing it."""
        if self.is_empty():
            return None
        return self.heap[0].to_dict()

    def _sift_up(self, index: int) -> None:
        """Bubble up element at index while it is smaller than its parent."""
        parent = (index - 1) // 2
        while index > 0 and self.heap[index] < self.heap[parent]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            index = parent
            parent = (index - 1) // 2

    def _sift_down(self, index: int) -> None:
        """Bubble down element at index while it is greater than any child."""
        n = len(self.heap)
        while True:
            left = 2 * index + 1
            right = 2 * index + 2
            smallest = index

            if left < n and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < n and self.heap[right] < self.heap[smallest]:
                smallest = right

            if smallest != index:
                self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
                index = smallest
            else:
                break

    def to_sorted_list(self) -> List[Dict[str, Any]]:
        """Returns a snapshot of the queue sorted by triage priority without destroying state."""
        cloned = list(self.heap)
        cloned.sort()
        return [node.to_dict() for node in cloned]
