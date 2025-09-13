import WorkflowHeader from '@/components/WorkflowHeader';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import TitleSection from '@/components/TitleSection';
import MainContent from '@/components/MainContent';

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <WorkflowHeader />

      {/* Main Content Area - Client Component with state management */}
      <div className="flex-1 min-h-0">
        <MainContent />
      </div>
    </div>
  );
}
