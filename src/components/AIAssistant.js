'use client';

import React, { useState } from 'react';

const quickStartTemplates = [
  {
    id: 'call-trends',
    title: 'Call Trends Report',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.21778 6.92444C4.49778 9.44 6.56 11.5022 9.07556 12.7822L11.0311 10.8267C11.28 10.5778 11.6267 10.5067 11.9378 10.6044C12.9333 10.9333 14 11.1111 15.1111 11.1111C15.3469 11.1111 15.573 11.2048 15.7397 11.3715C15.9064 11.5382 16 11.7643 16 12V15.1111C16 15.3469 15.9064 15.573 15.7397 15.7397C15.573 15.9064 15.3469 16 15.1111 16C11.1034 16 7.25983 14.4079 4.42594 11.5741C1.59206 8.74017 0 4.89661 0 0.888889C0 0.653141 0.0936505 0.427048 0.260349 0.260349C0.427048 0.0936505 0.653141 0 0.888889 0H4C4.23575 0 4.46184 0.0936505 4.62854 0.260349C4.79524 0.427048 4.88889 0.653141 4.88889 0.888889C4.88889 2 5.06667 3.06667 5.39556 4.06222C5.49333 4.37333 5.42222 4.72 5.17333 4.96889L3.21778 6.92444Z" fill="white"/>
      </svg>
    )
  },
  {
    id: 'email-marketing',
    title: 'Automated Email Marketing',
    icon: (
      <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.4 3.2L8 7.2L1.6 3.2V1.6L8 5.6L14.4 1.6M14.4 0H1.6C0.712 0 0 0.712 0 1.6V11.2C0 11.6243 0.168571 12.0313 0.468629 12.3314C0.768687 12.6314 1.17565 12.8 1.6 12.8H14.4C14.8243 12.8 15.2313 12.6314 15.5314 12.3314C15.8314 12.0313 16 11.6243 16 11.2V1.6C16 0.712 15.28 0 14.4 0Z" fill="white"/>
      </svg>
    )
  },
  {
    id: 'inventory-optimization',
    title: 'Inventory Optimization Report',
    icon: (
      <svg width="18" height="13" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 14.5C16.6022 14.5 16.2206 14.342 15.9393 14.0607C15.658 13.7794 15.5 13.3978 15.5 13C15.5 12.6022 15.658 12.2206 15.9393 11.9393C16.2206 11.658 16.6022 11.5 17 11.5C17.3978 11.5 17.7794 11.658 18.0607 11.9393C18.342 12.2206 18.5 12.6022 18.5 13C18.5 13.3978 18.342 13.7794 18.0607 14.0607C17.7794 14.342 17.3978 14.5 17 14.5ZM18.5 5.5L20.46 8H16V5.5M5 14.5C4.60218 14.5 4.22064 14.342 3.93934 14.0607C3.65804 13.7794 3.5 13.3978 3.5 13C3.5 12.6022 3.65804 12.2206 3.93934 11.9393C4.22064 11.658 4.60218 11.5 5 11.5C5.39782 11.5 5.77936 11.658 6.06066 11.9393C6.34196 12.2206 6.5 12.6022 6.5 13C6.5 13.3978 6.34196 13.7794 6.06066 14.0607C5.77936 14.342 5.39782 14.5 5 14.5ZM19 4H16V0H2C0.89 0 0 0.89 0 2V13H2C2 13.7956 2.31607 14.5587 2.87868 15.1213C3.44129 15.6839 4.20435 16 5 16C5.79565 16 6.55871 15.6839 7.12132 15.1213C7.68393 14.5587 8 13.7956 8 13H14C14 13.7956 14.3161 14.5587 14.8787 15.1213C15.4413 15.6839 16.2044 16 17 16C17.7956 16 18.5587 15.6839 19.1213 15.1213C19.6839 14.5587 20 13.7956 20 13H22V8L19 4Z" fill="white"/>
      </svg>
    )
  }
];

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsGenerating(true);
      // Simulate AI processing
      setTimeout(() => {
        setIsGenerating(false);
        setInputValue('');
      }, 2000);
    }
  };

  const handleTemplateClick = (template) => {
    setInputValue(template.title);
  };

  return (
    <div className="w-96 h-full bg-stone-950 border-l border-zinc-800 flex flex-col">
      {/* AI Assistant Header */}
      <div className="p-5 pb-4">
        <h2 className="text-white text-base font-semibold font-['Inter'] leading-none mb-2">
          AI Assistant
        </h2>
        <p className="text-zinc-400 text-sm font-normal font-['Inter'] leading-none">
          Type what you want automated, and I'll map it to the right blocks
        </p>
      </div>

      {/* Spacer to push content down */}
      <div className="flex-1" />

      {/* Quick Start Section */}
      <div className="px-5 pb-4">
        <h3 className="text-white text-sm font-semibold font-['Inter'] leading-none mb-4">
          Quick Start:
        </h3>
        
        <div className="space-y-3">
          {/* Call Trends Report */}
          <div 
            className="w-full h-12 bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-1 outline-offset-[-1px] outline-zinc-800 cursor-pointer hover:bg-neutral-800 transition-colors flex items-center px-4 gap-3"
            onClick={() => handleTemplateClick(quickStartTemplates[0])}
          >
            <div className="w-4 h-4 text-white flex-shrink-0">
              {quickStartTemplates[0].icon}
            </div>
            <span className="text-white text-sm font-medium font-['Inter'] leading-tight">
              Call Trends Report
            </span>
          </div>

          {/* Automated Email Marketing */}
          <div 
            className="w-full h-12 bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-1 outline-offset-[-1px] outline-zinc-800 cursor-pointer hover:bg-neutral-800 transition-colors flex items-center px-4 gap-3"
            onClick={() => handleTemplateClick(quickStartTemplates[1])}
          >
            <div className="w-4 h-4 text-white flex items-center justify-center">
              {quickStartTemplates[1].icon}
            </div>
            <span className="text-white text-sm font-medium font-['Inter'] leading-tight">
              Automated Email Marketing
            </span>
          </div>

          {/* Inventory Optimization Report */}
          <div 
            className="w-full h-12 bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-1 outline-offset-[-1px] outline-zinc-800 cursor-pointer hover:bg-neutral-800 transition-colors flex items-center px-4 gap-3"
            onClick={() => handleTemplateClick(quickStartTemplates[2])}
          >
            <div className="w-5 h-4 text-white flex-shrink-0">
              {quickStartTemplates[2].icon}
            </div>
            <span className="text-white text-sm font-medium font-['Inter'] leading-tight">
              Inventory Optimization Report
            </span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-5 pt-0">
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-1 outline-offset-[-1px] outline-zinc-800 flex items-center px-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Describe your workflow..."
              className="flex-1 bg-transparent text-zinc-400 text-sm font-medium font-['Inter'] leading-tight focus:outline-none"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isGenerating}
            className="w-10 h-10 bg-violet-600 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-4 h-3 bg-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}