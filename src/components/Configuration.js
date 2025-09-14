'use client';

import { useState, useEffect } from 'react';

const configurationViews = {
  start: {
    title: 'Start Block',
    fields: [
      { label: 'Links', type: 'text', key: 'links' },
      { label: 'Documents', type: 'text', key: 'documents' },
      { label: 'Integration', type: 'text', key: 'integration' },
      { label: 'API', type: 'text', key: 'api' }
    ]
  },
  agent: {
    title: 'Agent Block',
    fields: [
      { label: 'Node ID', type: 'text', key: 'nodeId' },
      { label: 'Node Type', type: 'text', key: 'nodeType' },
      { label: 'System Prompt', type: 'textarea', key: 'systemPrompt' },
      { label: 'Description', type: 'textarea', key: 'description' },
      { label: 'API Key', type: 'text', key: 'apiKey' },
      { label: 'Prompt', type: 'textarea', key: 'prompt' }
    ],
    generateJSON: (formData, blockId) => {
      // Generate shorter ID from blockId (last 6 characters) or random short ID
      const shortId = blockId ? blockId.slice(-6) : Math.random().toString(36).substr(2, 6);

      return {
        NodeConfiguration: [
          {
            type: "GET",
            workflowId: `wf_${shortId}`,
            nodeId: `get_code_documentation`,
            description: `\"\"\"Data retrieval for ${formData.description || 'public code documentation\"\"\"'}`,
            url: `https://raw.githubusercontent.com/facebook/react/main/README.md`,
            authToken: ``,
            parameters: [],
            searchParams: {}
          },
          {
            type: formData.nodeType || "DecisionText",
            workflowId: `wf_${shortId}`,
            nodeId: formData.nodeId || `scraper`,
            systemPrompt: formData.systemPrompt || "You are a Senior Software Engineer.",
            description: formData.description || "\"\"\"Analyze raw github code documentation\"\"\"",
            model: `gemini-2.0-flash`,
            apiKey: formData.apiKey || `apiKey`,
            prompt: formData.prompt || "Analyze public code documentation and return a report of it.",
            functionList: [`get_code_documentation`, `retrieve_memories`]
          }
        ]
      };
    }
  },
  output: {
    title: 'Output Block',
    tabs: ['Send Email', 'Create Report', 'Update Database', 'Create Ticket'],
    fields: {
      'Send Email': [
        { label: 'Email Address', type: 'email', key: 'emailAddress' },
        { label: 'Subject Line', type: 'text', key: 'subjectLine' },
        { label: 'Body', type: 'textarea', key: 'emailBody' }
      ],
      'Create Report': [
        { label: 'Report Type', type: 'select', key: 'reportType', options: ['PDF', 'Excel', 'CSV'] },
        { label: 'Export Format', type: 'select', key: 'exportFormat', options: ['PDF', 'XLSX', 'CSV', 'JSON'] }
      ],
      'Update Database': [
        { label: 'Target Database', type: 'select', key: 'targetDatabase', options: ['MySQL', 'PostgreSQL', 'MongoDB'] },
        { label: 'Mapping', type: 'textarea', key: 'mapping' }
      ],
      'Create Ticket': [
        { label: 'Target System', type: 'select', key: 'targetSystem', options: ['Jira', 'ServiceNow', 'Zendesk'] },
        { label: 'Ticket Title', type: 'text', key: 'ticketTitle' },
        { label: 'Ticket Body', type: 'textarea', key: 'ticketBody' },
        { label: 'Priority', type: 'select', key: 'priority', options: ['Low', 'Medium', 'High', 'Critical'] },
        { label: 'Assignee', type: 'text', key: 'assignee' }
      ]
    }
  }
};

export default function Configuration({ selectedBlock, createdRepoName, blocks }) {
  const [activeTab, setActiveTab] = useState('Configure');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [formData, setFormData] = useState({});
  const [additionalFields, setAdditionalFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentConfigurations, setAgentConfigurations] = useState({});

  // Determine file path based on block combination
  const getFilePath = () => {
    if (!blocks || blocks.length === 0) return 'requirements.txt';

    const hasAgent = blocks.some(block =>
      getBlockType({ type: block.type, title: block.title }) === 'agent'
    );

    const hasToolBlock = blocks.some(block => {
      const blockType = getBlockType({ type: block.type, title: block.title });
      return blockType === 'output' ||
             block.title?.toLowerCase().includes('email') ||
             block.title?.toLowerCase().includes('tool') ||
             block.title?.toLowerCase().includes('send') ||
             block.title?.toLowerCase().includes('create') ||
             block.title?.toLowerCase().includes('update');
    });

    const nodeId = formData.nodeId || selectedBlock?.id || 'agent';
    return `service/${nodeId}.py`;
  };

  // Save agent configuration for the current block
  const saveAgentConfiguration = () => {
    if (!selectedBlock?.id || blockType !== 'agent') return;
    
    const configKey = selectedBlock.id;
    setAgentConfigurations(prev => ({
      ...prev,
      [configKey]: {
        formData: { ...formData },
        blockId: selectedBlock.id,
        timestamp: Date.now(),
        jsonConfig: config?.generateJSON ? config.generateJSON(formData, selectedBlock.id) : null
      }
    }));
  };

  // Load agent configuration for the current block
  const loadAgentConfiguration = () => {
    if (!selectedBlock?.id || blockType !== 'agent') return;
    
    const configKey = selectedBlock.id;
    const savedConfig = agentConfigurations[configKey];
    
    if (savedConfig) {
      setFormData(savedConfig.formData);
    } else {
      // Reset form for new configuration
      setFormData({});
    }
  };

// Submit agent configuration to API
  const handleSubmitAgent = async () => {
    if (blockType !== 'agent' || !config?.generateJSON) return;

    // Save configuration before submitting
    saveAgentConfiguration();
    
    setIsSubmitting(true);

    try {
      const jsonData = config.generateJSON(formData, selectedBlock?.id);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const codeDeployUrl = process.env.NEXT_PUBLIC_CODE_DEPLOY_API_URL;

      if (!apiUrl) {
        alert('Agent API URL not configured. Please check your environment variables.');
        return;
      }

      if (!codeDeployUrl) {
        alert('Code deploy API URL not configured. Please check your environment variables.');
        return;
      }

      if (!createdRepoName) {
        alert('Please create a repository first using the "Create Repo" button.');
        return;
      }

      // First API call - Submit agent configuration
      const agentResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData),
      });

      const agentResult = await agentResponse.json();
      if (agentResponse.ok) {
        // Second API call - Deploy code with agent result
        const deployResponse = await fetch(codeDeployUrl, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code: agentResult || "",
            commitMessage: "initial commit",
            path: getFilePath(),
            repoName: createdRepoName,
            githubUser: "BaronLiu1993"
          }),
        });

        const deployResult = await deployResponse.json();

        if (deployResponse.ok) {
          alert('Agent configuration submitted and code deployed successfully!');
        } else {
          alert(`Error deploying code: ${deployResult.message || 'Unknown error'}`);
        }
      } else {
        alert(`Error submitting agent configuration: ${agentResult.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Auto-save configuration when user makes changes
    setTimeout(() => {
      saveAgentConfiguration();
    }, 500); // Debounce auto-save
  };

  const addField = () => {
    setAdditionalFields(prev => [...prev, { key: `field_${Date.now()}`, label: '', type: 'text', value: '' }]);
  };

  const removeField = (index) => {
    setAdditionalFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateAdditionalField = (index, updates) => {
    setAdditionalFields(prev => prev.map((field, i) => i === index ? { ...field, ...updates } : field));
  };

  const getBlockType = (block) => {
    if (!block) return null;
    const blockType = block.type || block.title?.toLowerCase() || '';

    // Check for output/tool blocks first (more specific)
    if (blockType.includes('email') ||
        blockType.includes('output') ||
        blockType.includes('report') ||
        blockType.includes('database') ||
        blockType.includes('ticket') ||
        blockType.includes('send') ||
        blockType.includes('create') ||
        blockType.includes('update')) {
      return 'output';
    }

    // Check for agent blocks
    if (blockType.includes('agent') || blockType.includes('ai')) {
      return 'agent';
    }

    // Check for start blocks
    if (blockType.includes('start')) {
      return 'start';
    }

    return 'start'; // default
  };

  const renderField = (field) => {
    const value = formData[field.key] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full h-20 bg-stone-900 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full h-10 bg-stone-900 rounded-md px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="w-full h-2 bg-stone-900 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-zinc-400 text-xs text-center">{value}%</div>
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full h-10 bg-stone-900 rounded-md px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full h-10 bg-stone-900 rounded-md px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      default:
        // Special handling for API Key field
        const placeholder = field.key === 'apiKey'
          ? 'Enter API key'
          : `Enter ${field.label.toLowerCase()}`;

        return (
          <input
            type={field.key === 'apiKey' ? 'password' : 'text'}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full h-10 bg-stone-900 rounded-md px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder={placeholder}
          />
        );
    }
  };

  const blockType = getBlockType(selectedBlock);
  const config = blockType ? configurationViews[blockType] : null;

  // Initialize sub-tab when block changes
  useEffect(() => {
    if (config?.tabs) {
      setActiveSubTab(config.tabs[0]);
    }
  }, [blockType, config]);

  // Load configuration when block changes
  useEffect(() => {
    if (selectedBlock && blockType === 'agent') {
      loadAgentConfiguration();
    }
  }, [selectedBlock?.id, blockType]);

  // Auto-save when form data changes
  useEffect(() => {
    if (selectedBlock && blockType === 'agent' && Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        saveAgentConfiguration();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, selectedBlock?.id, blockType]);

  return (
    <div className="w-96 h-full flex flex-col bg-stone-950 border-l border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-5">
        <h2 className="text-white text-base font-semibold mb-2">Configuration</h2>
        <p className="text-zinc-400 text-sm mb-6">
          {selectedBlock ? `Configure ${config?.title || 'Block'}` : 'Select a block to configure'}
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-stone-900 rounded-md p-1 mb-6">
          <div
            className={`flex-1 h-8 flex items-center justify-center rounded cursor-pointer transition-colors ${
              activeTab === 'Configure'
                ? 'bg-neutral-800 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
                : 'hover:bg-stone-800'
            }`}
            onClick={() => setActiveTab('Configure')}
          >
            <div className={`text-center text-sm font-medium font-lexend leading-tight ${
              activeTab === 'Configure' ? 'text-white' : 'text-zinc-400'
            }`}>
              Configure
            </div>
          </div>
          <div
            className={`flex-1 h-8 flex items-center justify-center rounded cursor-pointer transition-colors ${
              activeTab === 'Code'
                ? 'bg-neutral-800 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
                : 'hover:bg-stone-800'
            }`}
            onClick={() => setActiveTab('Code')}
          >
            <div className={`text-center text-sm font-medium font-lexend leading-tight ${
              activeTab === 'Code' ? 'text-white' : 'text-zinc-400'
            }`}>
              Code
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-y-auto">
        {!selectedBlock ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-zinc-500 text-sm">
              Click on a block in the canvas to configure it
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'Configure' ? (
              // Configuration Tab Content
              <>
                {/* Sub-tabs for complex configurations */}
                {config?.tabs && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {config.tabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveSubTab(tab)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          activeSubTab === tab
                            ? 'bg-violet-600 text-white'
                            : 'bg-stone-800 text-zinc-400 hover:bg-stone-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                {/* Form Fields */}
                {config && (
                  <div className="space-y-4">
                    {/* Regular fields or tabbed fields */}
                    {Array.isArray(config.fields) ? (
                      // Simple fields (like start and agent blocks)
                      config.fields.map(field => (
                        <div key={field.key} className="space-y-2">
                          <label className="block text-white text-sm font-medium">
                            {field.label}
                          </label>
                          {renderField(field)}
                        </div>
                      ))
                    ) : (
                      // Tabbed fields (like output blocks)
                      config.fields && config.fields[activeSubTab]?.map(field => (
                        <div key={field.key} className="space-y-2">
                          <label className="block text-white text-sm font-medium">
                            {field.label}
                          </label>
                          {renderField(field)}
                        </div>
                      ))
                    )}

                    {/* Additional Fields for Start Block */}
                    {blockType === 'start' && (
                      <div className="space-y-4">
                        {additionalFields.map((field, index) => (
                          <div key={field.key} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => updateAdditionalField(index, { label: e.target.value })}
                                className="flex-1 h-8 bg-stone-900 rounded-md px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                                placeholder="Field name"
                              />
                              <button
                                onClick={() => removeField(index)}
                                className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-md flex items-center justify-center text-white text-xs"
                              >
                                ×
                              </button>
                            </div>
                            {renderField({
                              ...field,
                              key: `additional_${index}`,
                              type: field.type || 'text'
                            })}
                          </div>
                        ))}

                        <button
                          onClick={addField}
                          className="w-full h-10 bg-stone-800 hover:bg-stone-700 rounded-md text-zinc-400 text-sm font-medium transition-colors border border-dashed border-zinc-600"
                        >
                          + Add More
                        </button>
                      </div>
                    )}

                    {/* Submit Button for Agent Block */}
                    {blockType === 'agent' && (
                      <div className="mt-6 pt-4 border-t border-zinc-800">
                        <button
                          onClick={handleSubmitAgent}
                          disabled={isSubmitting}
                          className="w-full h-12 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed rounded-md text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting Agent...
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0V1.5H14.5V8H16V1.5C16 0.675 15.325 0 14.5 0H8ZM0 14.5V8H1.5V14.5H8V16H1.5C0.675 16 0 15.325 0 14.5ZM12 4L8 8L12 12V9H16V7H12V4Z" fill="white"/>
                              </svg>
                              Submit Agent Configuration
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Code Tab Content
              <div className="space-y-4">
                {blockType === 'agent' && config?.generateJSON ? (
                  <div className="bg-stone-900 rounded-lg p-4 border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-medium">Node Configuration JSON</h3>
                      <button
                        onClick={() => {
                          const json = JSON.stringify(config.generateJSON(formData, selectedBlock?.id), null, 2);
                          navigator.clipboard.writeText(json);
                        }}
                        className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs rounded-md transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="text-zinc-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(config.generateJSON(formData, selectedBlock?.id), null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center text-zinc-500 text-sm">
                    {blockType === 'agent' ? 'Configure the agent first to see the JSON code' : 'Code view not available for this block type'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}