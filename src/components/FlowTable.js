'use client';

import StatusBadge from './StatusBadge';

export default function FlowTable({ flows = [], onViewFlow }) {
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="w-full mt-30 bg-neutral-900 rounded-2xl outline-2 outline-offset-[-1.83px] outline-zinc-800 overflow-hidden">
      {/* Table Header */}
      <div className="w-full h-20 border-b border-zinc-800 grid items-center px-14" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
        <div className="text-white text-sm font-medium font-inter">
          Flow Name
        </div>
        <div className="text-white text-sm font-semibold font-inter">Status</div>
        <div className="text-white text-sm font-semibold font-inter">Last Run</div>
        <div className="text-white text-sm font-semibold font-inter">Runs Today</div>
        <div className="text-white text-sm font-semibold font-inter">Success Rate</div>
        <div className="text-white text-sm font-semibold font-inter">View</div>
      </div>

      {/* Table Rows */}
      {flows.length === 0 ? (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="text-zinc-400 text-sm">No flows found</div>
        </div>
      ) : (
        flows.map((flow, index) => (
          <div 
            key={flow.id || index} 
            className={`w-full h-20 border-b border-zinc-800 grid items-center px-14 hover:bg-neutral-800/50 transition-colors ${
              index === flows.length - 1 ? 'border-b-0' : ''
            }`}
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}
          >
            <div className="text-white text-sm font-normal font-inter">
              {flow.name}
            </div>
            <div>
              <StatusBadge status={flow.status} />
            </div>
            <div className="text-white text-sm font-normal font-inter">
              {formatTimeAgo(flow.lastRun)}
            </div>
            <div className="text-white text-sm font-normal font-inter">
              {flow.runsToday || 0}
            </div>
            <div className="text-white text-sm font-normal font-inter">
              {flow.successRate || '0%'}
            </div>
            <button
              onClick={() => onViewFlow?.(flow)}
              className="w-5 h-3.5 rounded-[3px] outline-1 outline-offset-[-1px] outline-white hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <div className="w-2 h-2.5 bg-white" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
