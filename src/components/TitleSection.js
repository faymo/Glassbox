'use client';

import { useState } from 'react';

export default function TitleSection({ onRepoCreated }) {
  const [repoName, setRepoName] = useState('');
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [isSettingKey, setIsSettingKey] = useState(false);
  const [createdRepoName, setCreatedRepoName] = useState('');

  // Create repository function
  const handleCreateRepo = async () => {
    if (!repoName.trim()) {
      alert('Please enter a repository name');
      return;
    }

    setIsCreatingRepo(true);

    try {
      const repoApiUrl = process.env.NEXT_PUBLIC_REPO_API_URL;

      if (!repoApiUrl) {
        console.error('Repo API URL not configured. Please set NEXT_PUBLIC_REPO_API_URL in your .env.local file.');
        alert('Repo API URL not configured. Please check your environment variables.');
        return;
      }

      console.log('Creating repository:', repoName.trim());

      const response = await fetch(repoApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoName.trim()
        }),
      });

      const result = await response.json();

      console.log('Repo API Response:', result);
      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers));

      if (response.ok) {
        alert(`Repository "${repoName.trim()}" created successfully! Check console for details.`);
        // Extract just the repo name part from 'Baronliu1993/reponame' format
        const fullRepoPath = result.data || result.name || `Baronliu1993/${repoName.trim()}`;
        const justRepoName = fullRepoPath.includes('/') ? fullRepoPath.split('/')[1] : fullRepoPath;
        setCreatedRepoName(justRepoName); // Store locally for deploy key
        onRepoCreated && onRepoCreated(justRepoName); // Pass just repo name to parent
        setRepoName(''); // Clear input after successful creation
      } else {
        console.error('API Error:', result);
        alert(`Error creating repository: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Set deployment key and droplet IP for repository
  const handleSetDeployKey = async () => {
    setIsSettingKey(true);

    try {
      const setKeyApiUrl = process.env.NEXT_PUBLIC_SET_KEY_API_URL;
      const deployKeyValue = process.env.NEXT_PUBLIC_DEPLOY_KEY_VALUE;
      const dropletIpValue = process.env.NEXT_PUBLIC_DROPLET_IP_VALUE;

      if (!setKeyApiUrl) {
        alert('Set Key API URL not configured. Please check your environment variables.');
        return;
      }

      if (!deployKeyValue || !dropletIpValue) {
        alert('Deploy Key Value or Droplet IP Value not configured. Please check your environment variables.');
        return;
      }

      // Set DEPLOY_KEY
      const deployKeyResponse = await fetch(setKeyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: createdRepoName,
          keyValue: deployKeyValue,
          keyName: "DEPLOY_KEY"
        }),
      });

      const deployKeyResult = await deployKeyResponse.json();

      if (!deployKeyResponse.ok) {
        alert(`Error setting deploy key: ${deployKeyResult.message || 'Unknown error'}`);
        return;
      }

      // Set DROPLET_IP
      const dropletIpResponse = await fetch(setKeyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: createdRepoName,
          keyValue: dropletIpValue,
          keyName: "DROPLET_IP"
        }),
      });

      const dropletIpResult = await dropletIpResponse.json();

      if (dropletIpResponse.ok) {
        alert('Deploy key and droplet IP set successfully!');
      } else {
        alert(`Error setting droplet IP: ${dropletIpResult.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSettingKey(false);
    }
  };

  return (
    <div className="bg-stone-900 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4">
      <div className="max-w-2xl">
        <h1 className="text-white text-lg sm:text-xl font-semibold leading-loose mb-2">Customer Insights</h1>
        <p className="text-zinc-400 text-sm font-normal leading-tight">
          Turn reviews, chats, and emails into insights, instant replies, and escalations with full reporting
        </p>
      </div>

      {/* Create Repo Section */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          placeholder="Repository name"
          className="w-48 h-9 bg-neutral-800 rounded-md px-3 text-white text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-zinc-700"
          disabled={isCreatingRepo}
        />
        <button
          onClick={handleCreateRepo}
          disabled={isCreatingRepo || !repoName.trim()}
          className="w-35 h-9 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-md flex items-center gap-2 px-4 transition-colors"
        >
          {isCreatingRepo ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">Creating...</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C9.3 12 12 9.3 12 6C12 2.7 9.3 0 6 0ZM9 6.6H6.6V9H5.4V6.6H3V5.4H5.4V3H6.6V5.4H9V6.6Z" fill="white"/>
              </svg>
              <span className="text-white text-sm font-medium">Create Repo</span>
            </>
          )}
        </button>

        {/* Deploy Key Button */}
        <button
          onClick={handleSetDeployKey}
          disabled={isSettingKey || !createdRepoName}
          className="w-32 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-md flex items-center gap-2 px-4 transition-colors"
        >
          {isSettingKey ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">Setting...</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L6 4L10 8L12 6L8 2ZM4 6L0 10L2 12L6 8L4 6ZM2 2C3.1 2 4 2.9 4 4C4 5.1 3.1 6 2 6C0.9 6 0 5.1 0 4C0 2.9 0.9 2 2 2Z" fill="white"/>
              </svg>
              <span className="text-white text-sm font-medium">Deploy Key</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}