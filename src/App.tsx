import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import {
  HospitalNode,
  HospitalCorridor,
  EmergencyCase,
  DijkstraResult,
  BFSResult,
  AnalyticsResponse,
  SeverityLevel
} from './types/hospital';

import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { HospitalMap } from './components/HospitalMap';
import { EmergencyQueuePanel } from './components/EmergencyQueuePanel';
import { RoutePlanner } from './components/RoutePlanner';
import { AlgorithmComparison } from './components/AlgorithmComparison';
import { AnalyticsView } from './components/AnalyticsView';
import { AboutDAAView } from './components/AboutDAAView';
import { LandingHero } from './components/LandingHero';
import { HackathonDemoModal } from './components/HackathonDemoModal';
import { AddEmergencyModal } from './components/AddEmergencyModal';
import { NodeDetailModal } from './components/NodeDetailModal';
import { AppSidebar } from './components/AppSidebar';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [showLandingBanner, setShowLandingBanner] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Core Data State
  const [nodes, setNodes] = useState<HospitalNode[]>([]);
  const [corridors, setCorridors] = useState<HospitalCorridor[]>([]);
  const [blockedCorridors, setBlockedCorridors] = useState<string[]>(['Emergency Department|ICU']);
  const [emergencies, setEmergencies] = useState<EmergencyCase[]>([]);
  const [nextEmergency, setNextEmergency] = useState<EmergencyCase | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);

  // Routing Selection State
  const [startNode, setStartNode] = useState<string>('Emergency Gate');
  const [destinationNode, setDestinationNode] = useState<string>('ICU');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'Dijkstra' | 'BFS'>('Dijkstra');

  // Algorithm Results
  const [dijkstraResult, setDijkstraResult] = useState<DijkstraResult | null>(null);
  const [bfsResult, setBfsResult] = useState<BFSResult | null>(null);

  // UI Interactive Modals
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isHackathonDemoOpen, setIsHackathonDemoOpen] = useState<boolean>(false);
  const [hackathonDemoStep, setHackathonDemoStep] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [inspectedNode, setInspectedNode] = useState<HospitalNode | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    try {
      const graphData = await api.getGraphData();
      setNodes(graphData.nodes || []);
      setCorridors(graphData.corridors || []);
      setBlockedCorridors(graphData.blocked_corridors || ['Emergency Department|ICU']);

      const queueData = await api.getEmergencies();
      setEmergencies(queueData.emergencies || []);
      setNextEmergency(queueData.next_emergency || null);

      const analyticsData = await api.getAnalytics();
      setAnalytics(analyticsData);

      // Pre-compute initial demo route: Emergency Gate -> ICU with blocked Emergency Department|ICU
      const initialDijkstra = await api.runDijkstra('Emergency Gate', 'ICU', graphData.blocked_corridors);
      setDijkstraResult(initialDijkstra);

      const initialBFS = await api.runBFS('Emergency Gate', 'ICU', graphData.blocked_corridors);
      setBfsResult(initialBFS);
    } catch (err: any) {
      console.error('Failed to load initial data:', err);
      showToast('Backend initializing... Loaded default hospital topology.', 'info');
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. Route Calculation Handlers
  const handleCalculateRoute = async (start: string, dest: string, algo: 'Dijkstra' | 'BFS') => {
    setIsCalculating(true);
    try {
      if (algo === 'Dijkstra') {
        const res = await api.runDijkstra(start, dest, blockedCorridors);
        setDijkstraResult(res);
        if (res.success) {
          showToast(`Dijkstra: Optimal ${res.total_cost.toFixed(1)}m route locked`, 'success');
        } else {
          showToast(res.error || 'No route found.', 'warn');
        }
      } else {
        const res = await api.runBFS(start, dest, blockedCorridors);
        setBfsResult(res);
        if (res.success) {
          showToast(`BFS: Minimum ${res.hops} hops path found`, 'success');
        } else {
          showToast(res.error || 'No path reachable.', 'warn');
        }
      }
    } catch (err: any) {
      showToast('Calculation error: ' + err.message, 'warn');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRunSideBySide = async (start: string, dest: string) => {
    setIsCalculating(true);
    try {
      const [dijkstraRes, bfsRes] = await Promise.all([
        api.runDijkstra(start, dest, blockedCorridors),
        api.runBFS(start, dest, blockedCorridors)
      ]);
      setDijkstraResult(dijkstraRes);
      setBfsResult(bfsRes);
      showToast('Side-by-side comparison completed.', 'success');
    } catch (err: any) {
      showToast('Comparison error: ' + err.message, 'warn');
    } finally {
      setIsCalculating(false);
    }
  };

  // 3. Corridor Blockage Toggle
  const handleToggleCorridor = async (corridorKey: string) => {
    try {
      const res = await api.toggleCorridor(corridorKey);
      if (res.success) {
        setBlockedCorridors(res.blocked_corridors);
        showToast(`Corridor ${corridorKey} marked as ${res.status}. Rerouting...`, 'info');
        // Recalculate active route
        const [newDijkstra, newBFS] = await Promise.all([
          api.runDijkstra(startNode, destinationNode, res.blocked_corridors),
          api.runBFS(startNode, destinationNode, res.blocked_corridors)
        ]);
        setDijkstraResult(newDijkstra);
        setBfsResult(newBFS);
      }
    } catch (err: any) {
      showToast('Failed to toggle corridor: ' + err.message, 'warn');
    }
  };

  // 4. Emergency Simulation
  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setCurrentTab('dashboard');
    try {
      const sim = await api.startSimulation();
      if (sim.success) {
        setStartNode(sim.patient.start);
        setDestinationNode(sim.patient.destination);
        setDijkstraResult(sim.dijkstra);
        setBfsResult(sim.bfs);
        setSelectedAlgorithm('Dijkstra');
        showToast(`🚨 DISPATCHED: ${sim.patient.patient_id} (${sim.patient.severity}) → ${sim.patient.destination}`, 'success');
      }
    } catch (err: any) {
      showToast('Simulation error: ' + err.message, 'warn');
    } finally {
      setTimeout(() => setIsSimulating(false), 3000);
    }
  };

  // 5. Patient Admission
  const handleAddEmergency = async (data: any) => {
    try {
      const res = await api.addEmergency(data);
      if (res.success) {
        // Refresh queue
        const q = await api.getEmergencies();
        setEmergencies(q.emergencies);
        setNextEmergency(q.next_emergency);
        showToast(`Patient ${res.created.patient_id} inserted into Min-Heap`, 'success');
      }
    } catch (err: any) {
      showToast('Failed to admit patient: ' + err.message, 'warn');
    }
  };

  // 6. Hackathon Demo Workflow (Section 31 & 35)
  const handleStartHackathonDemo = () => {
    setIsHackathonDemoOpen(true);
    setHackathonDemoStep(1);
    applyHackathonStep(1);
  };

  const applyHackathonStep = async (step: number) => {
    setHackathonDemoStep(step);
    if (step === 1) {
      // Step 1: Show Priority Queue & highlight EMR-104
      setCurrentTab('queue');
    } else if (step === 2) {
      // Step 2: Show Origin Emergency Gate -> Destination ICU
      setStartNode('Emergency Gate');
      setDestinationNode('ICU');
      setCurrentTab('map');
    } else if (step === 3) {
      // Step 3: Show blocked Emergency Department -> ICU corridor
      setCurrentTab('map');
      if (!blockedCorridors.includes('Emergency Department|ICU')) {
        await handleToggleCorridor('Emergency Department|ICU');
      }
    } else if (step === 4) {
      // Step 4: Run Dijkstra
      setCurrentTab('planner');
      setSelectedAlgorithm('Dijkstra');
      const res = await api.runDijkstra('Emergency Gate', 'ICU', blockedCorridors);
      setDijkstraResult(res);
    } else if (step === 5) {
      // Step 5: Highlight locked route on Map
      setCurrentTab('map');
      setSelectedAlgorithm('Dijkstra');
    } else if (step === 6) {
      // Step 6: BFS Comparison
      setCurrentTab('algorithms');
      await handleRunSideBySide('Emergency Gate', 'ICU');
    }
  };

  // Counts for metric cards
  const criticalCount = emergencies.filter(e => e.severity === 'CRITICAL').length;
  const avgRouteTime = dijkstraResult?.total_cost || analytics?.average_route_time_minutes || 6.8;

  // Active path and visited nodes for map visualization
  const activePath = selectedAlgorithm === 'Dijkstra'
    ? dijkstraResult?.path || []
    : bfsResult?.path || [];

  const activeVisited = selectedAlgorithm === 'Dijkstra'
    ? dijkstraResult?.visited_nodes || []
    : bfsResult?.visited_nodes || [];

  return (
    <div className="min-h-screen bg-[#060912] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-cyan-500 selection:text-black">
      {/* 1. Master Left Operations Sidebar (Dashboard, Emergency, Route Planner, Hospital Map, and All Details) */}
      <AppSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'dashboard') setShowLandingBanner(false);
        }}
        emergencies={emergencies}
        nextEmergency={nextEmergency}
        onDispatchEmergency={(em) => {
          setStartNode(em.start);
          setDestinationNode(em.destination);
          handleCalculateRoute(em.start, em.destination, 'Dijkstra');
          showToast(`Routing patient ${em.patient_id} to ${em.destination}`, 'info');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        blockedCorridors={blockedCorridors}
        onToggleCorridor={handleToggleCorridor}
        isDispatching={isCalculating}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Right Operations & Map Viewport */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'dashboard') setShowLandingBanner(false);
          }}
          blockedCount={blockedCorridors.length}
          emergencyCount={emergencies.length}
          onStartHackathonDemo={handleStartHackathonDemo}
          onStartSimulation={handleStartSimulation}
          isSimulating={isSimulating}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Floating Action / Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div className="px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/60 shadow-2xl text-xs font-semibold text-white flex items-center gap-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Landing Hero (Shown on initial visit or dashboard tab) */}
          {showLandingBanner && currentTab === 'dashboard' && (
            <LandingHero
              onLaunchDashboard={() => setShowLandingBanner(false)}
              onExploreAlgorithms={() => {
                setShowLandingBanner(false);
                setCurrentTab('algorithms');
              }}
              onLaunchDemo={handleStartHackathonDemo}
            />
          )}

          {/* Tab 1: Dashboard (Emergency Command Center) */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Hero 4 Metric Cards */}
              <MetricCards
                activeEmergencies={emergencies.length}
                criticalCases={criticalCount}
                blockedCorridors={blockedCorridors.length}
                averageRouteTime={avgRouteTime}
                onNavigateToQueue={() => setCurrentTab('queue')}
                onNavigateToMap={() => setCurrentTab('map')}
                onNavigateToPlanner={() => setCurrentTab('planner')}
              />

              {/* Core Interactive Hospital Map */}
              <HospitalMap
                nodes={nodes}
                corridors={corridors}
                blockedCorridors={blockedCorridors}
                selectedPath={activePath}
                visitedNodes={activeVisited}
                startNode={startNode}
                destinationNode={destinationNode}
                onSelectNode={(name) => {
                  showToast(`Selected: ${name}`, 'info');
                }}
                onSetStart={(name) => {
                  setStartNode(name);
                  showToast(`Origin set to: ${name}`, 'info');
                }}
                onSetDestination={(name) => {
                  setDestinationNode(name);
                  showToast(`Destination set to: ${name}`, 'info');
                }}
                onToggleCorridor={handleToggleCorridor}
                onInspectNode={(node) => setInspectedNode(node)}
                isSimulating={isSimulating}
              />

              {/* Route Planner & Decision Trace */}
              <RoutePlanner
                nodes={nodes}
                blockedCorridors={blockedCorridors}
                startNode={startNode}
                destinationNode={destinationNode}
                onSetStart={setStartNode}
                onSetDestination={setDestinationNode}
                onCalculateRoute={handleCalculateRoute}
                onToggleCorridor={handleToggleCorridor}
                dijkstraResult={dijkstraResult}
                bfsResult={bfsResult}
                selectedAlgorithm={selectedAlgorithm}
                onSelectAlgorithm={setSelectedAlgorithm}
                isCalculating={isCalculating}
              />
            </div>
          )}

        {/* Tab 2: Emergency Queue Full Page */}
        {currentTab === 'queue' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <EmergencyQueuePanel
              emergencies={emergencies}
              nextEmergency={nextEmergency}
              onDispatchEmergency={(em) => {
                setStartNode(em.start);
                setDestinationNode(em.destination);
                handleCalculateRoute(em.start, em.destination, 'Dijkstra');
                setCurrentTab('planner');
              }}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              isDispatching={isCalculating}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Route Planner Page */}
        {currentTab === 'planner' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <RoutePlanner
              nodes={nodes}
              blockedCorridors={blockedCorridors}
              startNode={startNode}
              destinationNode={destinationNode}
              onSetStart={setStartNode}
              onSetDestination={setDestinationNode}
              onCalculateRoute={handleCalculateRoute}
              onToggleCorridor={handleToggleCorridor}
              dijkstraResult={dijkstraResult}
              bfsResult={bfsResult}
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={setSelectedAlgorithm}
              isCalculating={isCalculating}
            />

            <HospitalMap
              nodes={nodes}
              corridors={corridors}
              blockedCorridors={blockedCorridors}
              selectedPath={activePath}
              visitedNodes={activeVisited}
              startNode={startNode}
              destinationNode={destinationNode}
              onSetStart={setStartNode}
              onSetDestination={setDestinationNode}
              onToggleCorridor={handleToggleCorridor}
              onInspectNode={(node) => setInspectedNode(node)}
            />
          </div>
        )}

        {/* Tab 4: Hospital Map Dedicated View */}
        {currentTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <HospitalMap
              nodes={nodes}
              corridors={corridors}
              blockedCorridors={blockedCorridors}
              selectedPath={activePath}
              visitedNodes={activeVisited}
              startNode={startNode}
              destinationNode={destinationNode}
              onSetStart={setStartNode}
              onSetDestination={setDestinationNode}
              onToggleCorridor={handleToggleCorridor}
              onInspectNode={(node) => setInspectedNode(node)}
              isSimulating={isSimulating}
            />
          </div>
        )}

        {/* Tab 5: Algorithms & Comparison Page */}
        {currentTab === 'algorithms' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <AlgorithmComparison
              nodes={nodes}
              blockedCorridors={blockedCorridors}
              startNode={startNode}
              destinationNode={destinationNode}
              onSetStart={setStartNode}
              onSetDestination={setDestinationNode}
              dijkstraResult={dijkstraResult}
              bfsResult={bfsResult}
              onRunComparison={handleRunSideBySide}
              isRunning={isCalculating}
            />
          </div>
        )}

        {/* Tab 6: Analytics Page */}
        {currentTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <AnalyticsView analytics={analytics} blockedCorridors={blockedCorridors} />
          </div>
        )}

        {/* Tab 7: About & DAA Documentation */}
        {currentTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <AboutDAAView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050811] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">RapidRoute+</span>
            <span>·</span>
            <span>Hospital Emergency Route Command System</span>
            <span>·</span>
            <span className="font-mono text-cyan-400">DAA Hackathon</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Dijkstra $O((V+E)\log V)$</span>
            <span>·</span>
            <span>Min-Heap $O(\log n)$</span>
            <span>·</span>
            <span>BFS $O(V+E)$</span>
          </div>
        </div>
      </footer>
      </div>

      {/* Hackathon Demo Walkthrough Modal */}
      <HackathonDemoModal
        isOpen={isHackathonDemoOpen}
        onClose={() => setIsHackathonDemoOpen(false)}
        onApplyDemoStep={applyHackathonStep}
        currentStep={hackathonDemoStep}
        onNextStep={() => applyHackathonStep(Math.min(hackathonDemoStep + 1, 6))}
        onPrevStep={() => applyHackathonStep(Math.max(hackathonDemoStep - 1, 1))}
        onResetDemo={() => applyHackathonStep(1)}
        isAutoPlaying={false}
        onToggleAutoPlay={() => {}}
      />

      {/* Add Emergency Case Modal */}
      <AddEmergencyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        nodes={nodes}
        onAddEmergency={handleAddEmergency}
      />

      {/* Department Detail Inspector Modal */}
      <NodeDetailModal
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
        onSetStart={(name) => {
          setStartNode(name);
          showToast(`Origin set to ${name}`, 'info');
        }}
        onSetDestination={(name) => {
          setDestinationNode(name);
          showToast(`Destination set to ${name}`, 'info');
        }}
      />
    </div>
  );
}
