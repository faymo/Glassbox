import WorkflowHeader from '@/components/WorkflowHeader';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import TitleSection from '@/components/TitleSection';

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <WorkflowHeader />
      
      {/* Title Section */}
      <TitleSection />

      {/* Main Content Area - Client Component */}
      <div className="flex-1 min-h-0">
        <WorkflowBuilder />
      </div>
    </div>
  );
}
