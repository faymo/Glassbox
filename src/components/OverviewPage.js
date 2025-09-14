'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WorkflowHeader from './WorkflowHeader';
import OverviewHeader from './OverviewHeader';
import StatsCard from './StatsCard';
import FlowTable from './FlowTable';

export default function OverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalFlows: 0,
    activeFlows: 0,
    totalRunsToday: 0,
    averageSuccessRate: '0%'
  });
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setLoading(true);
      
      // Mock stats data
      setStats({
        totalFlows: 3,
        activeFlows: 1,
        totalRunsToday: 171,
        averageSuccessRate: '94.6%'
      });

      // Mock flows data
      setFlows([
        {
          id: '1',
          name: 'Customer Support Bot',
          status: 'active',
          lastRun: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          runsToday: 150,
          successRate: '95%'
        },
        {
          id: '2',
          name: 'Inventory Optimization',
          status: 'idle',
          lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          runsToday: 21,
          successRate: '94.8%'
        },
        {
          id: '3',
          name: 'Trend & Retention Email Marketing',
          status: 'idle',
          lastRun: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
          runsToday: 0,
          successRate: '94%'
        }
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const handleCreateFlow = () => {
    // Navigate to workflow builder
    router.push('/workflow');
  };

  const handleViewFlow = (flow) => {
    // Navigate to flow details or edit page
    console.log('Viewing flow:', flow);
    // router.push(`/flows/${flow.id}`);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-stone-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-stone-950 overflow-hidden flex flex-col">
      {/* Top Navigation Bar */}
      <WorkflowHeader showButtons={false} />
      
      {/* Page Header */}
      <OverviewHeader onCreateFlow={handleCreateFlow} />
      
      {/* Main Content */}
      <div className="flex-1 px-8 mt-16 pb-8 space-y-8">
        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-7 max-w-[1444px] mx-auto">
          <StatsCard title="Total Flows" value={stats.totalFlows} />
          <StatsCard title="Active Flows" value={stats.activeFlows} />
          <StatsCard title="Total runs today" value={stats.totalRunsToday} />
          <StatsCard title="Average Success Rate" value={stats.averageSuccessRate} />
        </div>

        {/* Flows Table */}
        <div className="max-w-[1444px] mx-auto">
          <FlowTable flows={flows} onViewFlow={handleViewFlow} />
        </div>
      </div>
    </div>
  );
}
