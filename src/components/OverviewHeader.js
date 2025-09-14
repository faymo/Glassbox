'use client';

import Link from 'next/link';

export default function OverviewHeader({ onCreateFlow }) {
  return (
    <div className="w-full h-20 bg-stone-900 border-b border-zinc-800 flex items-center justify-between px-10">
      <div className="flex flex-col justify-start items-start">
        <div className="text-white text-xl font-semibold font-inter leading-loose">
          Overview
        </div>
        <div className="text-zinc-400 text-sm font-normal font-inter leading-tight">
          View and create Agentic AI flows in one place
        </div>
      </div>
      <button
        onClick={onCreateFlow}
        className="w-28 h-9 bg-violet-600 rounded-md cursor-pointer flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 1V11M1 6H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div className="text-white text-base font-medium font-inter">Create</div>
      </button>
    </div>
  );
}
