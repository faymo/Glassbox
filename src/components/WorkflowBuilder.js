'use client';

import { useState } from 'react';
import BlocksSidebar from '@/components/BlocksSidebar';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import Configuration from '@/components/Configuration';

export default function WorkflowBuilder({ createdRepoName, blocks, setBlocks, connections, setConnections }) {
  const [selectedBlock, setSelectedBlock] = useState(null);

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Blocks */}
      <BlocksSidebar />
      
      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-stone-900 border-b border-zinc-800 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25608 8.93672C7.28938 8.93672 8.9377 7.2884 8.9377 5.2551C8.9377 3.2218 7.28938 1.57349 5.25608 1.57349C3.22278 1.57349 1.57446 3.2218 1.57446 5.2551C1.57446 7.2884 3.22278 8.93672 5.25608 8.93672Z" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.85759 9.8571L7.85571 7.85522" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.87476 5.25476H6.63597" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white text-xs font-normal">100%</span>
            <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.13328 8.93672C7.16658 8.93672 8.81489 7.2884 8.81489 5.2551C8.81489 3.2218 7.16658 1.57349 5.13328 1.57349C3.09998 1.57349 1.45166 3.2218 1.45166 5.2551C1.45166 7.2884 3.09998 8.93672 5.13328 8.93672Z" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.73528 9.8571L7.7334 7.85522" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.13379 3.87427V6.63548" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.75342 5.25476H6.51463" stroke="white" strokeWidth="0.920404" strokeLinecap="round" strokeLinejoin="round"/>
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
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 p-4 min-h-0">
          <WorkflowCanvas
            blocks={blocks}
            setBlocks={setBlocks}
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            connections={connections}
            setConnections={setConnections}
          />
        </div>
      </div>
      
      {/* Right Sidebar - Configuration */}
      <Configuration selectedBlock={selectedBlock} createdRepoName={createdRepoName} blocks={blocks} />
    </div>
  );
}
