import WorkflowHeader from '@/components/WorkflowHeader';
import WorkflowBuilder from '@/components/WorkflowBuilder';

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <WorkflowHeader />
      
      {/* Title Section */}
      <div className="bg-stone-900 border-b border-zinc-800 flex items-center px-4 sm:px-6 lg:px-10 py-4">
        <div className="max-w-2xl">
          <h1 className="text-white text-lg sm:text-xl font-semibold leading-loose mb-2">Customer Insights</h1>
          <p className="text-zinc-400 text-sm font-normal leading-tight">
            Turn reviews, chats, and emails into insights, instant replies, and escalations with full reporting
          </p>
        </div>
      </div>

      {/* Main Content Area - Client Component */}
      <div className="flex-1 min-h-0">
        <WorkflowBuilder />
      </div>
    </div>
  );
}
