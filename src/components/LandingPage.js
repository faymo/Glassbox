'use client';

import Link from 'next/link';
import WorkflowHeader from '@/components/WorkflowHeader';
import { useState } from 'react';

export default function LandingPage() {
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
  };

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

    const blockType = e.dataTransfer.getData('text/plain');
    if (blockType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newBlock = {
        id: `${blockType}-${Date.now()}`,
        type: blockType,
        x: x - 40, // Center the block
        y: y - 20,
      };

      setDroppedBlocks([...droppedBlocks, newBlock]);
    }
  };

  const getBlockInfo = (type) => {
    const blockTypes = {
      'start': { title: 'Start', description: 'Process starting point', color: 'blue' },
      'custom-agent': { title: 'Custom Agent', description: 'Build your own specialized agent', color: 'green' },
      'article-creation': { title: 'Article Creation Agent', description: 'Create PDF files containing text and image', color: 'green' },
      'response': { title: 'Response', description: 'Responds to queries', color: 'orange' },
      'end': { title: 'End', description: 'Finalizes the flow', color: 'blue' }
    };
    return blockTypes[type] || blockTypes['start'];
  };
  return (
    <div className="w-full bg-neutral-900">
      {/* Header */}
      <WorkflowHeader blocks={[]} showButtons={false} />

      {/* Hero Section */}
      <div className="relative pb-8">

        {/* Main Title */}
        <div className="mt-12 px-4 md:px-10 max-w-3xl text-neutral-100 text-4xl md:text-6xl font-normal font-['GoudySerial'] leading-[50px] md:leading-[60px]">
          Build Transparent Agentic AI Solutions
        </div>

        {/* Divider Line */}
        <div className="w-full h-px mt-16 bg-zinc-800"></div>

        {/* Subtitle */}
        <div className="mt-8 px-4 md:px-10 max-w-md text-white text-base font-normal font-['Inter'] leading-relaxed">
          Build, deploy, and manage AI agents while getting visibility into every decision your agents make
        </div>

        {/* Get Started Button */}
        <div className="mt-8 px-4 md:px-10">
          <Link
            href="/overview"
            className="inline-flex items-center w-72 h-12 bg-violet-600 overflow-hidden"
          >
            <div className="ml-4 text-white text-base font-normal font-['Inter'] leading-none">Get Started</div>
            <div className="w-5 h-5 ml-auto mr-4 bg-white"></div>
          </Link>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px mt-8 bg-zinc-800"></div>

        {/* Workflow Builder Mockup */}
        <div className="mt-16 px-4 md:px-10">
          <div className="w-full max-w-7xl mx-auto h-[703px] bg-stone-900 border border-zinc-800 overflow-hidden relative rounded-lg">
            {/* Mac-style title bar */}
            <div className="w-full h-8 bg-neutral-800 border-b border-zinc-700 flex items-center px-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Top toolbar */}
            <div className="w-full h-12 bg-stone-900 border-b border-zinc-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.09 9.09L7.09 7.09" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-normal">100%</span>
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="0.9"/>
                    <path d="M6 3V9" stroke="white" strokeWidth="0.9"/>
                    <path d="M3 6H9" stroke="white" strokeWidth="0.9"/>
                  </svg>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.88721 4.71094V8.02348H5.19974" stroke="white" strokeWidth="1.10418" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.8248 10.2317C11.8248 8.91394 11.3013 7.6501 10.3695 6.71827C9.43766 5.78644 8.17382 5.26294 6.85601 5.26294C5.6332 5.26418 4.45379 5.71629 3.54348 6.53275L1.88721 8.02339" stroke="white" strokeWidth="1.10418" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6922 4.56433V7.94895H9.30762" stroke="white" strokeWidth="1.12821" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.53857 10.2052C2.53857 8.85874 3.07346 7.5674 4.02557 6.61529C4.97768 5.66318 6.26901 5.1283 7.6155 5.1283C8.86492 5.12957 10.07 5.59151 11.0001 6.42573L12.6924 7.94881" stroke="white" strokeWidth="1.12821" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* Test and Publish buttons in toolbar */}
                <button className="w-16 h-7 bg-neutral-800 rounded flex items-center gap-1 px-2 hover:bg-neutral-700 transition-colors ml-4">
                  <svg width="7" height="9" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0V11L8.64286 5.5L0 0Z" fill="white"/>
                  </svg>
                  <span className="text-white text-xs font-medium">Test</span>
                </button>
                <button className="w-20 h-7 bg-violet-600 rounded flex items-center gap-1 px-2 hover:bg-violet-700 transition-colors">
                  <svg width="8" height="9" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0V1.375H9.625V0H0ZM0 6.875H2.75V11H6.875V6.875H9.625L4.8125 2.0625L0 6.875Z" fill="white"/>
                  </svg>
                  <span className="text-white text-xs font-medium">Publish</span>
                </button>
              </div>
            </div>

            {/* Left Sidebar */}
            <div className="w-96 h-full absolute left-0 top-20 bg-stone-950 border-r border-zinc-800 overflow-hidden">
              {/* Header with tabs */}
              <div className="w-80 h-10 left-[18px] top-[25px] absolute bg-stone-900 rounded-md">
                <div className="w-32 h-8 left-[4px] top-[4px] absolute bg-neutral-800 rounded shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-center">
                  <div className="text-white text-sm font-medium font-lexend leading-tight">Blocks</div>
                </div>
                <div className="w-28 h-4 left-[181px] top-[11px] absolute text-center justify-center text-zinc-400 text-sm font-medium font-lexend leading-tight">
                  Knowledge Base
                </div>
              </div>

              {/* Instruction text */}
              <div className="w-72 left-[19px] top-[82px] absolute justify-center text-white text-sm font-normal font-lexend leading-none">
                Drag blocks from the sidebar to the canvas to build your workflow
              </div>

              {/* Blocks container */}
              <div className="w-80 left-[18px] top-[146px] absolute flex flex-col gap-3">
                {/* Start Block */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'start')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-gray-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-blue-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Start</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Process starting point</div>
                </div>

                {/* Custom Agent */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'custom-agent')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-zinc-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-green-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 12.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l1.5-1.5A.5.5 0 0 1 7.5 3h3a.5.5 0 0 1 .354.146l1.5 1.5A.5.5 0 0 1 12.5 5v7a.5.5 0 0 1-.5.5H6z"/>
                        <path d="M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8zm0-2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 5.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Custom Agent</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Build your own specialized agent</div>
                </div>

                {/* Article Creation Agent */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'article-creation')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-zinc-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-green-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 12.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l1.5-1.5A.5.5 0 0 1 7.5 3h3a.5.5 0 0 1 .354.146l1.5 1.5A.5.5 0 0 1 12.5 5v7a.5.5 0 0 1-.5.5H6z"/>
                        <path d="M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8zm0-2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 5.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Article Creation Agent</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Create PDF files containing text and image</div>
                </div>

                {/* Response Tool */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'response')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-stone-800 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-orange-400">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z"/>
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Response</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Responds to queries</div>
                </div>

                {/* End Block */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'end')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-gray-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-blue-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">End</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Finalizes the flow</div>
                </div>
              </div>
            </div>


            {/* Center Canvas */}
            <div
              className={`absolute left-96 right-96 top-20 h-full bg-stone-950 ${dragOver ? 'bg-stone-900' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {droppedBlocks.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-2 border-zinc-400 rounded flex items-center justify-center">
                    <div className="w-7 h-7 bg-zinc-400 rounded"></div>
                  </div>
                  <div className="mt-4 text-center text-zinc-400 text-sm font-normal font-lexend max-w-80 px-4">
                    Drag blocks from the left panel to start building
                  </div>
                </div>
              ) : (
                <>
                  {droppedBlocks.map((block) => {
                    const blockInfo = getBlockInfo(block.type);
                    return (
                      <div
                        key={block.id}
                        className="absolute w-32 h-12 bg-neutral-900 rounded-lg border border-zinc-800 flex items-center gap-2 px-2"
                        style={{ left: block.x, top: block.y }}
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          blockInfo.color === 'blue' ? 'bg-gray-900' :
                          blockInfo.color === 'green' ? 'bg-zinc-900' : 'bg-stone-800'
                        }`}>
                          <div className={`w-3 h-3 ${
                            blockInfo.color === 'blue' ? 'bg-blue-500' :
                            blockInfo.color === 'green' ? 'bg-green-500' : 'bg-orange-400'
                          }`}></div>
                        </div>
                        <div className="text-white text-xs font-medium font-lexend truncate">
                          {blockInfo.title}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Right Sidebar - Configuration Panel */}
            <div className="w-96 h-full absolute right-0 top-20 bg-stone-950 border-l border-zinc-800 overflow-hidden">
              <div className="p-5">
                <div className="text-white text-sm font-semibold font-lexend mb-6">Configuration</div>

                <div className="text-zinc-400 text-sm font-normal font-lexend mb-4">
                  Select a block to configure its settings
                </div>

                {/* Sample configuration fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-white text-xs font-medium font-lexend">Node ID</label>
                    <div className="w-full h-8 bg-neutral-800 rounded border border-zinc-700 px-3 flex items-center">
                      <div className="text-zinc-500 text-sm font-normal font-lexend">Enter node ID</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-xs font-medium font-lexend">Description</label>
                    <div className="w-full h-20 bg-neutral-800 rounded border border-zinc-700 p-3">
                      <div className="text-zinc-500 text-sm font-normal font-lexend">Enter description...</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-xs font-medium font-lexend">API Key</label>
                    <div className="w-full h-8 bg-neutral-800 rounded border border-zinc-700 px-3 flex items-center">
                      <div className="text-zinc-500 text-sm font-normal font-lexend">••••••••••••••••</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}