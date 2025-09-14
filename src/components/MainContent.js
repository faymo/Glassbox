'use client';

import { useState } from 'react';
import TitleSection from '@/components/TitleSection';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import WorkflowHeader from '@/components/WorkflowHeader';

export default function MainContent() {
  const [createdRepoName, setCreatedRepoName] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]); // Array of {fromBlockId, toBlockId, type: 'agent-to-tool' | 'agent-to-agent'}

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <WorkflowHeader blocks={blocks} />

      {/* Title Section */}
      <TitleSection onRepoCreated={setCreatedRepoName} />

      {/* Workflow Builder */}
      <div className="flex-1 min-h-0">
        <WorkflowBuilder
          createdRepoName={createdRepoName}
          blocks={blocks}
          setBlocks={setBlocks}
          connections={connections}
          setConnections={setConnections}
        />
      </div>
    </div>
  );
}