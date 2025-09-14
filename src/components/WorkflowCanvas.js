'use client';

import React, { useState } from 'react';
import IconLibrary from '@/components/icons/IconLibrary';

export default function WorkflowCanvas({ blocks, setBlocks, selectedBlock, setSelectedBlock, connections, setConnections }) {
  const [dragOver, setDragOver] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null); // For connection mode
  const [connectionType, setConnectionType] = useState(null); // 'agent-to-tool' or 'agent-to-agent'

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const blockData = e.dataTransfer.getData('application/json');
    if (blockData) {
      const block = JSON.parse(blockData);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newBlock = {
        ...block,
        id: `${block.id}-${Date.now()}`,
        x: x - 160, // Center the block (half of 320px width)
        y: y - 48,  // Center the block (half of 96px height)
        selected: false
      };
      
      setBlocks([...blocks, newBlock]);
    }
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setBlocks(blocks.map(b => ({
      ...b,
      selected: b.id === block.id
    })));
  };

  const handleBlockMouseDown = (e, block) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = e.currentTarget.parentElement.getBoundingClientRect();

    setDraggedBlock(block);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Select the block being dragged
    handleBlockClick(block);
  };

  const handleMouseMove = (e) => {
    if (draggedBlock) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - rect.left - dragOffset.x);
      const newY = Math.max(0, e.clientY - rect.top - dragOffset.y);

      // Helper function to get all connected blocks (tools and agents)
      const getAllConnectedBlocks = (blockId, visitedIds = new Set()) => {
        if (visitedIds.has(blockId)) return [];
        visitedIds.add(blockId);

        let connected = [];

        // Get tool blocks connected to this agent
        if (isAgentBlock(blocks.find(b => b.id === blockId))) {
          const toolBlocks = getAgentToolChain(blockId);
          connected.push(...toolBlocks);
        }

        // Only get agents connected FROM this agent (not TO this agent)
        // This prevents the "flying" behavior when dragging
        const agentConnectionsFrom = connections.filter(conn =>
          conn.fromBlockId === blockId && conn.type === 'agent-to-agent'
        );
        for (const conn of agentConnectionsFrom) {
          const targetAgent = blocks.find(b => b.id === conn.toBlockId);
          if (targetAgent) {
            connected.push(targetAgent);
            // Recursively get connected blocks from the target agent
            connected.push(...getAllConnectedBlocks(targetAgent.id, visitedIds));
          }
        }

        return connected;
      };

      // Get all connected blocks
      const connectedBlocks = getAllConnectedBlocks(draggedBlock.id);
      const dragDeltaX = newX - draggedBlock.x;
      const dragDeltaY = newY - draggedBlock.y;

      // Update the dragged block's position and move all connected blocks
      setBlocks(blocks.map(b => {
        if (b.id === draggedBlock.id) {
          return { ...b, x: newX, y: newY };
        }

        // Check if this block is in the connected group
        const connectedBlock = connectedBlocks.find(cb => cb.id === b.id);
        if (connectedBlock) {
          // Move connected blocks relative to the dragged block
          if (isAgentBlock(draggedBlock)) {
            // If dragging an agent, move tool blocks maintaining their chain position
            const toolChain = getAgentToolChain(draggedBlock.id);
            const toolIndex = toolChain.findIndex(tb => tb.id === b.id);
            if (toolIndex !== -1) {
              return { ...b, x: newX, y: newY + (120 * (toolIndex + 1)) };
            }
            // Move other connected agents horizontally (maintain their relative positions)
            if (isAgentBlock(b)) {
              // For agent-to-agent connections, move the target agent to the right of the source
              const agentConnection = connections.find(conn => 
                conn.fromBlockId === draggedBlock.id && 
                conn.toBlockId === b.id && 
                conn.type === 'agent-to-agent'
              );
              if (agentConnection) {
                return { ...b, x: newX + 400, y: newY }; // 400px gap between agents
              }
              // For other connected agents, move with the same delta
              return { ...b, x: b.x + dragDeltaX, y: b.y + dragDeltaY };
            }
          } else {
            // If dragging a tool block or other connected agent, move everything together
            return { ...b, x: b.x + dragDeltaX, y: b.y + dragDeltaY };
          }
        }

        return b;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggedBlock(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Helper function to check if a block is an agent block
  const isAgentBlock = (block) => {
    return block.category === 'agents' ||
           (block.category === 'tools' && ['Web Research', 'Email'].includes(block.title));
  };

  // Helper function to check if a block is an output/tool block
  const isOutputOrToolBlock = (block) => {
    return block.category === 'output' ||
           (block.category === 'tools' && !['Web Research', 'Email'].includes(block.title));
  };

  // Helper function to get all connected tool blocks for an agent (in order)
  const getAgentToolChain = (agentBlockId) => {
    return connections
      .filter(conn => conn.fromBlockId === agentBlockId && conn.type === 'agent-to-tool')
      .map(conn => blocks.find(b => b.id === conn.toBlockId))
      .filter(Boolean)
      .sort((a, b) => a.y - b.y); // Sort by vertical position
  };

  // Handle connection point click
  const handleConnectionPointClick = (e, block, type, side = null) => {
    e.stopPropagation();

    if (isAgentBlock(block)) {
      // If we're connecting agent-to-agent and this is the left side (input) of a target agent
      if (type === 'agent-to-agent' && side === 'left' && connectingFrom && connectionType === 'agent-to-agent' && block.id !== connectingFrom.id) {
        // Complete the agent-to-agent connection
        const existingConnection = connections.find(
          conn => conn.fromBlockId === connectingFrom.id && conn.toBlockId === block.id && conn.type === 'agent-to-agent'
        );
        if (existingConnection) return; // Connection already exists

        // Position the target agent next to the source agent (horizontally)
        const newX = connectingFrom.x + 400; // 320px block width + 80px gap
        const newY = connectingFrom.y; // Same vertical position

        // Create agent-to-agent connection and position blocks
        const newConnection = {
          fromBlockId: connectingFrom.id,
          toBlockId: block.id,
          type: 'agent-to-agent'
        };

        // Position target agent next to source agent
        setBlocks(blocks.map(b =>
          b.id === block.id
            ? { ...b, x: newX, y: newY }
            : b
        ));

        setConnections([...connections, newConnection]);
        setConnectingFrom(null);
        setConnectionType(null);
        return;
      }

      // If this is the right side (output) or bottom (tool output), start a new connection
      if (side === 'right' || type === 'agent-to-tool') {
        setConnectingFrom(block);
        setConnectionType(type);
      }
    } else if (isOutputOrToolBlock(block) && connectingFrom && connectionType === 'agent-to-tool') {
      // Handle agent-to-tool connections
      const isConnected = connections.some(conn => conn.toBlockId === block.id && conn.type === 'agent-to-tool');
      if (isConnected) return; // Tool block can only be connected to one agent

      // Find existing tool blocks connected to this agent
      const existingToolBlocks = getAgentToolChain(connectingFrom.id);

      // Calculate position for new tool block (at the end of the chain)
      const chainLength = existingToolBlocks.length;
      const newY = connectingFrom.y + (120 * (chainLength + 1)); // 120px gap per block

      // Create connection and position tool block in chain
      const newConnection = {
        fromBlockId: connectingFrom.id,
        toBlockId: block.id,
        type: 'agent-to-tool'
      };

      // Position tool block in the chain
      setBlocks(blocks.map(b =>
        b.id === block.id
          ? { ...b, x: connectingFrom.x, y: newY }
          : b
      ));

      setConnections([...connections, newConnection]);
      setConnectingFrom(null);
      setConnectionType(null);
    }
  };

  // Handle canvas click to cancel connection
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setConnectingFrom(null);
      setConnectionType(null);
    }
  };


  return (
    <div
      className={`w-full h-full bg-stone-950 rounded-lg relative overflow-hidden ${
        dragOver ? 'ring-2 ring-violet-500 ring-opacity-50' : ''
      } ${connectingFrom ? 'cursor-crosshair' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Canvas Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Rendered Blocks */}
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`absolute w-80 h-24 bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-offset-[-1px] cursor-pointer transition-all select-none ${
            draggedBlock?.id === block.id
              ? 'cursor-grabbing shadow-xl shadow-violet-500/30 outline-violet-400 z-50'
              : block.selected
              ? 'outline-violet-500 shadow-lg shadow-violet-500/20 cursor-grab'
              : 'outline-zinc-800 hover:outline-zinc-600 cursor-grab'
          }`}
          style={{
            left: `${block.x}px`,
            top: `${block.y}px`,
          }}
          onClick={() => handleBlockClick(block)}
          onMouseDown={(e) => handleBlockMouseDown(e, block)}
        >
          <div className="flex items-center gap-4 p-4 h-full relative">
            {/* Top Connection Point (for output/tool blocks) */}
            {isOutputOrToolBlock(block) && (
              <div
                className={`absolute left-1/2 -top-2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-all z-10 ${
                  connections.some(conn => conn.toBlockId === block.id && conn.type === 'agent-to-tool')
                    ? 'bg-blue-500 border-blue-400' // Blue when connected
                    : connectingFrom && connectingFrom.id !== block.id && connectionType === 'agent-to-tool'
                    ? 'bg-green-500 border-green-400 hover:bg-green-400' // Green when ready to connect
                    : 'bg-zinc-700 border-zinc-600 hover:border-zinc-500' // Default gray
                }`}
                onClick={(e) => handleConnectionPointClick(e, block, 'agent-to-tool', 'top')}
                title="Connect from an agent block"
              />
            )}

            {/* Icon */}
            <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center flex-shrink-0">
              {React.createElement(IconLibrary[block.icon], { className: "w-8 h-8" })}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2">
              {/* Title */}
              <div className="text-white text-sm font-medium font-lexend leading-tight">
                {block.title}
              </div>

              {/* Description Bar */}
              <div className="bg-stone-900 rounded shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] py-1">
                <div className="text-zinc-400 text-xs font-medium font-lexend leading-tight">
                  {block.description}
                </div>
              </div>
            </div>

            {/* Bottom Connection Point (for agent-to-tool connections) */}
            {isAgentBlock(block) && (
              <div
                className={`absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-all z-10 ${
                  connectingFrom?.id === block.id && connectionType === 'agent-to-tool'
                    ? 'bg-blue-500 border-blue-400 animate-pulse'
                    : 'bg-blue-600 border-blue-500 hover:bg-blue-500'
                }`}
                onClick={(e) => handleConnectionPointClick(e, block, 'agent-to-tool', 'bottom')}
                title="Connect to a tool block"
              />
            )}

            {/* Right Connection Point (for agent-to-agent connections - OUTPUT) */}
            {isAgentBlock(block) && (
              <div
                className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-all z-10 ${
                  connectingFrom?.id === block.id && connectionType === 'agent-to-agent'
                    ? 'bg-purple-500 border-purple-400 animate-pulse'
                    : 'bg-purple-600 border-purple-500 hover:bg-purple-500'
                }`}
                onClick={(e) => handleConnectionPointClick(e, block, 'agent-to-agent', 'right')}
                title="Connect to another agent"
              />
            )}

            {/* Left Connection Point (for agent-to-agent connections - INPUT) */}
            {isAgentBlock(block) && (
              <div
                className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-all z-10 ${
                  connectingFrom && connectingFrom.id !== block.id && connectionType === 'agent-to-agent'
                    ? 'bg-green-500 border-green-400 hover:bg-green-400' // Green when ready to receive connection
                    : 'bg-purple-600 border-purple-500 hover:bg-purple-500'
                }`}
                onClick={(e) => handleConnectionPointClick(e, block, 'agent-to-agent', 'left')}
                title="Receive connection from another agent"
              />
            )}

          </div>
        </div>
      ))}

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-800 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-dashed border-zinc-600 rounded" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Start Building Your Workflow</h3>
            <p className="text-zinc-400 text-sm">
              Drag blocks from the sidebar to begin creating your automation
            </p>
          </div>
        </div>
      )}

      {/* Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {blocks.length > 1 && (() => {
          // Sort blocks by workflow order (left to right, then top to bottom)
          const sortedBlocks = [...blocks].sort((a, b) => {
            // Primary sort: left to right (x position)
            const xDiff = a.x - b.x;
            if (Math.abs(xDiff) > 50) { // If blocks are not roughly vertically aligned
              return xDiff;
            }
            // Secondary sort: top to bottom (y position)
            return a.y - b.y;
          });

          // Generate connections between consecutive blocks
          return sortedBlocks.map((block, index) => {
            if (index < sortedBlocks.length - 1) {
              const nextBlock = sortedBlocks[index + 1];

              // Calculate connection points (bottom of current block to top of next block)
              const x1 = block.x + 160;     // Block width is 320px, so center is at 160px
              const y1 = block.y + 96;      // Block height is 96px, so bottom is at 96px
              const x2 = nextBlock.x + 160; // Next block center horizontally
              const y2 = nextBlock.y;       // Top of next block

              return (
                <g key={`connection-${block.id}-to-${nextBlock.id}`}>
                  {/* Main connection line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Optional: Add connection points for visual feedback */}
                  <circle
                    cx={x1}
                    cy={y1}
                    r="3"
                    fill="#6b7280"
                    opacity="0.6"
                  />
                  <circle
                    cx={x2}
                    cy={y2}
                    r="3"
                    fill="#6b7280"
                    opacity="0.6"
                  />
                </g>
              );
            }
            return null;
          }).filter(Boolean); // Remove null values
        })()}

        {/* Agent-to-Tool Chain Lines */}
        {(() => {
          // Group agent-to-tool connections by agent
          const agentToolGroups = {};
          connections.filter(conn => conn.type === 'agent-to-tool').forEach(conn => {
            if (!agentToolGroups[conn.fromBlockId]) {
              agentToolGroups[conn.fromBlockId] = [];
            }
            agentToolGroups[conn.fromBlockId].push(conn);
          });

          // Create lines for each agent's tool chain
          return Object.entries(agentToolGroups).map(([agentId, agentConnections]) => {
            const agentBlock = blocks.find(b => b.id === agentId);
            if (!agentBlock) return null;

            const toolBlocks = agentConnections
              .map(conn => blocks.find(b => b.id === conn.toBlockId))
              .filter(Boolean)
              .sort((a, b) => a.y - b.y); // Sort by vertical position

            if (toolBlocks.length === 0) return null;

            const x = agentBlock.x + 160; // Center x position

            return (
              <g key={`tool-chain-${agentId}`}>
                {/* Line from agent to first tool block */}
                <line
                  x1={x}
                  y1={agentBlock.y + 96} // Bottom of agent
                  x2={x}
                  y2={toolBlocks[0].y} // Top of first tool block
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Lines between tool blocks in chain */}
                {toolBlocks.slice(0, -1).map((toolBlock, index) => (
                  <line
                    key={`tool-chain-link-${toolBlock.id}`}
                    x1={x}
                    y1={toolBlock.y + 96} // Bottom of current tool block
                    x2={x}
                    y2={toolBlocks[index + 1].y} // Top of next tool block
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          });
        })()}

        {/* Agent-to-Agent Connection Lines */}
        {(() => {
          return connections
            .filter(conn => conn.type === 'agent-to-agent')
            .map(conn => {
              const fromBlock = blocks.find(b => b.id === conn.fromBlockId);
              const toBlock = blocks.find(b => b.id === conn.toBlockId);
              
              if (!fromBlock || !toBlock) return null;

              // Calculate connection points - blocks are w-80 (320px) and h-24 (96px)
              const x1 = fromBlock.x + 320; // Right edge of source agent
              const y1 = fromBlock.y + 48;  // Center vertically of source agent
              const x2 = toBlock.x;         // Left edge of target agent
              const y2 = toBlock.y + 48;    // Center vertically of target agent

              return (
                <g key={`agent-connection-${conn.fromBlockId}-to-${conn.toBlockId}`}>
                  {/* Main connection line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#agentArrowhead)"
                  />
                  
                  {/* Connection point circles */}
                  <circle
                    cx={x1}
                    cy={y1}
                    r="4"
                    fill="#a855f7"
                    opacity="0.8"
                  />
                  <circle
                    cx={x2}
                    cy={y2}
                    r="4"
                    fill="#a855f7"
                    opacity="0.8"
                  />
                </g>
              );
            })
            .filter(Boolean);
        })()}

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
          <marker
            id="agentArrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#a855f7"
            />
          </marker>
        </defs>
      </svg>
    </div>
  );
}