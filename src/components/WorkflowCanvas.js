'use client';

import React, { useState } from 'react';
import IconLibrary from '@/components/icons/IconLibrary';

export default function WorkflowCanvas({ blocks, setBlocks, selectedBlock, setSelectedBlock }) {
  const [dragOver, setDragOver] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      // Update the dragged block's position
      setBlocks(blocks.map(b =>
        b.id === draggedBlock.id
          ? { ...b, x: Math.max(0, newX), y: Math.max(0, newY) }
          : b
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedBlock(null);
    setDragOffset({ x: 0, y: 0 });
  };


  return (
    <div
      className={`w-full h-full bg-stone-950 rounded-lg relative overflow-hidden ${
        dragOver ? 'ring-2 ring-violet-500 ring-opacity-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
          <div className="flex items-center gap-4 p-4 h-full">
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
        {blocks.map((block, index) => {
          if (index < blocks.length - 1) {
            const nextBlock = blocks[index + 1];
            return (
              <line
                key={`connection-${block.id}`}
                x1={block.x + 160}
                y1={block.y + 48}
                x2={nextBlock.x + 160}
                y2={nextBlock.y + 48}
                stroke="#6b7280"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          }
          return null;
        })}
        
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
        </defs>
      </svg>
    </div>
  );
}