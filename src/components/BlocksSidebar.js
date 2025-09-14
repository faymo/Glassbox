'use client';

import React, { useState } from 'react';
import IconLibrary from '@/components/icons/IconLibrary';

const blockTypes = [
  {
    id: 'start',
    title: 'Start',
    description: 'Process starting point',
    icon: 'Link',
    color: 'blue',
    category: 'start'
  },
  {
    id: 'custom-agent',
    title: 'Custom Agent',
    description: 'Build your own specialized agent',
    icon: 'Robot',
    color: 'green',
    category: 'agents'
  },
  {
    id: 'video-creation-agent',
    title: 'Video Creation Agent',
    description: 'Generates videos',
    icon: 'Robot',
    color: 'green',
    category: 'agents'
  },
  {
    id: 'article-creation-agent',
    title: 'Article Creation Agent',
    description: 'Create PDF files containing text and image',
    icon: 'Robot',
    color: 'green',
    category: 'agents'
  },
  {
    id: 'response',
    title: 'Response',
    description: 'Responds to queries',
    icon: 'Email',
    color: 'orange',
    category: 'output'
  },
  {
    id: 'end',
    title: 'End',
    description: 'Finalizes the flow',
    icon: 'Link',
    color: 'blue',
    category: 'end'
  },
];

export default function BlocksSidebar() {
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [activeTab, setActiveTab] = useState('blocks');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(block));
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, TXT, or DOCX file.');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'uploaded',
        file: file // Store the actual file object for download
      };

      setUploadedDocuments(prev => [...prev, newDocument]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.getElementById('file-upload');
      fileInput.files = files;
      handleFileUpload({ target: { files: [files[0]] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeDocument = (documentId) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const downloadDocument = (doc) => {
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(doc.file); // We'll need to store the actual file
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'orange':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getBackgroundColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-gray-900';
      case 'green':
        return 'bg-zinc-900';
      case 'orange':
        return 'bg-stone-800';
      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div className="w-96 h-[843px] relative bg-stone-950 border-r border-zinc-800 overflow-hidden">
      {/* Header with tabs */}
      <div className="w-80 h-10 left-[18px] top-[25px] absolute bg-stone-900 rounded-md">
        <div 
          className={`w-28 h-4 left-[25.92px] top-[11px] absolute text-center justify-center text-sm font-medium font-lexend leading-tight cursor-pointer ${activeTab === 'blocks' ? 'text-white' : 'text-zinc-400'}`}
          onClick={() => setActiveTab('blocks')}
        >
          Blocks
        </div>
        <div 
          className={`w-40 h-8 left-[159.92px] top-[4px] absolute rounded shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] cursor-pointer ${activeTab === 'knowledge' ? 'bg-neutral-800' : 'bg-transparent'}`}
          onClick={() => setActiveTab('knowledge')}
        >
          <div className={`left-[21.44px] top-[6px] absolute text-center justify-center text-sm font-medium font-lexend leading-tight ${activeTab === 'knowledge' ? 'text-zinc-400' : 'text-zinc-400'}`}>
            Knowledge Base
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'blocks' ? (
        <>
          {/* Instruction text */}
          <div className="w-72 left-[19px] top-[82px] absolute justify-center text-white text-sm font-normal font-lexend leading-none">Drag blocks from the sidebar to the canvas to build your workflow</div>

          {/* Blocks container */}
          <div className="w-80 left-[18px] top-[146px] absolute flex flex-col gap-3">
            {blockTypes.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                onDragEnd={handleDragEnd}
                className="w-80 h-16 relative bg-neutral-900 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-offset-[-1px] outline-zinc-800 cursor-move hover:bg-neutral-800 transition-colors"
              >
                {/* Drag handle */}
                <div className="w-4 h-6 left-[13px] top-[23px] absolute">
                  <svg width="18" height="22" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.60016 7.68134C7.34583 7.68134 7.95032 7.07685 7.95032 6.33118C7.95032 5.58551 7.34583 4.98102 6.60016 4.98102C5.85449 4.98102 5.25 5.58551 5.25 6.33118C5.25 7.07685 5.85449 7.68134 6.60016 7.68134ZM11.4007 7.68134C12.1464 7.68134 12.7509 7.07685 12.7509 6.33118C12.7509 5.58551 12.1464 4.98102 11.4007 4.98102C10.6551 4.98102 10.0506 5.58551 10.0506 6.33118C10.0506 7.07685 10.6551 7.68134 11.4007 7.68134ZM12.7509 11.1317C12.7509 11.8774 12.1464 12.4819 11.4007 12.4819C10.6551 12.4819 10.0506 11.8774 10.0506 11.1317C10.0506 10.3861 10.6551 9.78158 11.4007 9.78158C12.1464 9.78158 12.7509 10.3861 12.7509 11.1317ZM6.60016 12.4819C7.34583 12.4819 7.95032 11.8774 7.95032 11.1317C7.95032 10.3861 7.34583 9.78158 6.60016 9.78158C5.85449 9.78158 5.25 10.3861 5.25 11.1317C5.25 11.8774 5.85449 12.4819 6.60016 12.4819ZM12.7509 15.9323C12.7509 16.678 12.1464 17.2825 11.4007 17.2825C10.6551 17.2825 10.0506 16.678 10.0506 15.9323C10.0506 15.1867 10.6551 14.5821 11.4007 14.5821C12.1464 14.5821 12.7509 15.1867 12.7509 15.9323ZM6.60016 17.2825C7.34583 17.2825 7.95032 16.678 7.95032 15.9323C7.95032 15.1867 7.34583 14.5821 6.60016 14.5821C5.85449 14.5821 5.25 15.1867 5.25 15.9323C5.25 16.678 5.85449 17.2825 6.60016 17.2825Z" fill="#9CA3AF"/>
                  </svg>
                </div>
                
                {/* Icon container */}
                <div className={`w-7 h-7 left-[36px] top-[18px] absolute ${getBackgroundColor(block.color)} rounded-md flex items-center justify-center`}>
                  {React.createElement(IconLibrary[block.icon], { 
                    className: `w-4 h-4 ${getIconColor(block.color)}` 
                  })}
                </div>
                
                {/* Text content */}
                <div className="left-[79.03px] top-[13px] absolute justify-center text-white text-sm font-medium font-lexend leading-tight">{block.title}</div>
                <div className="left-[79px] top-[35px] absolute justify-center text-zinc-400 text-xs font-normal font-lexend leading-none">{block.description}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Knowledge Base content */}
          <div className="w-72 left-[19px] top-[82px] absolute justify-center text-white text-sm font-normal font-lexend leading-none">
            Upload documents your agent will use to answer questions
          </div>
          
          {/* Upload area */}
          <div 
            className="w-80 h-36 left-[18px] top-[146px] absolute bg-neutral-900 rounded-md outline outline-offset-[-1px] outline-zinc-800 overflow-hidden cursor-pointer hover:bg-neutral-800 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <div className="left-[47px] top-[50px] absolute text-center justify-center text-white text-sm font-medium font-lexend leading-tight">
              {isUploading ? 'Uploading...' : 'Choose a file or drag & drop here'}
            </div>
            <div className="left-[51px] top-[72px] absolute text-center justify-center text-zinc-400 text-xs font-medium font-lexend leading-tight">
              PDF, TXT, or DOCX formats, up to 50 MB
            </div>
            <div className="w-44 h-7 left-[72px] top-[99px] absolute bg-neutral-800 rounded-md outline outline-offset-[-1px] outline-zinc-800 overflow-hidden">
              <div className="left-[25px] top-[4px] absolute text-center justify-center text-white text-sm font-medium font-lexend leading-tight">
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </div>
            </div>
            <div className="w-5 h-4 left-[148px] top-[19px] absolute bg-violet-600" />
            
            {/* Hidden file input */}
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Uploaded Documents List */}
          {uploadedDocuments.length > 0 && (
            <div className="w-80 left-[18px] top-[300px] absolute">
              <div className="text-white text-sm font-medium font-lexend mb-3">Uploaded Documents</div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="w-full bg-neutral-900 rounded-md outline outline-offset-[-1px] outline-zinc-800 p-3 flex items-center justify-between hover:bg-neutral-800 transition-colors cursor-pointer group">
                    <div 
                      className="flex items-center space-x-3 flex-1 min-w-0"
                      onClick={() => downloadDocument(doc)}
                    >
                      {/* File icon */}
                      <div className="w-8 h-8 bg-violet-600 rounded flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 2H10L13 5V13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14H4C3.73478 14 3.48043 13.8946 3.29289 13.7071C3.10536 13.5196 3 13.2652 3 13V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 2V5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      
                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium font-lexend truncate group-hover:text-violet-400 transition-colors">{doc.name}</div>
                        <div className="text-zinc-400 text-xs font-lexend">{formatFileSize(doc.size)}</div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      {/* Download button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadDocument(doc);
                        }}
                        className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center hover:bg-violet-600 transition-colors flex-shrink-0"
                        title="Download file"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 1V8M6 8L3 5M6 8L9 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 9V10C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8946 1.73478 11 2 11H10C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(doc.id);
                        }}
                        className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center hover:bg-red-600 transition-colors flex-shrink-0"
                        title="Remove file"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3L3 9M3 3L9 9" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}