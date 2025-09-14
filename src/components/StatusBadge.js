'use client';

export default function StatusBadge({ status, className = "" }) {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          bgColor: 'bg-zinc-900',
          textColor: 'text-green-500',
          dotColor: 'bg-green-500',
          text: 'ACTIVE'
        };
      case 'idle':
        return {
          bgColor: 'bg-stone-800',
          textColor: 'text-white',
          dotColor: 'bg-white',
          text: 'IDLE'
        };
      case 'error':
        return {
          bgColor: 'bg-red-900',
          textColor: 'text-red-500',
          dotColor: 'bg-red-500',
          text: 'ERROR'
        };
      default:
        return {
          bgColor: 'bg-stone-800',
          textColor: 'text-white',
          dotColor: 'bg-white',
          text: status.toUpperCase()
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`w-20 h-5 ${config.bgColor} rounded-[2.84px] outline-1 outline-offset-[-1px] outline-zinc-800 flex items-center gap-2 px-3 ${className}`}>
      <div className={`w-1.5 h-2 ${config.dotColor} rounded-sm`} />
      <div className={`${config.textColor} text-sm font-semibold font-inter uppercase leading-3`}>
        {config.text}
      </div>
    </div>
  );
}
