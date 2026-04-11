/**
 * @jsx createElement
 * @jsxFrag Fragment
 * Verified GitHub Automation Sync
 */
import {createElement, Fragment, useState} from 'react';
import * as React from 'react';
import {GovernanceAdmin} from './views/GovernanceAdmin';
import {ProductOwner} from './views/ProductOwner';
import {CSuiteExecutive} from './views/CSuiteExecutive';
import {AdminState} from './views/AdminState';
import {EndConsumer} from './views/EndConsumer';
import {StorefrontManager} from './views/StorefrontManager';
import {Dashboard} from './views/Dashboard';
import {AgentManager} from './views/AgentManager';
import {ToolManager, Tool} from './views/ToolManager';
import {ConsumerAppManager} from './views/ConsumerAppManager';
import {AgentProfileManager, ToolProfileManager, AgentProfile, ToolProfile} from './views/ProfileManager';
import {ProductManager, Product} from './views/ProductManager';
import {ChannelManager, Channel} from './views/ChannelManager';
import {TestBench} from './views/TestBench';
import {GuidedExperienceOverlay, TutorialStep, getAirportOpsTutorial, getProductsAndChannelsTutorial, getPublishAndConsumeTutorial} from './views/GuidedExperience';
import {Modal} from './components/Modal';

import {setAnchorHref} from 'safevalues/dom';
import {objectUrlFromSafeSource, unwrapUrl} from 'safevalues';

export interface ConsumerApp {
  id: string;
  productIds: string[];
  name: string;
  description: string;
  submitterName: string;
  submitterEmail: string;
  status: 'Pending' | 'Approved' | 'Denied';
  createdDate: string;
  semanticPolicy?: string;
}

export type {Tool, AgentProfile, ToolProfile, Product, Channel};

export interface StorefrontConfig {
  channelUrl: string;
  hiddenProductIds: string[];
  portalName: string;
}

export type Persona = 
  | 'Governance Administrator' 
  | 'Product Owner' 
  | 'C-Suite Executive' 
  | 'Storefront Manager'
  | 'End Consumer'
  | 'Distribution'
  | 'Governance'
  | 'Admin';

export interface Agent {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  instructions: string;
  status: 'Draft' | 'Active' | 'Deprecated';
}

export interface AdminData {
  agents: Agent[];
  tools: Tool[];
  agentProfiles: AgentProfile[];
  toolProfiles: ToolProfile[];
  products: Product[];
  channels: Channel[];
  storefrontConfig: StorefrontConfig;
  consumerApps: ConsumerApp[];
}

export interface GuidedExperienceState {
  isActive: boolean;
  currentStep: number;
  type?: 'ops' | 'products' | 'publish';
  backupState: AdminData | null;
}

export interface PersonaViewState {
  activeTab: 'Dashboard' | 'Agents' | 'Tools' | 'Distribution' | 'Governance';
  distributionSubTab: 'Home' | 'Product' | 'Channels' | 'Consumer App Approval';
  governanceSubTab: 'Agent' | 'Tool';
}

export type PersonaViewStates = Record<string, PersonaViewState>;

const DEFAULT_VIEW_STATE: PersonaViewState = { 
  activeTab: 'Dashboard', 
  distributionSubTab: 'Home', 
  governanceSubTab: 'Agent' 
};

const INITIAL_CONSUMER_APPS: ConsumerApp[] = [
  {
    id: 'ca1',
    name: 'Cymbal SkyLink Premium',
    description: 'A dedicated mobile application for premium frequent flyers to manage travel documents and baggage status via autonomous agents.',
    productIds: ['pr4'],
    status: 'Approved',
    submitterName: 'John Doe',
    submitterEmail: 'john.doe@cymbal.com',
    createdDate: '2026-03-15'
  },
  {
    id: 'ca2',
    name: 'EuroTravel Logistics Hub',
    description: 'Enterprise dashboard for corporate travel managers to optimize European flight schedules and crew re-accommodation during delays.',
    productIds: ['pr1', 'pr5'],
    status: 'Pending',
    submitterName: 'John Doe',
    submitterEmail: 'john.doe@cymbal.com',
    createdDate: '2026-03-16',
    semanticPolicy: "Only allow flight lookups and baggage tracking for routes originating in or destined for European airports."
  }
];

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Customer Support Assistant',
    description: 'General customer support and query resolution.',
    instructions: 'Always be helpful and polite. Use customer lookup to personalize responses. [GENERIC_SUPPORT_GUIDELINES]',
    createdDate: '2026-03-01',
    modifiedDate: '2026-03-01',
    status: 'Active'
  },
  {
    id: 'a2',
    name: 'Flight Reservation Agent',
    description: 'Specialized agent for flight reservations and upgrades.',
    instructions: 'Focus on efficient booking flows. Cross-sell premium seating when available.',
    createdDate: '2026-03-05',
    modifiedDate: '2026-03-05',
    status: 'Active'
  },
  {
    id: 'a3',
    name: 'Premium Concierge Assistant',
    description: 'Personalized high-touch assistant for First Class passengers.',
    instructions: 'Use a sophisticated tone. Provide local lounge and transfer information proactively.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    status: 'Active'
  },
  {
    id: 'a4',
    name: 'Ground Operations Safety Agent',
    description: 'Quality assurance and safety reporting assistant.',
    instructions: 'Focus on precision and regulatory compliance. Flag any anomalies immediately.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    status: 'Draft'
  }
];

const INITIAL_TOOLS: Tool[] = [
  {
    id: 't1',
    name: 'Customer Profile Database Lookup',
    description: 'Access detailed customer profiles and historical data.',
    endpoint: 'https://api.cymbal.com/v1/customer/lookup',
    createdDate: '2026-03-01',
    modifiedDate: '2026-03-01',
    status: 'Active'
  },
  {
    id: 't2',
    name: 'Global Flight Availability Search',
    description: 'Search for available flights across airline partners.',
    endpoint: 'https://api.cymbal.com/v1/flights/search',
    createdDate: '2026-03-01',
    modifiedDate: '2026-03-01',
    status: 'Active'
  },
  {
    id: 't3',
    name: 'Real-time Seat Assignment Map',
    description: 'Retrieve real-time seat availability for specific aircraft.',
    endpoint: 'https://api.cymbal.com/v1/flights/seats',
    createdDate: '2026-03-10',
    modifiedDate: '2026-03-10',
    status: 'Active'
  },
  {
    id: 't4',
    name: 'Global Baggage Tracking System',
    description: 'Real-time luggage location and status tracking.',
    endpoint: 'https://api.cymbal.com/v1/ops/baggage',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    status: 'Deprecated'
  },
  {
    id: 't5',
    name: 'NA Regional Data Access',
    description: 'Secure access to North American customer records.',
    endpoint: 'https://api.cymbal.com/v1/na/customer',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    status: 'Active'
  },
  {
    id: 't6',
    name: 'EU Regional Data Access',
    description: 'GDPR-compliant access to European customer records.',
    endpoint: 'https://api.cymbal.com/v1/eu/customer',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    status: 'Active'
  },
  {
    id: 't7',
    name: 'APAC Regional Data Access',
    description: 'Access to Asia-Pacific customer and flight data.',
    endpoint: 'https://api.cymbal.com/v1/apac/customer',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    status: 'Active'
  }
];

const INITIAL_AGENT_PROFILES: AgentProfile[] = [
  {
    id: 'p1',
    name: 'Standard International Support Profile',
    description: 'Standard professional tone for international markets.',
    createdDate: '2026-03-01',
    modifiedDate: '2026-03-01',
    globalSemanticPolicy: '[FORMAL_TONE] [APPEND_SLOGAN] Use formal language. Always include the Cymbal Airlines slogan in sign-off.',
    toolSemanticPolicies: {},
    status: 'Active'
  },
  {
    id: 'p2',
    name: 'European GDPR Compliance Profile',
    description: 'Strict privacy controls for the European region.',
    createdDate: '2026-03-12',
    modifiedDate: '2026-03-12',
    globalSemanticPolicy: '[ENFORCE_GDPR] Strict adherence to GDPR. Do not store PII beyond session duration.',
    toolSemanticPolicies: {
      't1': 'Anonymize customer ID before lookup unless explicit consent granted.'
    },
    status: 'Active'
  },
  {
    id: 'p3',
    name: 'High-Value Premium Concierge Profile',
    description: 'Personalized high-touch service for elite passengers.',
    createdDate: '2026-03-12',
    modifiedDate: '2026-03-12',
    globalSemanticPolicy: '[CASUAL_TONE] Maintain personal and friendly connection. Prioritize comfort.',
    toolSemanticPolicies: {},
    status: 'Active'
  },
  {
    id: 'p4',
    name: 'Safety & Quality QA Profile',
    description: 'Internal audit and safety reporting standards.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    globalSemanticPolicy: '[INJECT_SAFETY] [STRICT_JSON_OUTPUT] Ensure all responses meet safety reporting standards.',
    toolSemanticPolicies: {},
    status: 'Active'
  },
  {
    id: 'p5',
    name: 'NA Security & Privacy Standard',
    description: 'Standard security controls for North America.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    globalSemanticPolicy: '[FORMAL_TONE] Ensure all data handling meets US/Canada standards.',
    toolSemanticPolicies: {},
    status: 'Active'
  },
  {
    id: 'p6',
    name: 'EU Unified GDPR Profile',
    description: 'High-strictness GDPR enforcement for EU support.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    globalSemanticPolicy: '[ENFORCE_GDPR] [APPEND_SLOGAN] Complete PII redaction mandatory.',
    toolSemanticPolicies: {},
    status: 'Active'
  },
  {
    id: 'p7',
    name: 'APAC Multi-region Compliance Profile',
    description: 'Cross-border data compliance for APAC operations.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    globalSemanticPolicy: '[INJECT_SAFETY] [STRICT_JSON_OUTPUT] Focus on safe cross-border data transfer.',
    toolSemanticPolicies: {},
    status: 'Active'
  }
];

const INITIAL_TOOL_PROFILES: ToolProfile[] = [
  {
    id: 'tp1',
    name: 'Restricted Data Visibility Tool Profile',
    description: 'Safe access for general support queries.',
    createdDate: '2026-03-12',
    modifiedDate: '2026-03-12',
    semanticPolicy: 'Method must be GET. Mutations are strictly prohibited.',
    status: 'Active'
  },
  {
    id: 'tp2',
    name: 'Elevated Modification Permission Tool Profile',
    description: 'Elevated access for booking and modifications.',
    createdDate: '2026-03-12',
    modifiedDate: '2026-03-12',
    semanticPolicy: 'Requires multi-factor token. All write operations must be logged.',
    status: 'Active'
  },
  {
    id: 'tp3',
    name: 'Geo-Fenced Data Access Tool Profile',
    description: 'Restricted access to geo-specific data centers.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    semanticPolicy: 'Only allows access to regional data shards based on user geo-header.',
    status: 'Active'
  },
  {
    id: 'tp4',
    name: 'Regional Read-Only Access',
    description: 'Restricted view-only access for regional agents.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    semanticPolicy: 'Read-only access enabled. No write permissions allowed.',
    status: 'Active'
  },
  {
    id: 'tp5',
    name: 'High-Audit Data Access',
    description: 'Full access with continuous auditing and logging.',
    createdDate: '2026-03-13',
    modifiedDate: '2026-03-13',
    semanticPolicy: 'Every request is logged and compared against regional security policies.',
    status: 'Active'
  }
];

interface ControlPanelProps {
  persona: Persona;
  handlePersonaChange: (p: Persona) => void;
  isGuidedExperienceActive: boolean;
  startGuidedExperience: (type: 'ops' | 'products' | 'publish') => void;
  handleExport: () => void;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const SimulatorControlPanel: React.FC<ControlPanelProps> = ({
  persona,
  handlePersonaChange,
  isGuidedExperienceActive,
  startGuidedExperience,
  handleExport,
  handleImport,
  fileInputRef
}) => {
  const [showLearningModal, setShowLearningModal] = useState(false);

  return (
    <div style={{ background: '#1e293b', color: '#f8fafc', padding: '0.75rem 2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.05em' }}>SIMULATOR CONTROL PANEL</h3>
        </div>
        {!isGuidedExperienceActive && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowLearningModal(true)} style={{ padding: '0.4rem 0.8rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Learning Scenarios
            </button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleExport} style={{ padding: '0.4rem 0.8rem', background: 'transparent', color: '#f8fafc', border: '1px solid #475569', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>Export Simulator State</button>
          <button onClick={() => fileInputRef.current?.click()} style={{ padding: '0.4rem 0.8rem', background: 'transparent', color: '#f8fafc', border: '1px solid #475569', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>Import Simulator State</button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json,.txt" onChange={handleImport} />
        </div>
        {/*
        <div style={{ height: '20px', width: '1px', background: '#334155' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Persona View:</label>
          <select 
            value={persona} 
            onChange={e => handlePersonaChange(e.target.value as Persona)} 
            style={{ background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '4px', padding: '0.4rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {['Governance Administrator', 'Product Owner', 'C-Suite Executive', 'Storefront Manager', 'End Consumer'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        */}
      </div>
      <Modal 
        isOpen={showLearningModal} 
        onClose={() => setShowLearningModal(false)} 
        title="SIMULATOR LEARNING SCENARIOS"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        }
      >
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>Profile Governance Syncing</h4>
              <span style={{ fontSize: '0.75rem', background: '#38bdf820', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>Scenario 1</span>
            </div>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Master balancing localized Agent Profiles with Governance Policies semantic rules updates. Set up region sync loops securely.
            </p>
            <button onClick={() => { startGuidedExperience('ops'); setShowLearningModal(false); }} style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Launch Tutorial
            </button>
          </div>

          <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>Product Distribution Strategy</h4>
              <span style={{ fontSize: '0.75rem', background: '#10b98120', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>Scenario 2</span>
            </div>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Coordinate bundle publications across multiple global branches (SEA, JFK, DXB). Manage release targeting into Channels smoothly.
            </p>
            <button onClick={() => { startGuidedExperience('products'); setShowLearningModal(false); }} style={{ background: '#10b981', color: '#0f172a', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Launch Tutorial
            </button>
          </div>

          <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>Publishing & Consumption</h4>
              <span style={{ fontSize: '0.75rem', background: '#f59e0b20', color: '#f59e0b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>Scenario 3</span>
            </div>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Complete the lifecycle: publish a channel, subscribe via storefront, manage visibility, and submit/approve consumer apps.
            </p>
            <button onClick={() => { startGuidedExperience('publish'); setShowLearningModal(false); }} style={{ background: '#f59e0b', color: '#0f172a', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Launch Tutorial
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
};

const App = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [persona, setPersona] = React.useState<Persona>(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('persona');
    if (p && [
      'Governance Administrator', 
      'Product Owner', 
      'C-Suite Executive', 
      'Storefront Manager', 
      'End Consumer', 
      'Admin'
    ].includes(p)) {
      return p as Persona;
    }
    return 'Product Owner';
  });

  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [agentProfiles, setAgentProfiles] = React.useState<AgentProfile[]>([]);
  const [toolProfiles, setToolProfiles] = React.useState<ToolProfile[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);

  const [channels, setChannels] = React.useState<Channel[]>([]);

  const [storefrontConfig, setStorefrontConfig] = React.useState<StorefrontConfig>({
    channelUrl: 'https://api.cymbal.com/v1/channels/na-direct',
    hiddenProductIds: [],
    portalName: 'Cymbal Airlines Agentic Portal'
  });

  const [consumerApps, setConsumerApps] = React.useState<ConsumerApp[]>([]);

  const [isGuidedExperienceEnabled, setIsGuidedExperienceEnabled] = React.useState(true);
  const [guidedExpState, setGuidedExpState] = React.useState<GuidedExperienceState>({
    isActive: false,
    currentStep: 0,
    backupState: null
  });

  const [activeTab, setActiveTab] = React.useState<'Dashboard' | 'Agents' | 'Tools' | 'Distribution' | 'Governance'>('Dashboard');
  const [distributionSubTab, setDistributionSubTab] = React.useState<'Home' | 'Product' | 'Channels' | 'Consumer App Approval'>('Home');
  const [governanceSubTab, setGovernanceSubTab] = React.useState<'Agent' | 'Tool'>('Agent');

  const [personaViewStates, setPersonaViewStates] = React.useState<PersonaViewStates>({
    'Governance Administrator': { ...DEFAULT_VIEW_STATE },
    'Product Owner': { ...DEFAULT_VIEW_STATE },
    'C-Suite Executive': { ...DEFAULT_VIEW_STATE },
    'Storefront Manager': { ...DEFAULT_VIEW_STATE },
    'End Consumer': { ...DEFAULT_VIEW_STATE },
    'Admin': { ...DEFAULT_VIEW_STATE },
  });

  const handlePersonaChange = (newPersona: Persona) => {
    // Save current state for old persona
    setPersonaViewStates(prev => ({
      ...prev,
      [persona]: { activeTab, distributionSubTab, governanceSubTab }
    }));

    // Switch to new persona
    setPersona(newPersona);

    // Restore state for new persona
    const newState = personaViewStates[newPersona] || DEFAULT_VIEW_STATE;
    setActiveTab(newState.activeTab);
    setDistributionSubTab(newState.distributionSubTab);
    setGovernanceSubTab(newState.governanceSubTab);
  };

  const isSaaSPersona = ['Governance Administrator', 'Product Owner', 'C-Suite Executive'].includes(persona);

  const handleExport = () => {
    const dataStr = JSON.stringify({
      agents, tools, agentProfiles, toolProfiles, products, channels, storefrontConfig, consumerApps
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
  const validateImportedState = (data: any): boolean => {
    if (!data || typeof data !== 'object') return false;
    const isArrayType = (arr: any, fields: string[]) => 
      !arr || (Array.isArray(arr) && arr.every((item: any) => fields.every(f => f in item)));

    return (
      isArrayType(data.agents, ['id', 'name']) &&
      isArrayType(data.tools, ['id', 'name']) &&
      isArrayType(data.agentProfiles, ['id', 'name']) &&
      isArrayType(data.products, ['id', 'name'])
    );
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (!validateImportedState(importedData)) {
          alert('Invalid simulator state file format.');
          return;
        }
        const data = importedData as any;
        if (data.agents) setAgents(data.agents);
        if (data.tools) setTools(data.tools);
        if (data.agentProfiles) setAgentProfiles(data.agentProfiles);
        if (data.toolProfiles) setToolProfiles(data.toolProfiles);
        if (data.products) setProducts(data.products);
        if (data.channels) setChannels(data.channels);
        if (data.storefrontConfig) setStorefrontConfig(data.storefrontConfig);
        if (data.consumerApps) setConsumerApps(data.consumerApps);
        alert('Simulator state imported successfully!');
      } catch (err) {
        alert('Error parsing state file.');
      }
    };
    reader.readAsText(file);
  };

  const startGuidedExperience = (type: 'ops' | 'products' | 'publish' = 'ops') => {
    // Backup current state
    const backup: AdminData = {
      agents,
      tools,
      agentProfiles,
      toolProfiles,
      products,
      channels,
      storefrontConfig,
      consumerApps
    };

    setGuidedExpState({
      isActive: true,
      currentStep: 0,
      type: type,
      backupState: backup
    });

    if (type === 'ops') {
      handlePersonaChange('Product Owner');
      setAgents([
        {
          id: 'tut-a1',
          name: 'Airport Operations Agent',
          description: 'Quality assurance and safety reporting assistant for airport grounds.',
          instructions: 'Focus on precision and regulatory compliance. Flag any anomalies immediately.',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        }
      ]);
      setTools([
        {
          id: 'tut-t1',
          name: 'Runway Status API',
          description: 'Real-time runway occupancy and safety status.',
          endpoint: 'https://api.cymbal.com/v1/ops/runway',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        },
        {
          id: 'tut-t2',
          name: 'Gate Management System',
          description: 'Real-time aircraft-to-gate assignment tracking.',
          endpoint: 'https://api.cymbal.com/v1/ops/gates',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        }
      ]);
      setAgentProfiles([]);
      setToolProfiles([]);
      setProducts([]);
      setChannels([]);
      setConsumerApps([]);
      setActiveTab('Agents');
    } else if (type === 'products') {
      handlePersonaChange('Product Owner');
      setAgents([
        {
          id: 'tut-a1',
          name: 'Airport Operations Agent',
          description: 'Quality assurance and safety reporting assistant for airport grounds.',
          instructions: 'Focus on precision and regulatory compliance. Flag any anomalies immediately.',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        },
        {
          id: 'tut-a2',
          name: 'Pilot Scheduling Agent',
          description: 'Optimizes pilot rotations, rest periods, and flight assignments.',
          instructions: 'Ensure full adherence to flight time limitations and rest mandates.',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        }
      ]);
      setTools([]);
      setAgentProfiles([]);
      setToolProfiles([]);
      setProducts([]);
      setChannels([]);
      setConsumerApps([]);
      setActiveTab('Agents');
    } else if (type === 'publish') {
      handlePersonaChange('Product Owner');
      setAgents([]);
      setTools([]);
      setAgentProfiles([]);
      setToolProfiles([]);
      setProducts([
        {
          id: 'tut-p1',
          name: 'North America Customer Support Package',
          description: 'Standard support package for NA.',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          agents: [],
          tools: [],
          gtmCharacteristics: 'High volume, English speaking',
          technicalSpec: 'Requires connection to CRM',
          useCases: 'Tier 1 support'
        },
        {
          id: 'tut-p2',
          name: 'European Union Customer Support Package',
          description: 'Support package for EU.',
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          agents: [],
          tools: [],
          gtmCharacteristics: 'Multi-lingual, GDPR compliant',
          technicalSpec: 'Data residency in EU',
          useCases: 'Tier 1 and 2 support'
        }
      ]);
      setChannels([
        {
          id: 'tut-ch-pub',
          name: 'Cymbal Partner Rewards Network',
          description: 'Channel for distributing Cymbal Airlines partner rewards and offers to storefronts.',
          status: 'Draft',
          products: ['tut-p1', 'tut-p2'],
          createdDate: new Date().toISOString().split('T')[0],
          modifiedDate: new Date().toISOString().split('T')[0],
          gtmInfo: 'Tutorial GTM info'
        }
      ]);
      setStorefrontConfig({
        channelUrl: '',
        hiddenProductIds: [],
        portalName: 'Cymbal Airlines Agentic Portal'
      });
      setConsumerApps([]);
      setActiveTab('Distribution');
      setDistributionSubTab('Home');
    }
  };

  const endGuidedExperience = () => {
    if (guidedExpState.backupState) {
      const b = guidedExpState.backupState;
      setAgents(b.agents);
      setTools(b.tools);
      setAgentProfiles(b.agentProfiles);
      setToolProfiles(b.toolProfiles);
      setProducts(b.products);
      setChannels(b.channels);
      setStorefrontConfig(b.storefrontConfig);
      setConsumerApps(b.consumerApps);
    }
    setGuidedExpState({
      isActive: false,
      currentStep: 0,
      backupState: null
    });
    setActiveTab('Dashboard');
  };

  const airportOpsTutorial = getAirportOpsTutorial(setAgents, setAgentProfiles, setActiveTab, setGovernanceSubTab);
  const productsAndChannelsTutorial = getProductsAndChannelsTutorial(setAgentProfiles, setActiveTab, setGovernanceSubTab, setDistributionSubTab);
  const publishAndConsumeTutorial = getPublishAndConsumeTutorial(handlePersonaChange, setActiveTab, setDistributionSubTab, setStorefrontConfig, setChannels, setConsumerApps, products, channels);

  const nextTutorialStep = () => {
    const currentTutorial = guidedExpState.type === 'products' ? productsAndChannelsTutorial 
                             : guidedExpState.type === 'publish' ? publishAndConsumeTutorial 
                             : airportOpsTutorial;
    
    // Execute onNext for the current step if it exists
    const step = currentTutorial[guidedExpState.currentStep];
    if (step && step.onNext) {
        step.onNext();
    }

    if (guidedExpState.currentStep === currentTutorial.length - 1) {
      endGuidedExperience();
      return;
    }
    setGuidedExpState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevTutorialStep = () => {
    setGuidedExpState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  };


  const updateConsumerAppStatus = (id: string, status: 'Pending' | 'Approved' | 'Denied') => {
    setConsumerApps(apps => apps.map(a => a.id === id ? { ...a, status } : a));
  };

  const renderView = () => {
    if (isSaaSPersona && activeTab === 'Dashboard') {
      return (
        <Dashboard 
          persona={persona} 
          agents={agents} 
          isGuidedExperienceEnabled={isGuidedExperienceEnabled}
          isGuidedExperienceActive={guidedExpState.isActive}
          startGuidedExperience={startGuidedExperience}
        />
      );
    }

    if (isSaaSPersona && activeTab === 'Agents') {
      return (
        <AgentManager 
          agents={agents} 
          setAgents={setAgents} 
          canEdit={persona === 'Governance Administrator' || persona === 'Product Owner'} 
        />
      );
    }

    if (isSaaSPersona && activeTab === 'Tools') {
      return <ToolManager tools={tools} setTools={setTools} canEdit={persona === 'Governance Administrator' || persona === 'Product Owner'} />;
    }

    if (isSaaSPersona && activeTab === 'Governance') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #dadce0', marginBottom: '0.5rem' }}>
            <button 
              onClick={() => setGovernanceSubTab('Agent')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: governanceSubTab === 'Agent' ? '2px solid #1a73e8' : '2px solid transparent',
                color: governanceSubTab === 'Agent' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >Agent Profiles</button>
            <button 
              onClick={() => setGovernanceSubTab('Tool')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: governanceSubTab === 'Tool' ? '2px solid #1a73e8' : '2px solid transparent',
                color: governanceSubTab === 'Tool' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >Tool Profiles</button>
          </div>
          {governanceSubTab === 'Agent' && (
            <AgentProfileManager 
              profiles={agentProfiles} 
              setProfiles={setAgentProfiles} 
              tools={tools} 
              canEdit={persona === 'Governance Administrator' || persona === 'Product Owner'} 
            />
          )}
          {governanceSubTab === 'Tool' && (
            <ToolProfileManager profiles={toolProfiles} setProfiles={setToolProfiles} canEdit={persona === 'Governance Administrator' || persona === 'Product Owner'} />
          )}
        </div>
      );
    }

    if (isSaaSPersona && activeTab === 'Distribution') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #dadce0', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setDistributionSubTab('Home')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: distributionSubTab === 'Home' ? '2px solid #1a73e8' : '2px solid transparent',
                color: distributionSubTab === 'Home' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >Home</button>
            <button 
              onClick={() => setDistributionSubTab('Product')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: distributionSubTab === 'Product' ? '2px solid #1a73e8' : '2px solid transparent',
                color: distributionSubTab === 'Product' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >Products</button>
            <button 
              onClick={() => setDistributionSubTab('Channels')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: distributionSubTab === 'Channels' ? '2px solid #1a73e8' : '2px solid transparent',
                color: distributionSubTab === 'Channels' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >Channels</button>
            <button 
              onClick={() => setDistributionSubTab('Consumer App Approval')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: distributionSubTab === 'Consumer App Approval' ? '2px solid #1a73e8' : '2px solid transparent',
                color: distributionSubTab === 'Consumer App Approval' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >Consumer App Approval</button>

          </div>
          {distributionSubTab === 'Home' && (
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.9rem', color: '#5f6368', marginBottom: '0.5rem' }}>Agent Profiles</div>
                <div style={{ fontSize: '2rem', fontWeight: 400, color: '#1a73e8' }}>{agentProfiles.length}</div>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.9rem', color: '#5f6368', marginBottom: '0.5rem' }}>Tool Profiles</div>
                <div style={{ fontSize: '2rem', fontWeight: 400, color: '#1a73e8' }}>{toolProfiles.length}</div>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.9rem', color: '#5f6368', marginBottom: '0.5rem' }}>Total Products</div>
                <div style={{ fontSize: '2rem', fontWeight: 400, color: '#1a73e8' }}>{products.length}</div>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.9rem', color: '#5f6368', marginBottom: '0.5rem' }}>Total Managed Assets</div>
                <div style={{ fontSize: '2rem', fontWeight: 400, color: '#1a73e8' }}>{agentProfiles.length + toolProfiles.length + products.length}</div>
              </div>
            </div>
          )}
          {distributionSubTab === 'Product' && (
            <ProductManager 
              products={products} setProducts={setProducts} 
              agents={agents} agentProfiles={agentProfiles}
              tools={tools} toolProfiles={toolProfiles}
              canEdit={persona === 'Product Owner'} 
            />
          )}
          {distributionSubTab === 'Channels' && (
            <ChannelManager 
              channels={channels} setChannels={setChannels}
              products={products}
              canEdit={persona === 'Product Owner'}
            />
          )}
          {distributionSubTab === 'Consumer App Approval' && (
            <ConsumerAppManager 
              consumerApps={consumerApps}
              products={products}
              onUpdateStatus={updateConsumerAppStatus}
            />
          )}

        </div>
      );
    }

    switch (persona) {
      case 'Governance Administrator':
        return <GovernanceAdmin agents={agents} setAgents={setAgents} />;
      case 'Product Owner':
        return (
          <ProductOwner 
            agents={agents} 
            setAgents={setAgents} 
            isGuidedExperienceEnabled={isGuidedExperienceEnabled}
            isGuidedExperienceActive={guidedExpState.isActive}
            startGuidedExperience={startGuidedExperience}
          />
        );
      case 'C-Suite Executive':
        return <CSuiteExecutive agents={agents} setAgents={setAgents} />;
      case 'Storefront Manager':
        return <StorefrontManager 
          config={storefrontConfig} 
          setConfig={setStorefrontConfig} 
          channels={channels}
          products={products}
        />;
      case 'End Consumer':
        return <EndConsumer 
          config={storefrontConfig}
          channels={channels}
          products={products}
          consumerApps={consumerApps}
          setConsumerApps={setConsumerApps}
          isGuidedExperienceActive={guidedExpState.isActive}
        />;
      case 'Admin':
        return <AdminState 
          agents={agents} setAgents={setAgents} 
          tools={tools} setTools={setTools} 
          agentProfiles={agentProfiles} setAgentProfiles={setAgentProfiles} 
          toolProfiles={toolProfiles} setToolProfiles={setToolProfiles}
          products={products} setProducts={setProducts}
          channels={channels} setChannels={setChannels}
          storefrontConfig={storefrontConfig}
          setStorefrontConfig={setStorefrontConfig}
          consumerApps={consumerApps}
          setConsumerApps={setConsumerApps}
          isGuidedExperienceEnabled={isGuidedExperienceEnabled}
          setIsGuidedExperienceEnabled={setIsGuidedExperienceEnabled}
        />;
      default:
        return <div>Select a persona</div>;
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f9fa', width: '100vw', overflow: 'hidden', fontFamily: "'Google Sans', Roboto, Arial, sans-serif" }}>
      {isGuidedExperienceEnabled && (
        <SimulatorControlPanel 
          persona={persona}
          handlePersonaChange={handlePersonaChange}
          isGuidedExperienceActive={guidedExpState.isActive}
          startGuidedExperience={startGuidedExperience}
          handleExport={handleExport}
          handleImport={handleImport}
          fileInputRef={fileInputRef}
        />
      )}
      <header style={{ 
        padding: '0.75rem 2rem', 
        background: '#ffffff', 
        color: '#202124', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#1a73e8', border: '1px solid #1a73e8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>v0.0.16demo</span>
          <a href="http://go/apm-simulator-demo" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#1a73e8', textDecoration: 'none', border: '1px solid #1a73e8', padding: '2px 6px', borderRadius: '4px' }}>go/apm-simulator-demo</a>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Persona select moved to Control Panel */}
        </div>
      </header>

      {isSaaSPersona && (
        <div style={{ 
          padding: '0.4rem 2rem', 
          background: '#3c4043', 
          color: '#fff', 
          fontSize: '0.8rem', 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 400,
          letterSpacing: '0.5px',
          boxShadow: '0 1px 2px 0 rgba(60,64,67,.3)'
        }}>
          &nbsp;
        </div>
      )}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {isSaaSPersona && (
          <aside style={{ 
            width: '240px', 
            background: '#ffffff', 
            borderRight: '1px solid #dadce0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <nav style={{ padding: '1rem 0' }}>
              <div 
                onClick={() => setActiveTab('Dashboard')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: activeTab === 'Dashboard' ? '#e8f0fe' : 'transparent', 
                  color: activeTab === 'Dashboard' ? '#1a73e8' : '#5f6368',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: activeTab === 'Dashboard' ? '4px solid #1a73e8' : '4px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '0.5rem'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </div>

              <div style={{ padding: '1rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 400, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Assets
              </div>
              <div 
                onClick={() => setActiveTab('Agents')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: activeTab === 'Agents' ? '#e8f0fe' : 'transparent', 
                  color: activeTab === 'Agents' ? '#1a73e8' : '#5f6368',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: activeTab === 'Agents' ? '4px solid #1a73e8' : '4px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Agents
              </div>
              <div 
                onClick={() => setActiveTab('Tools')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: activeTab === 'Tools' ? '#e8f0fe' : 'transparent', 
                  color: activeTab === 'Tools' ? '#1a73e8' : '#5f6368',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: activeTab === 'Tools' ? '4px solid #1a73e8' : '4px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Tools
              </div>

              <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 400, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Portfolio Management
              </div>
              <div 
                onClick={() => setActiveTab('Governance')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: activeTab === 'Governance' ? '#e8f0fe' : 'transparent', 
                  color: activeTab === 'Governance' ? '#1a73e8' : '#5f6368',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: activeTab === 'Governance' ? '4px solid #1a73e8' : '4px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '0.5rem'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Governance
              </div>
              <div 
                onClick={() => setActiveTab('Distribution')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: activeTab === 'Distribution' ? '#e8f0fe' : 'transparent', 
                  color: activeTab === 'Distribution' ? '#1a73e8' : '#5f6368',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: activeTab === 'Distribution' ? '4px solid #1a73e8' : '4px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                Distribution
              </div>
            </nav>
          </aside>
        )}
        
        <main style={{ 
          flex: 1, 
          padding: isSaaSPersona ? '2rem' : '0', 
          overflowY: 'auto',
          paddingBottom: guidedExpState.isActive ? '32vh' : (isSaaSPersona ? '2.5rem' : '0')
        }}>
          <div style={{ maxWidth: isSaaSPersona ? '1000px' : 'none', width: '100%', margin: isSaaSPersona ? '0 auto' : '0' }}>
            {renderView()}
          </div>
        </main>
      </div>

      {guidedExpState.isActive && (
        <GuidedExperienceOverlay 
          steps={guidedExpState.type === 'products' ? productsAndChannelsTutorial : guidedExpState.type === 'publish' ? publishAndConsumeTutorial : airportOpsTutorial} 
          currentStep={guidedExpState.currentStep} 
          onClose={endGuidedExperience} 
          onNext={nextTutorialStep} 
          onPrev={prevTutorialStep}
        />
      )}
    </div>
  );
};

export default App;
