/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {AgentManager} from './AgentManager';
import {Agent} from '../app';

interface CSuiteExecutiveProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

export const CSuiteExecutive: React.FC<CSuiteExecutiveProps> = ({agents, setAgents}) => {
  const themeColor = '#6b21a8';
  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: themeColor }}>Executive Dashboard</h2>
        <p style={{ margin: '0.75rem 0 0', color: '#4b5563', fontSize: '1.1rem' }}>Review and manage enterprise agent strategy.</p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#faf5ff', borderLeft: `4px solid ${themeColor}`, borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: '#374151' }}>
          <strong>Executive Oversight:</strong> Strategic alignment and ROI monitoring. 
          <span style={{ marginLeft: '1rem', color: '#991b1b', fontWeight: 600 }}>NO ACCESS:</span> Operational management (creating products/agents/tools), policy editing, or request approval.
        </div>
      </header>
      <AgentManager agents={agents} setAgents={setAgents} canEdit={true} />
    </div>
  );
};
