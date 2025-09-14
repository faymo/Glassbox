'use client';

import { useState } from 'react';

export default function TitleSection({ onRepoCreated, blocks = [] }) {
  const [repoName, setRepoName] = useState('');
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [isSettingKey, setIsSettingKey] = useState(false);
  const [isCreatingDroplet, setIsCreatingDroplet] = useState(false);
  const [createdRepoName, setCreatedRepoName] = useState('');
  const [dropletId, setDropletId] = useState('');

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
      const getDropletApiUrl = process.env.NEXT_PUBLIC_GET_DROPLET_API_URL;
      const deployKeyValue = process.env.NEXT_PUBLIC_DEPLOY_KEY_VALUE;
      const dropletIpValue = process.env.NEXT_PUBLIC_DROPLET_IP_VALUE;

      if (!setKeyApiUrl || !getDropletApiUrl) {
        alert('Set Key API URL or Get Droplet API URL not configured. Please check your environment variables.');
        return;
      }

      if (!deployKeyValue || !dropletIpValue) {
        alert('Deploy Key Value or Droplet IP Value not configured. Please check your environment variables.');
        return;
      }

      // First step: Get droplet details if dropletId exists
      if (dropletId) {
        console.log('Getting droplet details for ID:', dropletId);
        
        const getDropletResponse = await fetch(`${getDropletApiUrl}?dropletId=${dropletId}`, {
          method: 'GET',
        });

        const getDropletResult = await getDropletResponse.json();

        console.log('Get Droplet API Response:', getDropletResult);

        if (!getDropletResponse.ok) {
          alert(`Error getting droplet details: ${getDropletResult.message || 'Unknown error'}`);
          return;
        }
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

      // Set DROPLET_IP (using dropletId if available, otherwise fallback to env value)
      const dropletIpResponse = await fetch(setKeyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: createdRepoName,
          keyValue: dropletId || dropletIpValue,
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

  // Create droplet function
  const handleCreateDroplet = async () => {
    setIsCreatingDroplet(true);

    try {
      const createDropletApiUrl = process.env.NEXT_PUBLIC_CREATE_DROPLET_API_URL;
      const getDropletApiUrl = process.env.NEXT_PUBLIC_GET_DROPLET_API_URL;

      if (!createDropletApiUrl || !getDropletApiUrl) {
        alert('Droplet API URLs not configured. Please check your environment variables.');
        return;
      }

      if (!createdRepoName) {
        alert('Please create a repository first before creating a droplet.');
        return;
      }

      console.log('Creating droplet for repository:', createdRepoName);

      const generateMainLayerUrl = process.env.NEXT_PUBLIC_GENERATE_MAIN_LAYER_URL;

      if (!generateMainLayerUrl) {
        alert('Generate Main Layer API URL not configured. Please check your environment variables.');
        return;
      }

      // Filter only agent blocks and sort them using the same logic as connection lines
      const agentBlocks = blocks.filter(block =>
        block.category === 'agents' ||
        (block.category === 'tools' && ['Web Research', 'Email'].includes(block.title))
      );

      if (agentBlocks.length === 0) {
        alert('No agent blocks found in the workflow.');
        return;
      }

      // Sort blocks by workflow order (left to right, then top to bottom)
      const sortedAgentBlocks = [...agentBlocks].sort((a, b) => {
        // Primary sort: left to right (x position)
        const xDiff = a.x - b.x;
        if (Math.abs(xDiff) > 50) { // If blocks are not roughly vertically aligned
          return xDiff;
        }
        // Secondary sort: top to bottom (y position)
        return a.y - b.y;
      });

      // Extract nodeIds for routers
      const routers = sortedAgentBlocks.map(block => block.nodeId || block.id);
      console.log('Routers:', routers);
      // Create functions array with proper chaining
      const functions = sortedAgentBlocks.map((block, index) => {
        const isFirstFunction = index === 0;
        const isLastFunction = index === sortedAgentBlocks.length - 1;

        return {
          variable: isLastFunction ? `variable${index + 1}` : `variable${index + 1}`,
          name: block.nodeId || block.id,
          parameter: isFirstFunction ? "initialInput" : `variable${index}`
        };
      });

      const payload = {
        routers: ["video", "scraper"],
        functions: [
            {variable: "variable", name: "scraper", parameter: "initialInput"},
            {variable: "variable2", name: "video", parameter: "variable"}
        ], modality: true
      };

      console.log('Calling generate-main-layer with payload:', payload);

      // Call generate-main-layer endpoint first
      const generateResponse = await fetch(generateMainLayerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const generateResult = await generateResponse.json();

      if (!generateResponse.ok) {
        alert(`Error calling generate-main-layer: ${generateResult.message || 'Unknown error'}`);
        console.error('Generate main layer error:', generateResult);
        return;
      }

      console.log('Generate main layer result:', generateResult);

      // Call create-file endpoint for main.py
      const createFileUrl = process.env.NEXT_PUBLIC_CODE_DEPLOY_API_URL;
      if (!createFileUrl) {
        alert('Create File API URL not configured. Please check your environment variables.');
        return;
      }

      const mainPyPayload = {
        code: generateResult,
        commitMessage: "initial commit",
        path: "main.py",
        repoName: createdRepoName,
        githubUser: "BaronLiu1993"
      };

      console.log('Calling create-file for main.py with payload:', mainPyPayload);

      const mainPyResponse = await fetch(createFileUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mainPyPayload),
      });

      const mainPyResult = await mainPyResponse.json();

      if (!mainPyResponse.ok) {
        alert(`Error creating main.py: ${mainPyResult.message || 'Unknown error'}`);
        console.error('Main.py creation error:', mainPyResult);
        return;
      }

      console.log('Main.py creation result:', mainPyResult);

      // Call create-file endpoint for requirements.txt
      const requirementsTxtPayload = {
        code: "fastapi\npydantic\nuvicorn\ncelery\nopenai\ngoogle-genai\nSQLAlchemy\nrequests\npsycopg2-binary\npgvector\n",
        commitMessage: "initial commit",
        path: "requirements.txt",
        repoName: createdRepoName,
        githubUser: "BaronLiu1993"
      };

      console.log('Calling create-file for requirements.txt with payload:', requirementsTxtPayload);

      const requirementsTxtResponse = await fetch(createFileUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requirementsTxtPayload),
      });

      const requirementsTxtResult = await requirementsTxtResponse.json();

      if (!requirementsTxtResponse.ok) {
        alert(`Error creating requirements.txt: ${requirementsTxtResult.message || 'Unknown error'}`);
        console.error('Requirements.txt creation error:', requirementsTxtResult);
        return;
      }

      console.log('Requirements.txt creation result:', requirementsTxtResult);

      const createDropletPayload = {
        name: "HTN",
        userName: "BaronLiu1993",
        repoName: createdRepoName,
        postgresUser: "demo",
        postgresPassword: "demo123"
      };

      const response = await fetch(createDropletApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDropletPayload),
      });

      const result = await response.json();

      console.log('Create Droplet API Response:', result);

      if (response.ok && result.success) {
        console.log('Droplet created successfully, now getting droplet details...');

        setDropletId(result.dropletId.toString());
        alert(`Droplet created successfully! Droplet ID: ${result.dropletId}`);
      } else {
        console.error('Create Droplet API Error:', result);
        alert(`Error creating droplet: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsCreatingDroplet(false);
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

        {/* Create Droplet Button */}
        <button
          onClick={handleCreateDroplet}
          disabled={isCreatingDroplet || !createdRepoName}
          className="w-38 h-9 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed rounded-md flex items-center gap-2 px-4 transition-colors"
        >
          {isCreatingDroplet ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">Creating...</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1C3.79 1 2 2.79 2 5C2 7.21 3.79 9 6 9C8.21 9 10 7.21 10 5C10 2.79 8.21 1 6 1ZM7 5.5H6.5V6C6.5 6.28 6.28 6.5 6 6.5C5.72 6.5 5.5 6.28 5.5 6V5.5H5C4.72 5.5 4.5 5.28 4.5 5C4.5 4.72 4.72 4.5 5 4.5H5.5V4C5.5 3.72 5.72 3.5 6 3.5C6.28 3.5 6.5 3.72 6.5 4V4.5H7C7.28 4.5 7.5 4.72 7.5 5C7.5 5.28 7.28 5.5 7 5.5Z" fill="white"/>
                <path d="M1 11H11V10H1V11Z" fill="white"/>
              </svg>
              <span className="text-white text-sm font-medium">Create Droplet</span>
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