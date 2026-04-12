/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {AgentManager} from './AgentManager';
import {Agent} from '../app';

interface ProductOwnerProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  isGuidedExperienceEnabled: boolean;
  isGuidedExperienceActive: boolean;
  startGuidedExperience: (type?: 'ops' | 'products') => void;
}

export const ProductOwner: React.FC<ProductOwnerProps> = ({
  agents, 
  setAgents,
  isGuidedExperienceEnabled,
  isGuidedExperienceActive,
  startGuidedExperience
}) => {
  const themeColor = '#4338ca';
  return (
    <div>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: themeColor }}>IT Operations Workspace</h2>
          <p style={{ margin: '0.75rem 0 0', color: '#4b5563', fontSize: '1.1rem' }}>Manage and monitor AI agents and system integrations.</p>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#eef2ff', borderLeft: `4px solid ${themeColor}`, borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: '#374151' }}>
            <strong>System Configuration & Deployment Authority:</strong> Full control over agent deployments, tool integrations, and system policies. Ensure optimal system performance, low latency, and high availability for all deployed agents.
          </div>
        </div>
        {isGuidedExperienceEnabled && !isGuidedExperienceActive && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => startGuidedExperience('ops')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(26,115,232,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
              Start Profile Guided Experience
            </button>
            <button 
              onClick={() => startGuidedExperience('products')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(17,24,39,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Start Products Guided Experience
            </button>
          </div>
        )}
      </header>
      {/* 
        Note: AgentManager is rendered here, but if app.tsx handles it now, 
        we should be careful about double rendering. 
        Actually, app.tsx uses switch(persona) to return ONLY this component.
      */}
      <AgentManager agents={agents} setAgents={setAgents} canEdit={true} />
    </div>
  );
};
