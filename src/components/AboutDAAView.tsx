import React, { useState } from 'react';
import { BookOpen, Code2, Cpu, GitBranch, Layers, Zap, CheckCircle2, Copy, Check } from 'lucide-react';
import { RapidRouteLogo } from './RapidRouteLogo';

export const AboutDAAView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'dijkstra' | 'bfs' | 'priority_queue'>('dijkstra');
  const [copied, setCopied] = useState<boolean>(false);

  const pythonDijkstraCode = `def find_dijkstra_route(start, destination, nodes, corridors, blocked_corridors):
    # 1. Initialize distance dictionary with infinity, start = 0
    distances = {node["name"]: float("inf") for node in nodes}
    distances[start] = 0.0
    previous = {node["name"]: None for node in nodes}
    finalized_set = set()
    
    # Custom Min-Heap Priority Queue for (cost, node)
    pq = DijkstraMinHeap()
    pq.push(0.0, start)

    while not pq.is_empty():
        curr_cost, curr_node = pq.pop()

        if curr_node in finalized_set:
            continue
        finalized_set.add(curr_node)

        if curr_node == destination:
            break

        # Relax all accessible unblocked neighbors
        for neighbor, weight in graph[curr_node]:
            if is_corridor_blocked(curr_node, neighbor, blocked_corridors):
                continue  # Bypasses blocked corridors
                
            tentative_dist = curr_cost + weight
            if tentative_dist < distances[neighbor]:
                distances[neighbor] = tentative_dist
                previous[neighbor] = curr_node
                pq.push(tentative_dist, neighbor)

    # Reconstruct optimal route using predecessor pointers
    path = []
    curr = destination
    while curr is not None:
        path.append(curr)
        curr = previous[curr]
    path.reverse()
    return path, distances[destination]`;

  const pythonBFSCode = `def find_bfs_route(start, destination, nodes, corridors, blocked_corridors):
    # Explores level-by-level using a FIFO queue
    queue = deque([start])
    visited = {start}
    parent = {start: None}
    depth = {start: 0}

    while queue:
        curr_node = queue.popleft()

        if curr_node == destination:
            break

        for neighbor in graph[curr_node]:
            if is_corridor_blocked(curr_node, neighbor, blocked_corridors):
                continue

            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = curr_node
                depth[neighbor] = depth[curr_node] + 1
                queue.append(neighbor)

    # Reconstruct minimum-hop path
    path = []
    curr = destination
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    path.reverse()
    return path, depth[destination]`;

  const pythonPQCode = `class EmergencyPriorityQueue:
    """Custom Binary Min-Heap for Emergency Patient Triage."""
    def __init__(self):
        self.heap = []

    def push(self, emergency_data):
        node = PriorityQueueNode(emergency_data)
        self.heap.append(node)
        self._sift_up(len(self.heap) - 1)

    def pop(self):
        if not self.heap:
            return None
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._sift_down(0)
        return root.to_dict()

    def _sift_up(self, index):
        parent = (index - 1) // 2
        # Min-Heap comparator: Severity rank first, then arrival time
        while index > 0 and self.heap[index] < self.heap[parent]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            index = parent
            parent = (index - 1) // 2`;

  const handleCopyCode = () => {
    const code = activeCodeTab === 'dijkstra' ? pythonDijkstraCode : activeCodeTab === 'bfs' ? pythonBFSCode : pythonPQCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <RapidRouteLogo variant="full" />
        
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-sans">Algorithms Behind RapidRoute+</h2>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-800">
              DAA Hackathon Foundation
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mt-2">
            RapidRoute+ addresses the high-stakes problem of hospital emergency routing and triage prioritization using core computer science graph algorithms and custom data structures. Rather than relying on generic black-box libraries, the algorithms are written manually from first principles.
          </p>
        </div>
      </div>

      {/* 4 Algorithmic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Graph Infrastructure */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400">
            <GitBranch className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">1. Graph Data Structure</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The hospital is modeled as a weighted undirected graph $G = (V, E)$. Nodes ($V = 12$) represent clinical departments (ICU, Trauma, Operation Theatres, Labs). Edges ($E = 18$) represent physical corridors, skybridges, and elevator banks, with weights representing estimated traversal time in minutes.
          </p>
          <div className="text-[11px] font-mono text-slate-400 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            Storage: Adjacency List $O(V + E)$ space complexity.
          </div>
        </div>

        {/* Pillar 2: Priority Queue */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">2. Priority Queue (Min-Heap)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Triage management requires dispatching the most critical cases first. Implemented as an in-memory binary min-heap where the root always contains the highest priority emergency (Priority 1: Critical &gt; Priority 2: High &gt; Priority 3: Medium &gt; Priority 4: Low).
          </p>
          <div className="text-[11px] font-mono text-slate-400 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            Time Complexity: $O(\log n)$ insertion &amp; extraction, $O(1)$ root peek.
          </div>
        </div>

        {/* Pillar 3: Dijkstra */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-purple-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">3. Dijkstra&apos;s Algorithm</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Finds the lowest-cost path in a weighted graph. When corridors are blocked (due to sanitization, construction, or active fires), the algorithm automatically filters the blocked edge from relaxation, discovering the mathematically fastest detour.
          </p>
          <div className="text-[11px] font-mono text-slate-400 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            Time Complexity: $O((V + E) \log V)$ using min-heap for tentative costs.
          </div>
        </div>

        {/* Pillar 4: BFS */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">4. Breadth-First Search (BFS)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Performs level-order graph traversal using a FIFO queue. BFS serves two clinical purposes: verifying hospital reachability across connected components and providing a baseline minimum-hop path (minimizing physical door transfers).
          </p>
          <div className="text-[11px] font-mono text-slate-400 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            Time Complexity: $O(V + E)$ linear time graph exploration.
          </div>
        </div>
      </div>

      {/* Python Source Code Inspector (For Judges) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Python Algorithm Implementation (Clean Backend Source)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg text-xs font-mono">
              <button
                onClick={() => setActiveCodeTab('dijkstra')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeCodeTab === 'dijkstra' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                dijkstra.py
              </button>
              <button
                onClick={() => setActiveCodeTab('bfs')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeCodeTab === 'bfs' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                bfs.py
              </button>
              <button
                onClick={() => setActiveCodeTab('priority_queue')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeCodeTab === 'priority_queue' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                priority_queue.py
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer border border-slate-700"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-[#070b14] border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[380px]">
          <code>
            {activeCodeTab === 'dijkstra' && pythonDijkstraCode}
            {activeCodeTab === 'bfs' && pythonBFSCode}
            {activeCodeTab === 'priority_queue' && pythonPQCode}
          </code>
        </pre>
      </div>
    </div>
  );
};
