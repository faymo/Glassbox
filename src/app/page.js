import OverviewPage from '@/components/OverviewPage';

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-stone-950 flex flex-col">
      {/* Overview Page */}
      <div className="flex-1 min-h-0">
        <OverviewPage />
      </div>
    </div>
  );
}
