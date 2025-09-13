'use client';

import { useState } from 'react';
import TitleSection from '@/components/TitleSection';
import WorkflowBuilder from '@/components/WorkflowBuilder';

export default function MainContent() {
  const [createdRepoName, setCreatedRepoName] = useState('');

  return (
    <div className="flex flex-col h-full">
      {/* Title Section */}
      <TitleSection onRepoCreated={setCreatedRepoName} />

      {/* Workflow Builder */}
      <div className="flex-1 min-h-0">
        <WorkflowBuilder createdRepoName={createdRepoName} />
      </div>
    </div>
  );
}