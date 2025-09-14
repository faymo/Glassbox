import MainContent from '@/components/MainContent';

export default function WorkflowPage() {
  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col overflow-hidden">
      {/* Main Content Area - Client Component with state management */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MainContent />
      </div>
    </div>
  );
}
