/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {AgentManager} from './AgentManager';
import {Agent} from '../app';

interface GovernanceAdminProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

export const GovernanceAdmin: React.FC<GovernanceAdminProps> = ({agents, setAgents}) => {
  const themeColor = '#0d9488';
  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: themeColor }}>Governance Control Panel</h2>
        <p style={{ margin: '0.75rem 0 0', color: '#4b5563', fontSize: '1.1rem' }}>Review and monitor agent policies and compliance.</p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdfa', borderLeft: `4px solid ${themeColor}`, borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: '#374151' }}>
          <strong>Governance Authority:</strong> Global safety and compliance custodian. 
          <span style={{ marginLeft: '1rem', color: '#991b1b', fontWeight: 600 }}>NO ACCESS:</span> Bundle creation, channel management, storefront config, or app approval.
        </div>
      </header>
      <AgentManager agents={agents} setAgents={setAgents} canEdit={false} />
    </div>
  );
};
