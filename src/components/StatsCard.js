'use client';

export default function StatsCard({ title, value, className = "" }) {
  return (
    <div className={`w-85 h-32 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-1 outline-offset-[-1px] outline-zinc-800 ${className}`}>
      <div className="absolute left-8 top-6 text-white text-base font-normal font-inter leading-8">
        {title}
      </div>
      <div className="absolute left-8 top-12 text-white text-2xl font-bold font-inter leading-10">
        {value}
      </div>
    </div>
  );
}
