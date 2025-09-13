'use client';

import React, { useState } from 'react';
import IconLibrary from '@/components/icons/IconLibrary';

const blockTypes = [
  {
    id: 'connect',
    title: 'Connect',
    description: 'Choose the sources your agents will use',
    icon: 'Link',
    color: 'green',
    category: 'start'
  },
  {
    id: 'agent',
    title: 'Agent',
    description: 'Configure how agents act on data',
    icon: 'Robot',
    color: 'blue',
    category: 'agents'
  },
  {
    id: 'send-email',
    title: 'Send Email',
    description: 'Draft and send automated emails',
    icon: 'Email',
    color: 'white',
    category: 'output'
  },
  {
    id: 'create-report',
    title: 'Create Report',
    description: 'Turn insights into charts or reports',
    icon: 'Chart',
    color: 'white',
    category: 'output'
  },
  {
    id: 'update-database',
    title: 'Update Database',
    description: 'Add or update records in your system',
    icon: 'Box',
    color: 'white',
    category: 'output'
  },
  {
    id: 'create-ticket',
    title: 'Create Ticket',
    description: 'Escalate issues into support tickets',
    icon: 'Ticket',
    color: 'white',
    category: 'output'
  },
];

export default function BlocksSidebar() {
  const [draggedBlock, setDraggedBlock] = useState(null);

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(block));
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };


  const getCategoryBlocks = (category) => {
    return blockTypes.filter(block => block.category === category);
  };

  return (
    <div className="w-96 h-full bg-stone-950 border-r border-zinc-800 flex flex-col">
      <div className="p-5">
        <h2 className="text-white text-base font-semibold mb-2">Blocks</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Drag the blocks on the canvas on the right
        </p>

        <div className="space-y-6">
          {/* Start Category */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Start</h3>
            <div className="space-y-3">
              {getCategoryBlocks('start').map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragEnd={handleDragEnd}
                  className="w-full h-16 bg-neutral-900 rounded-lg shadow-sm border border-zinc-800 p-4 flex items-center gap-3 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 flex items-center justify-center">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center">
                    {React.createElement(IconLibrary[block.icon])}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{block.title}</div>
                    <div className="text-zinc-400 text-xs">{block.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agents Category */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Agents</h3>
            <div className="space-y-3">
              {getCategoryBlocks('agents').map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragEnd={handleDragEnd}
                  className="w-full h-16 bg-neutral-900 rounded-lg shadow-sm border border-zinc-800 p-4 flex items-center gap-3 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 flex items-center justify-center">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
                    {React.createElement(IconLibrary[block.icon])}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{block.title}</div>
                    <div className="text-zinc-400 text-xs">{block.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Category */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Output</h3>
            <div className="space-y-3">
              {getCategoryBlocks('output').map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragEnd={handleDragEnd}
                  className="w-full h-16 bg-neutral-900 rounded-lg shadow-sm border border-zinc-800 p-4 flex items-center gap-3 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 flex items-center justify-center">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center">
                    {React.createElement(IconLibrary[block.icon])}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{block.title}</div>
                    <div className="text-zinc-400 text-xs">{block.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}