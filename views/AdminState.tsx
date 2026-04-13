/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';

import {Agent, Channel, StorefrontConfig, ConsumerApp, Bundle} from '../app';
import {Tool} from './ToolManager';
import {AgentProfile, ToolProfile} from './ProfileManager';
import {setAnchorHref} from 'safevalues/dom';
import {objectUrlFromSafeSource, unwrapUrl} from 'safevalues';

interface AdminProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  agentProfiles: AgentProfile[];
  setAgentProfiles: React.Dispatch<React.SetStateAction<AgentProfile[]>>;
  toolProfiles: ToolProfile[];
  setToolProfiles: React.Dispatch<React.SetStateAction<ToolProfile[]>>;
  bundles: Bundle[];
  setBundles: React.Dispatch<React.SetStateAction<Bundle[]>>;
  channels: Channel[];
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  storefrontConfig: StorefrontConfig;
  setStorefrontConfig: React.Dispatch<React.SetStateAction<StorefrontConfig>>;
  consumerApps: ConsumerApp[];
  setConsumerApps: React.Dispatch<React.SetStateAction<ConsumerApp[]>>;
  isGuidedExperienceEnabled: boolean;
  setIsGuidedExperienceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminState: React.FC<AdminProps> = ({
  agents, setAgents, 
  tools, setTools, 
  agentProfiles, setAgentProfiles,
  toolProfiles, setToolProfiles,
  bundles, setBundles,
  channels, setChannels,
  storefrontConfig, setStorefrontConfig,
  consumerApps, setConsumerApps,
  isGuidedExperienceEnabled,
  setIsGuidedExperienceEnabled
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify({
      agents,
      tools,
      agentProfiles,
      toolProfiles,
      bundles,
      channels,
      storefrontConfig,
      consumerApps
    }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/octet-stream' });
    const safeUrl = objectUrlFromSafeSource(blob);
    const link = document.createElement('a');
    setAnchorHref(link, safeUrl);
    link.download = `simulator_state_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(unwrapUrl(safeUrl));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedData = JSON.parse(content) as any;
        
        if (importedData.agents && Array.isArray(importedData.agents)) {
          setAgents(importedData.agents);
        }
        if (importedData.tools && Array.isArray(importedData.tools)) {
          setTools(importedData.tools);
        }
        if (importedData.agentProfiles && Array.isArray(importedData.agentProfiles)) {
          setAgentProfiles(importedData.agentProfiles);
        }
        if (importedData.toolProfiles && Array.isArray(importedData.toolProfiles)) {
          setToolProfiles(importedData.toolProfiles);
        }
        if (importedData.bundles && Array.isArray(importedData.bundles)) {
          setBundles(importedData.bundles);
        } else if (importedData.products && Array.isArray(importedData.products)) {
          setBundles(importedData.products);
        }
        if (importedData.channels && Array.isArray(importedData.channels)) {
          setChannels(importedData.channels);
        }
        if (importedData.storefrontConfig) {
          setStorefrontConfig(importedData.storefrontConfig);
        }
        if (importedData.consumerApps && Array.isArray(importedData.consumerApps)) {
          setConsumerApps(importedData.consumerApps);
        }
        if (importedData.profiles && Array.isArray(importedData.profiles)) {
          // Backward compatibility for when it was just "profiles"
          setAgentProfiles(importedData.profiles);
        }
        
        if (Array.isArray(importedData)) {
          // Backward compatibility for old format (just agents)
          setAgents(importedData);
        }
        
        alert('Simulator state imported successfully!');
      } catch (err) {
        alert('Error parsing the file. Please ensure it is a valid JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  return (
    <div style={{}}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '1.5rem', color: '#ea4335' }}>Simulation Administrator Page</h2>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        borderTop: '4px solid #ea4335'
      }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#3c4043' }}>
          Simulation Master Control. Monitor real-time system state and manage simulation parameters.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              padding: '0.6rem 1.2rem', 
              background: '#ea4335', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >Import State</button>
          <button 
            onClick={handleExport}
            style={{ 
              padding: '0.6rem 1.2rem', 
              background: 'white', 
              color: '#ea4335', 
              border: '1px solid #dadce0', 
              borderRadius: '6px', 
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >Export State</button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".json,.txt"
            onChange={handleImport}
          />
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem',
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        borderTop: '4px solid #4285f4'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: '#4285f4' }}>Platform Features</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#3c4043' }}>Guided Experience Mode</div>
            <div style={{ fontSize: '0.9rem', color: '#5f6368' }}>Enable step-by-step tutorials and "bubble cloud" guidance across personas.</div>
          </div>
          <button 
            onClick={() => setIsGuidedExperienceEnabled(!isGuidedExperienceEnabled)}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              backgroundColor: isGuidedExperienceEnabled ? '#34a853' : '#dadce0',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.2s'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '11px',
              backgroundColor: 'white',
              position: 'absolute',
              top: '2px',
              left: isGuidedExperienceEnabled ? '26px' : '2px',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>
      </div>
    </div>
  );
};
