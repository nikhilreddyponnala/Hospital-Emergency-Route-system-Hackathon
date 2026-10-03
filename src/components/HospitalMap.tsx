import React, { useState, useEffect, useRef } from 'react';
import {
  HospitalNode,
  HospitalCorridor
} from '../types/hospital';
import {
  Ambulance,
  HeartPulse,
  Pill,
  Scissors,
  Droplet,
  Building2,
  Scan,
  Activity,
  DoorOpen,
  Siren,
  FlaskConical,
  BedDouble,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';

interface HospitalMapProps {
  nodes: HospitalNode[];
  corridors: HospitalCorridor[];
  blockedCorridors: string[];
  selectedPath?: string[];
  visitedNodes?: string[];
  startNode?: string;
  destinationNode?: string;
  onSelectNode?: (nodeName: string) => void;
  onSetStart?: (nodeName: string) => void;
  onSetDestination?: (nodeName: string) => void;
  onToggleCorridor?: (corridorKey: string) => void;
  onInspectNode?: (node: HospitalNode) => void;
  isSimulating?: boolean;
}

export const HospitalMap: React.FC<HospitalMapProps> = ({
  nodes,
  corridors,
  blockedCorridors,
  selectedPath = [],
  visitedNodes = [],
  startNode,
  destinationNode,
  onSelectNode,
  onSetStart,
  onSetDestination,
  onToggleCorridor,
  onInspectNode,
  isSimulating = false
}) => {
  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCorridor, setHoveredCorridor] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Ambulance animation state
  const [ambulanceProgress, setAmbulanceProgress] = useState<number>(0); // 0 to 1 along path
  const [ambulanceCoords, setAmbulanceCoords] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [isAmbulanceMoving, setIsAmbulanceMoving] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);

  // Map dimensions
  const viewBoxWidth = 1040;
  const viewBoxHeight = 580;

  // Build node lookup map
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, HospitalNode>();
    nodes.forEach(n => map.set(n.name, n));
    return map;
  }, [nodes]);

  // Check if corridor is blocked
  const isBlocked = (from: string, to: string) => {
    const c1 = `${from}|${to}`;
    const c2 = `${to}|${from}`;
    const cCanon = from < to ? `${from}::${to}` : `${to}::${from}`;
    return blockedCorridors.includes(c1) || blockedCorridors.includes(c2) || blockedCorridors.includes(cCanon);
  };

  // Check if corridor is part of selected path
  const isCorridorInPath = (from: string, to: string) => {
    if (!selectedPath || selectedPath.length < 2) return false;
    for (let i = 0; i < selectedPath.length - 1; i++) {
      const u = selectedPath[i];
      const v = selectedPath[i + 1];
      if ((u === from && v === to) || (u === to && v === from)) {
        return true;
      }
    }
    return false;
  };

  // Node icon mapping
  const renderNodeIcon = (name: string, iconName: string, isSmall = false) => {
    const sizeClass = isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4';
    switch (name) {
      case 'Emergency Gate':
        return <Ambulance className={sizeClass} />;
      case 'Emergency Department':
        return <Siren className={sizeClass} />;
      case 'Reception':
        return <Building2 className={sizeClass} />;
      case 'Diagnostics Lab':
        return <FlaskConical className={sizeClass} />;
      case 'Operation Theatre':
        return <Scissors className={sizeClass} />;
      case 'ICU':
        return <HeartPulse className={sizeClass} />;
      case 'General Ward':
        return <BedDouble className={sizeClass} />;
      case 'Pharmacy':
        return <Pill className={sizeClass} />;
      case 'Blood Bank':
        return <Droplet className={sizeClass} />;
      case 'Cardiology':
        return <Activity className={sizeClass} />;
      case 'Radiology':
        return <Scan className={sizeClass} />;
      case 'Exit Gate':
        return <DoorOpen className={sizeClass} />;
      default:
        return <Activity className={sizeClass} />;
    }
  };

  // Calculate Ambulance path coordinates along selectedPath
  useEffect(() => {
    if (!selectedPath || selectedPath.length < 2) {
      setAmbulanceCoords(null);
      setIsAmbulanceMoving(false);
      return;
    }

    // Start ambulance animation
    let startTime: number | null = null;
    const duration = 4000; // 4 seconds total transit

    setIsAmbulanceMoving(true);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAmbulanceProgress(progress);

      // Compute coordinate along multi-segment polyline
      const totalSegments = selectedPath.length - 1;
      const segmentFraction = 1 / totalSegments;
      const currentSegmentIndex = Math.min(
        Math.floor(progress / segmentFraction),
        totalSegments - 1
      );
      const segmentProgress = (progress - currentSegmentIndex * segmentFraction) / segmentFraction;

      const fromNode = nodeMap.get(selectedPath[currentSegmentIndex]);
      const toNode = nodeMap.get(selectedPath[currentSegmentIndex + 1]);

      if (fromNode && toNode) {
        const x = fromNode.x + (toNode.x - fromNode.x) * segmentProgress;
        const y = fromNode.y + (toNode.y - fromNode.y) * segmentProgress;
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setAmbulanceCoords({ x, y, angle });
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsAmbulanceMoving(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [selectedPath, nodeMap, isSimulating]);

  // Restart ambulance movement manually
  const handleReplayAmbulance = () => {
    if (!selectedPath || selectedPath.length < 2) return;
    setAmbulanceProgress(0);
    let startTime: number | null = null;
    const duration = 3500;
    setIsAmbulanceMoving(true);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAmbulanceProgress(progress);

      const totalSegments = selectedPath.length - 1;
      const segmentFraction = 1 / totalSegments;
      const currentSegmentIndex = Math.min(
        Math.floor(progress / segmentFraction),
        totalSegments - 1
      );
      const segmentProgress = (progress - currentSegmentIndex * segmentFraction) / segmentFraction;

      const fromNode = nodeMap.get(selectedPath[currentSegmentIndex]);
      const toNode = nodeMap.get(selectedPath[currentSegmentIndex + 1]);

      if (fromNode && toNode) {
        const x = fromNode.x + (toNode.x - fromNode.x) * segmentProgress;
        const y = fromNode.y + (toNode.y - fromNode.y) * segmentProgress;
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setAmbulanceCoords({ x, y, angle });
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsAmbulanceMoving(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative bg-[#070b14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Map Control Bar */}
      <div className="px-4 py-3 bg-[#0d1424] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Interactive Hospital Campus Map</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Click nodes to inspect or set origin/destination. Click corridors to toggle blockage.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedPath && selectedPath.length >= 2 && (
            <button
              onClick={handleReplayAmbulance}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-medium cursor-pointer transition-colors"
              title="Animate ambulance transit along the selected route"
            >
              <Play className="w-3 h-3 fill-cyan-400" />
              <span>Animate Transit</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.0))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.7))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        className="relative w-full h-[520px] bg-[#080d19] select-none cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Definitions for Gradients, Glows & Patterns */}
          <defs>
            {/* Campus Architectural Floor Grid Pattern */}
            <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.45)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.2" fill="rgba(56, 189, 248, 0.25)" />
            </pattern>

            {/* Glowing route line gradient */}
            <linearGradient id="route-pulse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Cyan Route Glow Filter */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Red Danger Glow Filter */}
            <filter id="danger-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="#080d19" />
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#campus-grid)" />

          {/* Hospital Wing Zones (Subtle building architecture outlines) */}
          <g className="hospital-zones opacity-25">
            <rect x="40" y="220" width="130" height="130" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="50" y="240" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="sans-serif">ZONE A: TRIAGE</text>

            <rect x="220" y="110" width="160" height="130" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="230" y="130" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="sans-serif">ZONE B: TRAUMA</text>

            <rect x="640" y="90" width="220" height="260" rx="20" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <text x="655" y="115" fill="#38bdf8" fontSize="11" fontWeight="700" fontFamily="sans-serif">CRITICAL CARE WING (OT + ICU)</text>

            <rect x="220" y="340" width="160" height="130" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="230" y="360" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="sans-serif">CENTRAL ATRIUM</text>
          </g>

          {/* Graph Corridors (Edges) */}
          <g className="corridors-layer">
            {corridors.map((c) => {
              const u = nodeMap.get(c.from);
              const v = nodeMap.get(c.to);
              if (!u || !v) return null;

              const blocked = isBlocked(c.from, c.to);
              const inPath = isCorridorInPath(c.from, c.to);
              const corridorKey = `${c.from}|${c.to}`;
              const isHovered = hoveredCorridor === corridorKey;

              const midX = (u.x + v.x) / 2;
              const midY = (u.y + v.y) / 2;

              return (
                <g 
                  key={c.id} 
                  className="corridor-group cursor-pointer group"
                  onMouseEnter={() => setHoveredCorridor(corridorKey)}
                  onMouseLeave={() => setHoveredCorridor(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleCorridor) onToggleCorridor(corridorKey);
                  }}
                >
                  {/* Invisible broad stroke for easy clicking */}
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="transparent"
                    strokeWidth="24"
                  />

                  {/* Corridor Line Visual */}
                  {blocked ? (
                    // BLOCKED CORRIDOR: Dashed Red Stroke
                    <g>
                      <line
                        x1={u.x}
                        y1={u.y}
                        x2={v.x}
                        y2={v.y}
                        stroke="#ef4444"
                        strokeWidth="3.5"
                        strokeDasharray="6 6"
                        filter="url(#danger-glow)"
                      />
                      <line
                        x1={u.x}
                        y1={u.y}
                        x2={v.x}
                        y2={v.y}
                        stroke="#b91c1c"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />
                    </g>
                  ) : inPath ? (
                    // OPTIMAL CALCULATED ROUTE: Glowing Cyan/Purple Line
                    <g>
                      <line
                        x1={u.x}
                        y1={u.y}
                        x2={v.x}
                        y2={v.y}
                        stroke="url(#route-pulse-gradient)"
                        strokeWidth="5"
                        filter="url(#route-glow)"
                      />
                      <line
                        x1={u.x}
                        y1={u.y}
                        x2={v.x}
                        y2={v.y}
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </g>
                  ) : (
                    // NORMAL AVAILABLE CORRIDOR
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={isHovered ? '#38bdf8' : '#334155'}
                      strokeWidth={isHovered ? '3' : '2'}
                      strokeDasharray="none"
                      className="transition-colors duration-150"
                    />
                  )}

                  {/* Corridor Travel Time Badge at Midpoint */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    {blocked ? (
                      <g className="animate-pulse">
                        <rect
                          x="-32"
                          y="-11"
                          width="64"
                          height="22"
                          rx="6"
                          fill="#450a0a"
                          stroke="#ef4444"
                          strokeWidth="1.2"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#fca5a5"
                          fontSize="9"
                          fontWeight="700"
                          fontFamily="monospace"
                        >
                          ✖ BLOCKED
                        </text>
                      </g>
                    ) : (
                      <g className="hover:scale-110 transition-transform">
                        <rect
                          x="-22"
                          y="-10"
                          width="44"
                          height="20"
                          rx="5"
                          fill={inPath ? '#083344' : '#0f172a'}
                          stroke={inPath ? '#06b6d4' : isHovered ? '#38bdf8' : '#334155'}
                          strokeWidth={inPath ? '1.5' : '1'}
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill={inPath ? '#67e8f9' : '#94a3b8'}
                          fontSize="9.5"
                          fontWeight="600"
                          fontFamily="monospace"
                        >
                          {c.weight}m
                        </text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </g>

          {/* Moving Ambulance Simulation */}
          {ambulanceCoords && (
            <g
              transform={`translate(${ambulanceCoords.x}, ${ambulanceCoords.y})`}
              className="pointer-events-none transition-transform duration-75"
            >
              {/* Pulsing Beacon Halo */}
              <circle r="22" fill="rgba(239, 68, 68, 0.25)" className="animate-ping" />
              <circle r="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
              {/* Rotating Siren Light */}
              <circle cx="0" cy="-14" r="3.5" fill="#ef4444" className="animate-pulse" />
              {/* Ambulance Icon */}
              <g transform="translate(-10, -10)">
                <Ambulance className="w-5 h-5 text-white" />
              </g>
              {/* Tag */}
              <g transform="translate(0, 24)">
                <rect x="-30" y="-8" width="60" height="16" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="700" fontFamily="sans-serif">
                  🚑 TRANSIT
                </text>
              </g>
            </g>
          )}

          {/* Graph Nodes (Hospital Departments) */}
          <g className="nodes-layer">
            {nodes.map((node) => {
              const isStart = node.name === startNode;
              const isDest = node.name === destinationNode;
              const inPath = selectedPath.includes(node.name);
              const isVisited = visitedNodes.includes(node.name);
              const isHovered = hoveredNode === node.name;

              // Node Category Color Palette
              let ringColor = '#334155';
              let badgeBg = '#0f172a';
              let iconColor = '#94a3b8';

              if (isStart) {
                ringColor = '#38bdf8'; // Cyan
                badgeBg = '#0c4a6e';
                iconColor = '#38bdf8';
              } else if (isDest) {
                ringColor = '#f43f5e'; // Red
                badgeBg = '#881337';
                iconColor = '#fda4af';
              } else if (inPath) {
                ringColor = '#a855f7'; // Purple/Violet
                badgeBg = '#3b0764';
                iconColor = '#d8b4fe';
              } else if (isVisited) {
                ringColor = '#eab308'; // Amber/Yellow
                badgeBg = '#422006';
                iconColor = '#fde047';
              } else if (node.category === 'CRITICAL' || node.category === 'SURGERY') {
                ringColor = '#f43f5e';
                iconColor = '#f43f5e';
              } else if (node.category === 'EMERGENCY') {
                ringColor = '#fb923c';
                iconColor = '#fb923c';
              } else if (node.category === 'DIAGNOSTICS' || node.category === 'LAB') {
                ringColor = '#38bdf8';
                iconColor = '#38bdf8';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="node-group cursor-pointer select-none"
                  onMouseEnter={() => setHoveredNode(node.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onInspectNode) onInspectNode(node);
                    if (onSelectNode) onSelectNode(node.name);
                  }}
                >
                  {/* Visited / Route Pulsing Rings */}
                  {(isStart || isDest || inPath) && (
                    <circle
                      r="28"
                      fill="none"
                      stroke={isStart ? '#38bdf8' : isDest ? '#f43f5e' : '#a855f7'}
                      strokeWidth="1.5"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Circular Surface */}
                  <circle
                    r="20"
                    fill={badgeBg}
                    stroke={ringColor}
                    strokeWidth={isStart || isDest || inPath ? '2.5' : isHovered ? '2' : '1.5'}
                    className="transition-all duration-200"
                  />

                  {/* Icon centered in circle */}
                  <g transform="translate(-8, -8)" className="pointer-events-none" style={{ color: iconColor }}>
                    {renderNodeIcon(node.name, node.icon)}
                  </g>

                  {/* Start / Destination Badges */}
                  {isStart && (
                    <g transform="translate(0, -28)">
                      <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#0284c7" />
                      <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily="sans-serif">
                        ORIGIN
                      </text>
                    </g>
                  )}

                  {isDest && (
                    <g transform="translate(0, -28)">
                      <rect x="-26" y="-8" width="52" height="16" rx="4" fill="#e11d48" />
                      <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily="sans-serif">
                        DESTINATION
                      </text>
                    </g>
                  )}

                  {/* Node Label Below */}
                  <g transform="translate(0, 32)">
                    <rect
                      x={-(node.name.length * 4.2) - 8}
                      y="-10"
                      width={node.name.length * 8.4 + 16}
                      height="20"
                      rx="6"
                      fill="#070b14"
                      stroke={inPath ? '#8b5cf6' : isVisited ? '#ca8a04' : '#1e293b'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={inPath ? '#ffffff' : isVisited ? '#fef08a' : '#e2e8f0'}
                      fontSize="10.5"
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover / Quick Info Floating Tooltip */}
        {hoveredNode && nodeMap.get(hoveredNode) && (
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 text-xs text-white max-w-xs shadow-xl pointer-events-none backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
              {renderNodeIcon(hoveredNode, 'Icon', true)}
              <span>{hoveredNode}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>{nodeMap.get(hoveredNode)?.wing}</span> · <span>{nodeMap.get(hoveredNode)?.floor}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              {nodeMap.get(hoveredNode)?.description}
            </p>
            <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span>Capacity: {nodeMap.get(hoveredNode)?.capacity}</span>
              <span>Click to inspect</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend (Section 16 Specification) */}
      <div className="px-4 py-3 bg-[#0d1424] border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap text-slate-300 font-medium">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Map Legend:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Available Corridor</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Blocked Corridor (Dashed)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Start / Origin</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-300">Destination</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Visited by Algorithm</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">Calculated Optimal Route</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs">🚑</span>
            <span className="text-slate-300">Ambulance Simulation</span>
          </div>
        </div>

        {/* Quick Blockage Status Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Blocked:</span>
          {blockedCorridors.length === 0 ? (
            <span className="text-emerald-400 font-mono">None (All Open)</span>
          ) : (
            <span className="text-amber-400 font-mono font-medium">
              {blockedCorridors.join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
