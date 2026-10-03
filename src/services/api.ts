import {
  GraphDataResponse,
  PriorityQueueResponse,
  DijkstraResult,
  BFSResult,
  AnalyticsResponse,
  EmergencyCase
} from '../types/hospital';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health status');
    return res.json();
  },

  async getGraphData(): Promise<GraphDataResponse> {
    const res = await fetch(`${API_BASE}/graph`);
    if (!res.ok) throw new Error('Failed to fetch hospital graph data');
    return res.json();
  },

  async getEmergencies(): Promise<PriorityQueueResponse> {
    const res = await fetch(`${API_BASE}/emergencies`);
    if (!res.ok) throw new Error('Failed to fetch priority queue emergencies');
    return res.json();
  },

  async addEmergency(emergency: Partial<EmergencyCase>): Promise<{ success: boolean; created: EmergencyCase }> {
    const res = await fetch(`${API_BASE}/emergencies/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emergency)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to admit emergency patient');
    }
    return res.json();
  },

  async toggleCorridor(corridorKey: string): Promise<{ success: boolean; status: string; blocked_corridors: string[] }> {
    const res = await fetch(`${API_BASE}/corridors/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corridor: corridorKey })
    });
    if (!res.ok) throw new Error('Failed to toggle corridor status');
    return res.json();
  },

  async runDijkstra(start: string, destination: string, blockedCorridors?: string[]): Promise<DijkstraResult> {
    const res = await fetch(`${API_BASE}/route/dijkstra`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start,
        destination,
        blocked_corridors: blockedCorridors
      })
    });
    const data = await res.json();
    if (!res.ok && !data.error) {
      throw new Error('Dijkstra calculation failed');
    }
    return data;
  },

  async runBFS(start: string, destination: string, blockedCorridors?: string[]): Promise<BFSResult> {
    const res = await fetch(`${API_BASE}/route/bfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start,
        destination,
        blocked_corridors: blockedCorridors
      })
    });
    const data = await res.json();
    if (!res.ok && !data.error) {
      throw new Error('BFS calculation failed');
    }
    return data;
  },

  async startSimulation(): Promise<{
    success: boolean;
    patient: EmergencyCase;
    dijkstra: DijkstraResult;
    bfs: BFSResult;
    status: string;
    blocked_corridors: string[];
  }> {
    const res = await fetch(`${API_BASE}/simulation/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Simulation dispatch failed');
    }
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsResponse> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics metrics');
    return res.json();
  }
};
