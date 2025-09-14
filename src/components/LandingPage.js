'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import LogIcon from './icons/Log.svg';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function LandingPage() {
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  
  // Configuration states
  const [threshold, setThreshold] = useState(80);
  const [retryCount, setRetryCount] = useState('');
  const [fallbackStrategy, setFallbackStrategy] = useState('Ask for approval');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateVerticalLines = () => {
      const demoSection = document.querySelector('.workflow-demo');
      if (demoSection) {
        const demoTop = demoSection.offsetTop;
        const line1 = document.getElementById('vertical-line-1');
        const line2 = document.getElementById('vertical-line-2');
        if (line1 && line2) {
          line1.style.height = `35rem`;
          line2.style.height = `35rem`;
        }
      }
    };

    updateVerticalLines();
    window.addEventListener('resize', updateVerticalLines);
    return () => window.removeEventListener('resize', updateVerticalLines);
  }, []);

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const blockType = e.dataTransfer.getData('text/plain');
    if (blockType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newBlock = {
        id: `${blockType}-${Date.now()}`,
        type: blockType,
        x: x - 40, // Center the block
        y: y - 20,
      };

      setDroppedBlocks([...droppedBlocks, newBlock]);
    }
  };

  const getBlockInfo = (type) => {
    const blockTypes = {
      'start': { title: 'Start', description: 'Process starting point', color: 'blue' },
      'custom-agent': { title: 'Custom Agent', description: 'Build your own specialized agent', color: 'green' },
      'article-creation': { title: 'Article Creation Agent', description: 'Create PDF files containing text and image', color: 'green' },
      'response': { title: 'Response', description: 'Responds to queries', color: 'orange' },
      'end': { title: 'End', description: 'Finalizes the flow', color: 'blue' }
    };
    return blockTypes[type] || blockTypes['start'];
  };
  return (
    <div className="w-full bg-neutral-900 relative">
      {/* Vertical Lines */}
      <div className="absolute left-1/3 top-0 w-px bg-zinc-800 z-[1]" id="vertical-line-1"></div>
      <div className="absolute left-2/3 top-0 w-px bg-zinc-800 z-[1]" id="vertical-line-2"></div>
      
      {/* Header */}
      <div className="w-full h-16 bg-neutral-900 flex items-center px-4 md:px-10 relative z-20">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.0534668 1.96411C1.27163 0.339895 2.49312 -0.185474 4.50464 0.0559082C5.4907 0.866672 6.00673 1.38443 6.41187 2.59985C6.42443 3.3415 6.42586 4.08382 6.41187 4.82544H9.59155C9.55877 4.3861 9.52572 3.94606 9.49194 3.49341C9.49917 2.34749 9.56091 2.01012 10.2068 1.01001C11.4734 0.182838 12.5301 -0.119263 14.0417 0.0559082C15.0636 0.694586 15.4839 1.18451 15.8533 2.33423C15.9949 3.10451 16.0485 3.72959 15.95 4.50708C15.1574 5.5638 14.6561 5.99761 13.406 6.41431C12.6644 6.42687 11.922 6.4283 11.1804 6.41431V9.59399C11.6198 9.56121 12.0598 9.52816 12.5125 9.49438C13.6585 9.50161 13.9956 9.56419 14.9958 10.2102C15.8231 11.4769 16.1252 12.5333 15.95 14.0452C15.3114 15.0669 14.822 15.4863 13.6726 15.8557C12.9021 15.9974 12.2765 16.051 11.4988 15.9524C10.4422 15.16 10.0082 14.6593 9.59155 13.4094C9.57898 12.6677 9.57756 11.9255 9.59155 11.1838H6.41187C6.44465 11.6231 6.4777 12.0623 6.51147 12.5149C6.50425 13.6612 6.44175 13.9989 5.79565 14.9993C4.52907 15.8264 3.47248 16.1277 1.96069 15.9524C0.939007 15.3138 0.519515 14.8246 0.150146 13.675C0.00841106 12.9045 -0.0451541 12.2789 0.0534668 11.5012C0.845802 10.4448 1.34667 10.0106 2.59644 9.59399C3.33809 9.58142 4.08039 9.58 4.82202 9.59399V6.41431C4.38277 6.44709 3.94353 6.48014 3.49097 6.51392C2.34485 6.5067 2.00759 6.44487 1.00757 5.79907C0.185986 4.54102 -0.137187 3.46812 0.0534668 1.96411ZM4.82202 11.1838C3.4589 11.1324 2.80092 11.0472 1.64233 11.8196C1.49058 13.0032 1.59909 13.3436 2.27905 14.3635C3.16829 14.5003 3.66323 14.4833 4.44409 14.0256C4.93696 13.2215 4.93734 13.2212 4.82202 11.1838ZM12.4138 11.1243C11.9951 11.1445 11.5888 11.1642 11.1824 11.1838C11.1309 12.5468 11.046 13.2042 11.8181 14.3625C12.6129 14.4619 12.6131 14.4619 13.408 14.3625C14.0434 13.7271 14.0436 13.727 14.282 12.9524C14.3615 12.1377 14.3612 12.1376 13.7253 11.1838C13.5152 11.1522 13.3112 11.1218 13.1072 11.0911C12.7573 11.108 12.7568 11.1077 12.4138 11.1243ZM6.41187 9.59399H9.59155V6.41431H6.41187V9.59399ZM4.18628 1.64575C3.00268 1.69725 2.34469 1.78243 1.18611 1.00997C1.03436 2.19357 1.14287 2.53398 1.82283 3.55384C2.71207 3.69063 3.20701 3.67361 3.98787 3.21594C4.48074 2.41185 4.48112 2.41155 4.36579 0.374146C4.31429 0.792637 4.26316 1.21896 4.18628 1.64575ZM11.1804 4.82544V1.64575C12.5435 1.69725 13.2015 1.78243 14.3601 1.00997C14.5118 2.19357 14.4033 2.53398 13.7234 3.55384C12.8341 3.69063 12.3392 3.67361 11.5583 3.21594C11.0655 2.41185 11.0651 2.41155 11.1804 0.374146V4.82544Z" fill="#7c3aed"/>
          </svg>
          <div className="text-white text-2xl font-light italic font-lexend">
            Glassbox
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pb-8">

        {/* Main Title */}
        <div className="mt-12 px-4 z-10 md:px-10 w-['30vw'] max-w-5xl text-neutral-100 text-6xl font-normal leading-[60px] relative">
          Build your own AI Agent workflows to keep your customers engaged
        </div>

        {/* Divider Line */}
        <div className="w-full h-px mt-16 bg-zinc-800"></div>

        {/* Subtitle */}
        <div className="mt-8 px-4 z-10 md:px-10 max-w-md text-white text-base font-normal leading-relaxed">
          Build, deploy, and manage AI agents while getting visibility into every decision your agents make
        </div>

        {/* Get Started Button */}
        <div className="mt-8 px-4 md:px-10 relative h-12 z-10">
          <Link href="/overview">
            <div className="w-[255px] h-12 overflow-hidden bg-violet-600 relative flex items-center">
              <div className="ml-4 text-white text-base font-normal leading-none">Get Started</div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px mt-8 bg-zinc-800"></div>

        {/* Workflow Builder Mockup */}
        <div className="mt-12 px-4 md:px-10 workflow-demo">
          <div className="w-full max-w-7xl mx-auto h-[703px] bg-stone-900 border border-zinc-800 overflow-hidden relative rounded-lg">
            {/* Mac-style title bar */}
            <div className="w-full h-8 bg-neutral-800 border-b border-zinc-700 flex items-center px-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Top toolbar */}
            <div className="w-full h-12 bg-stone-900 border-b border-zinc-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.09 9.09L7.09 7.09" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-normal">100%</span>
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="0.9"/>
                    <path d="M6 3V9" stroke="white" strokeWidth="0.9"/>
                    <path d="M3 6H9" stroke="white" strokeWidth="0.9"/>
                  </svg>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.88721 4.71094V8.02348H5.19974" stroke="white" strokeWidth="1.10418" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.8248 10.2317C11.8248 8.91394 11.3013 7.6501 10.3695 6.71827C9.43766 5.78644 8.17382 5.26294 6.85601 5.26294C5.6332 5.26418 4.45379 5.71629 3.54348 6.53275L1.88721 8.02339" stroke="white" strokeWidth="1.10418" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6922 4.56433V7.94895H9.30762" stroke="white" strokeWidth="1.12821" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.53857 10.2052C2.53857 8.85874 3.07346 7.5674 4.02557 6.61529C4.97768 5.66318 6.26901 5.1283 7.6155 5.1283C8.86492 5.12957 10.07 5.59151 11.0001 6.42573L12.6924 7.94881" stroke="white" strokeWidth="1.12821" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* Publish button in toolbar */}
                <button className="w-20 h-7 bg-violet-600 rounded flex items-center gap-1 px-2 hover:bg-violet-700 transition-colors">
                  <svg width="8" height="9" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0V1.375H9.625V0H0ZM0 6.875H2.75V11H6.875V6.875H9.625L4.8125 2.0625L0 6.875Z" fill="white"/>
                  </svg>
                  <span className="text-white text-xs font-medium">Publish</span>
                </button>
              </div>
            </div>

            {/* Left Sidebar */}
            <div className="w-96 h-full absolute left-0 top-20 bg-stone-950 border-r border-zinc-800 overflow-hidden">
              {/* Header with tabs */}
              <div className="w-80 h-10 left-[18px] top-[25px] absolute bg-stone-900 rounded-md">
                <div className="w-32 h-8 left-[4px] top-[4px] absolute bg-neutral-800 rounded shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-center">
                  <div className="text-white text-sm font-medium font-lexend leading-tight">Blocks</div>
                </div>
                <div className="w-28 h-4 left-[181px] top-[11px] absolute text-center justify-center text-zinc-400 text-sm font-medium font-lexend leading-tight">
                  Knowledge Base
                </div>
              </div>

              {/* Instruction text */}
              <div className="w-72 left-[19px] top-[82px] absolute justify-center text-white text-sm font-normal font-lexend leading-none">
                Drag blocks from the sidebar to the canvas to build your workflow
              </div>

              {/* Blocks container */}
              <div className="w-80 left-[18px] top-[146px] absolute flex flex-col gap-3">
                {/* Start Block */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'start')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-gray-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-blue-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Start</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Process starting point</div>
                </div>

                {/* Custom Agent */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'custom-agent')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-zinc-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-green-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 12.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l1.5-1.5A.5.5 0 0 1 7.5 3h3a.5.5 0 0 1 .354.146l1.5 1.5A.5.5 0 0 1 12.5 5v7a.5.5 0 0 1-.5.5H6z"/>
                        <path d="M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8zm0-2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 5.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Custom Agent</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Build your own specialized agent</div>
                </div>

                {/* Article Creation Agent */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'article-creation')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-zinc-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-green-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 12.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l1.5-1.5A.5.5 0 0 1 7.5 3h3a.5.5 0 0 1 .354.146l1.5 1.5A.5.5 0 0 1 12.5 5v7a.5.5 0 0 1-.5.5H6z"/>
                        <path d="M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8zm0-2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 5.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Article Creation Agent</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Create PDF files containing text and image</div>
                </div>

                {/* Response Tool */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'response')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-stone-800 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-orange-400">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z"/>
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">Response</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Responds to queries</div>
                </div>

                {/* End Block */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'end')}
                  className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                    <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <div className="w-7 h-7 left-[36px] top-[18px] absolute bg-gray-900 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 text-blue-500">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">End</div>
                  <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">Finalizes the flow</div>
                </div>
              </div>
            </div>


            {/* Center Canvas */}
            <div
              className={`absolute left-96 right-96 top-20 h-full bg-stone-950 ${dragOver ? 'bg-stone-900' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {droppedBlocks.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-2 border-zinc-400 rounded flex items-center justify-center">
                    <div className="w-7 h-7 bg-zinc-400 rounded"></div>
                  </div>
                  <div className="mt-4 text-center text-zinc-400 text-sm font-normal font-lexend max-w-80 px-4">
                    Drag blocks from the left panel to start building
                  </div>
                </div>
              ) : (
                <>
                  {droppedBlocks.map((block) => {
                    const blockInfo = getBlockInfo(block.type);
                    return (
                      <div
                        key={block.id}
                        className="absolute w-32 h-12 bg-neutral-900 rounded-lg border border-zinc-800 flex items-center gap-2 px-2"
                        style={{ left: block.x, top: block.y }}
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          blockInfo.color === 'blue' ? 'bg-gray-900' :
                          blockInfo.color === 'green' ? 'bg-zinc-900' : 'bg-stone-800'
                        }`}>
                          <div className={`w-3 h-3 ${
                            blockInfo.color === 'blue' ? 'bg-blue-500' :
                            blockInfo.color === 'green' ? 'bg-green-500' : 'bg-orange-400'
                          }`}></div>
                        </div>
                        <div className="text-white text-xs font-medium font-lexend truncate">
                          {blockInfo.title}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Right Sidebar - Log Icon */}
            <div className="w-96 h-full absolute right-0 top-20 bg-stone-950 border-l border-zinc-800 overflow-hidden flex items-center justify-center p-8">
              <Image 
                src={LogIcon} 
                alt="Log visualization" 
                className="w-full h-full object-contain"
                width={384}
                height={663}
              />
            </div>
          </div>
        </div>

        {/* Product Walkthrough Section */}
        <div className="w-full h-px mt-24 bg-zinc-800"></div>
        <div className="mt-16 px-4 md:px-10">
          <div className="flex items-center mb-16">
            <div className="w-3.5 h-3.5 bg-violet-600 rounded-full mr-4"></div>
            <span className="text-neutral-100 text-lg font-medium font-lexend">Product Walkthrough</span>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="px-4 md:px-10 flex flex-col lg:flex-row gap-12 mb-24">
          {/* Seamless No-Code & Code */}
          <div className="flex-1 bg-stone-950 p-8 rounded-xl border border-zinc-800">
            <div className="text-neutral-100 text-xl font-semibold font-lexend mb-4">Seamless No-Code & Code</div>
            <div className="text-zinc-400 text-base font-normal font-lexend leading-relaxed mb-8">Start with drag-and-drop blocks, then switch to code view when you want precision edits.</div>
            
            {/* Compare visualization */}
            <div className="flex justify-center">
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src="/Left.png" alt="No-code view" />}
                itemTwo={<ReactCompareSliderImage src="/Right.png" alt="Code view" />}
                style={{
                  height: '400px',
                  width: '100%',
                  maxWidth: '500px',
                  borderRadius: '12px',
                  border: '1px solid #27272a'
                }}
              />
            </div>
          </div>

          {/* Supports Multiple Outputs */}
          <div className="flex-1 bg-stone-950 p-8 rounded-xl border border-zinc-800 min-h-[400px] flex flex-col justify-center items-center">
            <div className="text-neutral-100 text-xl font-semibold font-lexend mb-4 self-start">Supports Multiple Outputs</div>
            <div className="text-zinc-400 text-base font-normal font-lexend leading-relaxed mb-8 self-start">Generate video tutorials, article content, and automated support responses effortlessly</div>
            
            <div className="flex-1 flex justify-center items-center">
              <img
                src="/Support.png"
                alt="Support visualization"
                className="max-w-[90%] max-h-[90%] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Three Feature Cards Section */}
        <div className="px-4 md:px-10 flex flex-col lg:flex-row gap-8 mb-24">
          {/* See Every Decision */}
          <div className="flex-1 bg-stone-950 p-8 rounded-xl border border-zinc-800 relative overflow-hidden min-h-[400px]">
            <div className="text-neutral-100 text-xl font-semibold font-lexend mb-4">See Every Decision</div>
            <div className="text-zinc-400 text-base font-normal font-lexend leading-relaxed mb-8">Understand how and why each decision was made with transparent, human-readable reasoning logs</div>
            
            
            {/* Decision.png image in bottom right corner */}
            <div className="absolute bottom-0 right-0 transform translate-x-1/5 translate-y-1/4">
              <img
                src="/Decision.png"
                alt="Decision visualization"
                width={300}
                height={300}
                className="transition-transform duration-300 ease-in-out hover:-rotate-45"
              />
            </div>
          </div>

          {/* Configure Every Detail */}
          <div className="flex-1 bg-stone-950 p-8 rounded-xl border border-zinc-800 min-h-[400px]">
            <div className="text-neutral-100 text-xl font-semibold font-lexend mb-4">Configure Every Detail</div>
            <div className="text-zinc-400 text-base font-normal font-lexend leading-relaxed mb-8">Adjust data, models, thresholds, and actions so your agents behave exactly as you want</div>
            
            <div className="space-y-8 w-[70%] self-center place-self-center mt-15">
              {/* Configure Threshold - Functional Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white text-sm font-medium font-inter">Configure Threshold</label>
                  <span className="text-white text-xs font-normal font-inter">{threshold}%</span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-zinc-800 rounded-full">
                    <div 
                      className="h-2 bg-violet-600 rounded-full transition-all duration-200" 
                      style={{ width: `${threshold}%` }}
                    />
                  </div>
                  <div 
                    className="w-4 h-4 absolute top-[-4px] bg-neutral-900 rounded-full border-[1.27px] border-violet-600 cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ left: `calc(${threshold}% - 8px)` }}
                    onMouseDown={(e) => {
                      const slider = e.currentTarget.previousElementSibling.querySelector('.bg-zinc-800');
                      const rect = slider.getBoundingClientRect();
                      const handleMouseMove = (e) => {
                        const x = e.clientX - rect.left;
                        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                        setThreshold(Math.round(percentage));
                      };
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </div>
              </div>
              
              {/* Retry Logic - Functional Input */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium font-inter">Retry Logic</label>
                <div className="w-full h-9 bg-zinc-800 rounded">
                  <input
                    type="number"
                    value={retryCount}
                    onChange={(e) => setRetryCount(e.target.value)}
                    placeholder="Enter a number..."
                    className="w-full h-full bg-transparent text-white text-sm font-normal font-inter px-4 outline-none placeholder-zinc-400 rounded"
                  />
                </div>
              </div>
              
              {/* Fallback Strategy - Functional Dropdown */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium font-inter">Fallback Strategy</label>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full h-9 bg-zinc-800 rounded flex items-center justify-between px-4 text-white text-sm font-normal font-inter outline-none hover:bg-zinc-700 transition-colors"
                  >
                    <span>{fallbackStrategy}</span>
                    <div className={`w-3 h-2 bg-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                         style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-zinc-800 border border-zinc-700 rounded mt-1 z-10 shadow-lg">
                      {['Ask for approval', 'Retry automatically', 'Skip and continue', 'Stop execution'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFallbackStrategy(option);
                            setDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white text-sm font-normal font-inter hover:bg-zinc-700 transition-colors first:rounded-t last:rounded-b"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Agent Intelligence */}
          <div className="flex-1 bg-stone-950 p-8 rounded-xl border border-zinc-800 min-h-[400px] flex flex-col justify-center items-center">
            <div className="text-neutral-100 text-xl font-semibold font-lexend mb-4 self-start">Multi-Agent Intelligence</div>
            <div className="text-zinc-400 text-base font-normal font-lexend leading-relaxed mb-8 self-start">Divide work across specialized agents</div>
            
            <div className="flex-1 flex justify-center items-center">
              <img
                src="/Multi.png"
                alt="Multi-agent visualization"
                className="max-w-[90%] max-h-[90%] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Footer Image */}
        <div className="w-full">
          <img
            src="/Footer.png"
            alt="Footer"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </div>
  );
}