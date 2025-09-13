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
            nodeId: `get_${shortId}`,
            description: `Data retrieval for ${formData.description || 'agent'}`,
            url: `https://api.backend.com/data/${shortId}`,
            authToken: `tok_${shortId}`,
            parameters: [`p_${shortId}`],
            searchParams: { agentId: shortId }
          },
          {
            type: "Decision",
            workflowId: `wf_${shortId}`,
            nodeId: formData.nodeId || `agent_${shortId}`,
            systemPrompt: formData.systemPrompt || "You are an AI assistant.",
            description: formData.description || "Analyze data and provide insights.",
            model: `model_${shortId}`,
            apiKey: formData.apiKey || `key_${shortId}`,
            prompt: formData.prompt || "Analyze the provided data.",
            functionList: [`get_${shortId}`, `mem_${shortId}`]
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

export default function Configuration({ selectedBlock }) {
  const [activeTab, setActiveTab] = useState('Configure');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [formData, setFormData] = useState({});
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
    const blockType = block.type || block.title?.toLowerCase();
    if (blockType?.includes('start')) return 'start';
    if (blockType?.includes('agent') || blockType?.includes('ai')) return 'agent';
    if (blockType?.includes('output') || blockType?.includes('email') || blockType?.includes('report') || blockType?.includes('database') || blockType?.includes('ticket')) return 'output';
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
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full h-10 bg-stone-900 rounded-md px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
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

  return (
    <div className="w-96 h-full flex flex-col bg-stone-950 border-l border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-12">
        <div className="text-center text-white text-base font-semibold font-lexend leading-none mb-2">
          Configuration
        </div>
        <div className="text-center text-zinc-400 text-sm font-normal font-lexend leading-none mb-6">
          {selectedBlock ? `Configure ${config?.title || 'block'}` : 'Select a block to configure'}
        </div>

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