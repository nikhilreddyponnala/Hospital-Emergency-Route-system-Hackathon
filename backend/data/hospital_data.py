"""
RapidRoute+ Hospital Emergency Route System
Hospital Topology & Initial Seed Data

Defines the 12 clinical locations, 18 inter-department corridors,
and initial patient triage queue.
"""

from typing import Any, Dict, List


INITIAL_NODES: List[Dict[str, Any]] = [
    {
        "id": "node-1",
        "name": "Emergency Gate",
        "category": "GATE",
        "wing": "Ambulance Bay South",
        "floor": "Ground Floor",
        "x": 80,
        "y": 280,
        "icon": "Ambulance",
        "description": "Primary paramedic drop-off and triage intake checkpoint.",
        "capacity": "4 Bays Active"
    },
    {
        "id": "node-2",
        "name": "Emergency Department",
        "category": "EMERGENCY",
        "wing": "Trauma Wing A",
        "floor": "Ground Floor",
        "x": 260,
        "y": 170,
        "icon": "Siren",
        "description": "Acute resuscitation, rapid triage evaluation, and trauma bays.",
        "capacity": "18 Resus Beds"
    },
    {
        "id": "node-3",
        "name": "Reception",
        "category": "ADMIN",
        "wing": "Central Atrium",
        "floor": "Ground Floor",
        "x": 260,
        "y": 400,
        "icon": "Building2",
        "description": "Main ambulatory check-in, family registration, and patient routing desk.",
        "capacity": "Staffed 24/7"
    },
    {
        "id": "node-4",
        "name": "Diagnostics Lab",
        "category": "DIAGNOSTICS",
        "wing": "Clinical Services Wing",
        "floor": "1st Floor",
        "x": 480,
        "y": 270,
        "icon": "FlaskConical",
        "description": "Stat blood analyzer, rapid PCR, pathology, and cross-matching.",
        "capacity": "Automated Line"
    },
    {
        "id": "node-5",
        "name": "Operation Theatre",
        "category": "SURGERY",
        "wing": "Surgical Suites North",
        "floor": "2nd Floor",
        "x": 680,
        "y": 140,
        "icon": "Scissors",
        "description": "Sterile surgical theaters OT-1 through OT-6 with immediate trauma bypass.",
        "capacity": "4 Suites Active"
    },
    {
        "id": "node-6",
        "name": "ICU",
        "category": "CRITICAL",
        "wing": "Critical Care Pavilion",
        "floor": "2nd Floor",
        "x": 760,
        "y": 290,
        "icon": "HeartPulse",
        "description": "Intensive Care Unit equipped with mechanical ventilators and arterial line monitoring.",
        "capacity": "12 High-Acuity Beds"
    },
    {
        "id": "node-7",
        "name": "General Ward",
        "category": "INPATIENT",
        "wing": "West Inpatient Tower",
        "floor": "3rd Floor",
        "x": 680,
        "y": 480,
        "icon": "BedDouble",
        "description": "Sub-acute inpatient beds, post-op telemetry, and stable recovery.",
        "capacity": "45 Beds"
    },
    {
        "id": "node-8",
        "name": "Pharmacy",
        "category": "PHARMACY",
        "wing": "Central Services",
        "floor": "Ground Floor",
        "x": 460,
        "y": 480,
        "icon": "Pill",
        "description": "24/7 inpatient dispensary for emergency narcotics, vasopressors, and fluids.",
        "capacity": "Pneumatic Tube Hub"
    },
    {
        "id": "node-9",
        "name": "Blood Bank",
        "category": "LAB",
        "wing": "Pathology East",
        "floor": "1st Floor",
        "x": 380,
        "y": 70,
        "icon": "Droplet",
        "description": "O-negative reserve blood, fresh frozen plasma, and cryoprecipitate storage.",
        "capacity": "Massive Transfusion Protocol"
    },
    {
        "id": "node-10",
        "name": "Cardiology",
        "category": "SPECIALTY",
        "wing": "Heart & Vascular Institute",
        "floor": "2nd Floor",
        "x": 560,
        "y": 70,
        "icon": "Activity",
        "description": "Cardiac Catheterization Lab (Cath Lab) and coronary care telemetry unit.",
        "capacity": "Cath Lab Ready"
    },
    {
        "id": "node-11",
        "name": "Radiology",
        "category": "DIAGNOSTICS",
        "wing": "Imaging Pavilion",
        "floor": "Basement 1",
        "x": 520,
        "y": 380,
        "icon": "Scan",
        "description": "High-speed 128-slice CT scanner, 3T MRI, digital trauma X-ray.",
        "capacity": "2 CT + 1 MRI"
    },
    {
        "id": "node-12",
        "name": "Exit Gate",
        "category": "GATE",
        "wing": "North Discharge Loop",
        "floor": "Ground Floor",
        "x": 930,
        "y": 440,
        "icon": "DoorOpen",
        "description": "Patient discharge gate, medical transport loading, and ambulance exit.",
        "capacity": "Clear Access"
    }
]


INITIAL_CORRIDORS: List[Dict[str, Any]] = [
    {
        "id": "c-1",
        "from": "Emergency Gate",
        "to": "Emergency Department",
        "weight": 2.0,
        "type": "Triage Rapid Ramp",
        "distance_meters": 120
    },
    {
        "id": "c-2",
        "from": "Emergency Gate",
        "to": "Reception",
        "weight": 3.0,
        "type": "Ambulatory Walkway",
        "distance_meters": 180
    },
    {
        "id": "c-3",
        "from": "Emergency Department",
        "to": "Diagnostics Lab",
        "weight": 3.0,
        "type": "Elevator Bank A + Concourse",
        "distance_meters": 190
    },
    {
        "id": "c-4",
        "from": "Emergency Department",
        "to": "ICU",
        "weight": 2.0,
        "type": "Direct Trauma Express Elevator",
        "distance_meters": 140
    },
    {
        "id": "c-5",
        "from": "Reception",
        "to": "Diagnostics Lab",
        "weight": 2.0,
        "type": "Central Corridor East",
        "distance_meters": 130
    },
    {
        "id": "c-6",
        "from": "Diagnostics Lab",
        "to": "ICU",
        "weight": 3.0,
        "type": "Critical Access Skybridge",
        "distance_meters": 200
    },
    {
        "id": "c-7",
        "from": "Diagnostics Lab",
        "to": "Operation Theatre",
        "weight": 2.0,
        "type": "Surgical Sterile Corridor",
        "distance_meters": 135
    },
    {
        "id": "c-8",
        "from": "Reception",
        "to": "Pharmacy",
        "weight": 2.0,
        "type": "Ground Floor South Corridor",
        "distance_meters": 140
    },
    {
        "id": "c-9",
        "from": "Pharmacy",
        "to": "General Ward",
        "weight": 3.0,
        "type": "Inpatient West Wing Elevator",
        "distance_meters": 195
    },
    {
        "id": "c-10",
        "from": "General Ward",
        "to": "ICU",
        "weight": 4.0,
        "type": "Connecting Inter-Ward Tunnel",
        "distance_meters": 260
    },
    {
        "id": "c-11",
        "from": "Operation Theatre",
        "to": "ICU",
        "weight": 2.0,
        "type": "Post-Op Recovery Transit",
        "distance_meters": 110
    },
    {
        "id": "c-12",
        "from": "Emergency Department",
        "to": "Blood Bank",
        "weight": 2.0,
        "type": "Rapid Blood Supply Hallway",
        "distance_meters": 130
    },
    {
        "id": "c-13",
        "from": "Blood Bank",
        "to": "Cardiology",
        "weight": 3.0,
        "type": "Cardiovascular Connector",
        "distance_meters": 185
    },
    {
        "id": "c-14",
        "from": "Cardiology",
        "to": "ICU",
        "weight": 3.0,
        "type": "Coronary Care Skywalk",
        "distance_meters": 175
    },
    {
        "id": "c-15",
        "from": "Reception",
        "to": "Radiology",
        "weight": 3.0,
        "type": "Basement Ramp / Lift B",
        "distance_meters": 170
    },
    {
        "id": "c-16",
        "from": "Radiology",
        "to": "ICU",
        "weight": 4.0,
        "type": "Service Elevator Bank C",
        "distance_meters": 240
    },
    {
        "id": "c-17",
        "from": "Emergency Gate",
        "to": "Exit Gate",
        "weight": 5.0,
        "type": "Outer Campus Perimeter Road",
        "distance_meters": 420
    },
    {
        "id": "c-18",
        "from": "General Ward",
        "to": "Exit Gate",
        "weight": 3.0,
        "type": "Discharge Ramp West",
        "distance_meters": 210
    }
]


# Default blocked corridors for the Hackathon Demonstration
# Initial state: "Emergency Department|ICU" is BLOCKED
# This forces Dijkstra to find alternative optimal path:
# Emergency Gate -> Emergency Department -> Diagnostics Lab -> ICU (8 min)
INITIAL_BLOCKED_CORRIDORS: List[str] = [
    "Emergency Department|ICU"
]


INITIAL_EMERGENCIES: List[Dict[str, Any]] = [
    {
        "id": "EMR-104",
        "patient_id": "EMR-104",
        "patient_name": "Marcus Vance (Age 58)",
        "patient_type": "Cardiac Emergency",
        "start": "Emergency Gate",
        "destination": "ICU",
        "severity": "CRITICAL",
        "priority": 1,
        "arrival_time": "08:14",
        "notes": "Acute STEMI with hemodynamic instability. Requires immediate coronary bedside intervention."
    },
    {
        "id": "EMR-105",
        "patient_id": "EMR-105",
        "patient_name": "Elena Rodriguez (Age 32)",
        "patient_type": "Severe Trauma",
        "start": "Emergency Gate",
        "destination": "Operation Theatre",
        "severity": "HIGH",
        "priority": 2,
        "arrival_time": "08:19",
        "notes": "Motor vehicle collision with intra-abdominal hemorrhage. Fast ultrasound positive."
    },
    {
        "id": "EMR-106",
        "patient_id": "EMR-106",
        "patient_name": "David Kim (Age 45)",
        "patient_type": "Compound Fracture",
        "start": "Emergency Gate",
        "destination": "Radiology",
        "severity": "MEDIUM",
        "priority": 3,
        "arrival_time": "08:22",
        "notes": "Open tibial fracture requiring emergent CT cross-sectional alignment."
    },
    {
        "id": "EMR-107",
        "patient_id": "EMR-107",
        "patient_name": "Sarah Jenkins (Age 27)",
        "patient_type": "General Emergency",
        "start": "Emergency Gate",
        "destination": "Pharmacy",
        "severity": "LOW",
        "priority": 4,
        "arrival_time": "08:25",
        "notes": "Severe allergic urticaria, responsive to initial antihistamine triage protocol."
    }
]
