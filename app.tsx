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
import {GuidedExperienceOverlay, TutorialStep} from './views/GuidedExperience';

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
  type?: 'ops' | 'products';
  backupState: AdminData | null;
}

export interface PersonaViewState {
  activeTab: 'Dashboard' | 'Agents' | 'Tools' | 'Distribution' | 'Governance';
  distributionSubTab: 'Home' | 'Product' | 'Channels' | 'Consumer App Approval' | 'Test Bench';
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

const App = () => {
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

  const [agents, setAgents] = React.useState<Agent[]>(INITIAL_AGENTS);
  const [tools, setTools] = React.useState<Tool[]>(INITIAL_TOOLS);
  const [agentProfiles, setAgentProfiles] = React.useState<AgentProfile[]>(INITIAL_AGENT_PROFILES);
  const [toolProfiles, setToolProfiles] = React.useState<ToolProfile[]>(INITIAL_TOOL_PROFILES);
  const [products, setProducts] = React.useState<Product[]>([
    {
      id: 'pr1',
      name: 'European Regional Support Package',
      description: 'Localized support bundle for EU operations.',
      createdDate: '2026-03-13',
      modifiedDate: '2026-03-13',
      agents: [{agentId: 'a1', profileId: 'p2'}],
      tools: [{toolId: 't1', profileId: 'tp1'}, {toolId: 't2', profileId: 'tp1'}],
      gtmCharacteristics: 'Targeting high-growth EMEA markets with strict compliance focus.',
      technicalSpec: '',
      useCases: '',
      status: 'Active'
    },
    {
      id: 'pr2',
      name: 'Global Premium Concierge Suite',
      description: 'Elite passenger assistance for premium trans-pacific flights.',
      createdDate: '2026-03-13',
      modifiedDate: '2026-03-13',
      agents: [{agentId: 'a3', profileId: 'p3'}],
      tools: [{toolId: 't1', profileId: 'tp1'}, {toolId: 't3', profileId: 'tp1'}, {toolId: 't4', profileId: 'tp2'}],
      gtmCharacteristics: 'High-value product for loyalty retention in competitive markets.',
      technicalSpec: '',
      useCases: '',
      status: 'Active'
    },
    {
      id: 'pr3',
      name: 'Safety & Quality Assurance Operations',
      description: 'Internal toolset for ground operations and safety auditing.',
      createdDate: '2026-03-13',
      modifiedDate: '2026-03-13',
      agents: [{agentId: 'a4', profileId: 'p1'}],
      tools: [{toolId: 't4', profileId: 'tp1'}],
      gtmCharacteristics: 'Focused on internal efficiency and safety standard adherence.',
      technicalSpec: '',
      useCases: '',
      status: 'Active'
    },
    {
      id: 'pr4',
      name: 'North America Customer Support Package',
      description: 'Regional support bundle for NA operations.',
      createdDate: '2026-03-13',
      modifiedDate: '2026-03-13',
      agents: [{agentId: 'a1', profileId: 'p5'}],
      tools: [{toolId: 't5', profileId: 'tp4'}],
      gtmCharacteristics: 'Standard support package for the US and Canadian markets.',
      technicalSpec: '',
      useCases: '',
      status: 'Active'
    },
    {
      id: 'pr5',
      name: 'European Union Customer Support Package',
      description: 'GDPR-first support bundle for EU operations.',
      createdDate: '2026-03-13',
      modifiedDate: '2026-03-13',
      agents: [{agentId: 'a1', profileId: 'p6'}],
      tools: [{toolId: 't6', profileId: 'tp5'}],
      gtmCharacteristics: 'High-compliance package designed for the EEA.',
      technicalSpec: '',
      useCases: '',
      status: 'Active'
    },
    {
      id: 'pr6',
      name: 'APAC Regional Support Package',
      description: 'Multi-lingual support bundle for Asia-Pacific.',
      createdDate: '2026-03-13',
      modifiedDate: '2026-03-13',
      agents: [{agentId: 'a1', profileId: 'p7'}],
      tools: [{toolId: 't7', profileId: 'tp4'}],
      gtmCharacteristics: 'Agile support package for diverse APAC economies.',
      technicalSpec: '',
      useCases: '',
      status: 'Active'
    }
  ]);

  const [channels, setChannels] = React.useState<Channel[]>([
    {
      id: 'ch1',
      name: 'North America Direct Consumer Channel',
      description: 'Primary public endpoint for NA retail customers.',
      status: 'Published',
      products: ['pr4', 'pr2', 'pr6'],
      gtmInfo: 'Targeting standard retail segments in the US and Canada.',
      publishedUrl: 'https://api.cymbal.com/v1/channels/na-direct',
      createdDate: '2026-03-17',
      modifiedDate: '2026-03-17'
    },
    {
      id: 'ch2',
      name: 'European Enterprise Support Channel',
      description: 'Dedicated channel for EU-based corporate clients.',
      status: 'Draft',
      products: ['pr1', 'pr5'],
      gtmInfo: 'Focus on high-compliance, b2b support services.',
      createdDate: '2026-03-17',
      modifiedDate: '2026-03-17'
    }
  ]);

  const [storefrontConfig, setStorefrontConfig] = React.useState<StorefrontConfig>({
    channelUrl: 'https://api.cymbal.com/v1/channels/na-direct',
    hiddenProductIds: [],
    portalName: 'Cymbal Airlines Agentic Portal'
  });

  const [consumerApps, setConsumerApps] = React.useState<ConsumerApp[]>(INITIAL_CONSUMER_APPS);

  const [isGuidedExperienceEnabled, setIsGuidedExperienceEnabled] = React.useState(true);
  const [guidedExpState, setGuidedExpState] = React.useState<GuidedExperienceState>({
    isActive: false,
    currentStep: 0,
    backupState: null
  });

  const [activeTab, setActiveTab] = React.useState<'Dashboard' | 'Agents' | 'Tools' | 'Distribution' | 'Governance'>('Dashboard');
  const [distributionSubTab, setDistributionSubTab] = React.useState<'Home' | 'Product' | 'Channels' | 'Consumer App Approval' | 'Test Bench'>('Home');
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

  const startGuidedExperience = (type: 'ops' | 'products' = 'ops') => {
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
      // Clear and Setup Initial Tutorial Data
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
    } else if (type === 'products') {
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
    }


    setAgentProfiles([]);
    setToolProfiles([]);
    setProducts([]);
    setChannels([]);
    setConsumerApps([]);

    setActiveTab('Agents');
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

  const nextTutorialStep = () => {
    if (guidedExpState.currentStep === airportOpsTutorial.length - 1) {
      endGuidedExperience();
      return;
    }
    setGuidedExpState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevTutorialStep = () => {
    setGuidedExpState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  };

  const airportOpsTutorial: TutorialStep[] = [
    {
      title: "Goal: Deploy to 5 Airports",
      content: (
        <div>
          <p>Your objective is to deploy an airport operations agent to 5 major airports: <strong>ATL, DXB, DFW, LHR, and HND</strong>.</p>
          <p>Each airport requires its own set of <strong>instructions</strong> for local specificities like weather and noise ordinances.</p>
          <p>First, we'll go through this experience <strong>without profiles</strong> by manually copying the base agent for each location.</p>
        </div>
      )
    },
    {
      title: "Task 1: Setup ATL",
      content: (
        <div>
          <p>Locate the <strong>'Airport Operations Agent'</strong> (the base agent). Under the <strong>Actions</strong> menu, select <strong>Copy</strong>.</p>
          <p>In the creation dialog, name it <strong>'ATL Airport Ops'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Prioritize runway de-icing procedures during winter months."</code>
          <p>Select <strong>Create</strong> to finish.</p>
        </div>
      )
    },
    {
      title: "Task 2: Setup DXB",
      content: (
        <div>
          <p>Locate the <strong>'Airport Operations Agent'</strong> (the base agent). Under the <strong>Actions</strong> menu, select <strong>Copy</strong>.</p>
          <p>In the creation dialog, name it <strong>'DXB Airport Ops'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Include sandstorm visibility protocols in all safety checks."</code>
          <p>Select <strong>Create</strong> to finish.</p>
        </div>
      )
    },
    {
      title: "Task 3: Setup DFW",
      content: (
        <div>
          <p>Locate the <strong>'Airport Operations Agent'</strong> (the base agent). Under the <strong>Actions</strong> menu, select <strong>Copy</strong>.</p>
          <p>In the creation dialog, name it <strong>'DFW Airport Ops'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Monitor for thunderstorm-related wind shear reports."</code>
          <p>Select <strong>Create</strong> to finish.</p>
        </div>
      )
    },
    {
      title: "Task 4: Setup LHR",
      content: (
        <div>
          <p>Locate the <strong>'Airport Operations Agent'</strong> (the base agent). Under the <strong>Actions</strong> menu, select <strong>Copy</strong>.</p>
          <p>In the creation dialog, name it <strong>'LHR Airport Ops'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Enforce strict nighttime noise abatement procedures."</code>
          <p>Select <strong>Create</strong> to finish.</p>
        </div>
      )
    },
    {
      title: "Task 5: Setup HND",
      content: (
        <div>
          <p>Locate the <strong>'Airport Operations Agent'</strong> (the base agent). Under the <strong>Actions</strong> menu, select <strong>Copy</strong>.</p>
          <p>In the creation dialog, name it <strong>'HND Airport Ops'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Adhere to JTSB regional safety reporting formats."</code>
          <p>Select <strong>Create</strong> to finish.</p>
        </div>
      )
    },
    {
      title: "Global Update: 737 Grounding",
      content: (
        <div>
          <p>A new global safety directive has been issued: <strong>All Boeing 737s are grounded.</strong></p>
          <p>Currently, because these agents were created via <strong>duplication</strong>, they are entirely separate entities. You must now manually select <strong>Edit</strong> for <strong>each</strong> of the 5 individual airport agents to add this to their <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Do not deploy any Boeing 737 aircraft."</code>
        </div>
      )
    },
    {
      title: "Transition to Profiles",
      content: (
        <span>This duplication approach is difficult to maintain! Let's reset and try the same objective using the <strong>Agent Profiles</strong> architecture with <strong>Semantic Governance Policies</strong>.</span>
      ),
      onNext: () => {
        // Reset to initial tutorial state for Part 2
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
        setAgentProfiles([]);
        setActiveTab('Governance');
        setGovernanceSubTab('Agent');
      }
    },
    {
      title: "Profile 1: Setup ATL",
      content: (
        <div>
          <p>Go to the <strong>Governance</strong> tab, ensure you are on the <strong>Agent Profiles</strong> sub-tab, and select <strong>Create Agent Profile</strong>.</p>
          <p>Name it <strong>'ATL Profile'</strong> and add this to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Prioritize runway de-icing procedures during winter months."</code>
        </div>
      )
    },
    {
      title: "Profile 2: Setup DXB",
      content: (
        <div>
          <p>Select <strong>Create Agent Profile</strong> again.</p>
          <p>Name it <strong>'DXB Profile'</strong> and add this to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Include sandstorm visibility protocols in all safety checks."</code>
        </div>
      )
    },
    {
      title: "Profile 3: Setup DFW",
      content: (
        <div>
          <p>Select <strong>Create Agent Profile</strong> again.</p>
          <p>Name it <strong>'DFW Profile'</strong> and add this to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Monitor for thunderstorm-related wind shear reports."</code>
        </div>
      )
    },
    {
      title: "Profile 4: Setup LHR",
      content: (
        <div>
          <p>Select <strong>Create Agent Profile</strong> again.</p>
          <p>Name it <strong>'LHR Profile'</strong> and add this to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Enforce strict nighttime noise abatement procedures."</code>
        </div>
      )
    },
    {
      title: "Profile 5: Setup HND",
      content: (
        <div>
          <p>Select <strong>Create Agent Profile</strong> again.</p>
          <p>Name it <strong>'HND Profile'</strong> and add this to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Adhere to JTSB regional safety reporting formats."</code>
        </div>
      ),
      onNext: () => setActiveTab('Agents')
    },
    {
      title: "Centralized Management",
      content: (
        <div>
          <p>When the <strong>737 Grounding</strong> directive is issued, you only need to select <strong>Edit</strong> for the single <strong>'Airport Operations Agent'</strong>.</p>
          <p>By updating the base agent once, you ensure consistency across all deployments. Profiles enable reusing a single base agent instead of duplicating it, offering significantly ease of update and maintenance.</p>
        </div>
      ),
      onNext: () => {
        setActiveTab('Governance');
        setGovernanceSubTab('Agent');
      }
    },
    {
      title: "Emergency at DXB!",
      content: (
        <div>
          <p><strong>ALERT:</strong> DXB has just issued an emergency grounding of all Airbus A380s! 🛫❌</p>
          <p>Because you are using Profiles, you don't need to specify it in the base agent's instructions—just update the <strong>DXB Profile's Semantic Governance Policy</strong> specifically.</p>
          <p>You keep global control through the base agent, with surgical local precision through Profiles.</p>
        </div>
      )
    },
    {
      title: "The Profile Advantage",
      content: (
        <div>
          <p>Experience Complete! You've successfully navigated the simulation with and without Profiles.</p>
          <p><strong>The Profile Advantage:</strong> Agent Profiles allow you to define a single source of truth for your agents while providing specialized instructions for different contexts. This eliminates the need for error-prone duplication and drastically simplifies global fleet management.</p>
        </div>
      ),
      hideNext: true
    }
  ];

  const productsAndChannelsTutorial: TutorialStep[] = [
    {
      title: "Goal: Global Pilot Scheduling",
      content: (
        <div>
          <p>Your objective is to provide pilot scheduling capability to three major airports: <strong>JFK, EWR, and YVR</strong>.</p>
          <p>We will start <strong>without</strong> Profiles to demonstrate the maintenance and management overhead of traditional duplication.</p>
        </div>
      )
    },
    {
      title: "Task 1: Setup YVR Orchestration",
      content: (
        <div>
          <p>Click <strong>Create Agent</strong> on the Agents screen.</p>
          <p>Name it <strong>'YVR Operations Orchestrator'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Refer to 'Airport Operations Agent' and 'Pilot Scheduling Agent' for all YVR operations."</code>
          <p>Add the following to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {"[CANADA_LABOR_LAW] Pilots are limited to 14 hours of continuous duty.\n[YVR_SPECIFIC] All aircraft must adhere to Vancouver noise ordinances."}
          </code>
        </div>
      )
    },
    {
      title: "Task 2: Setup EWR Orchestration",
      content: (
        <div>
          <p>Click <strong>Create Agent</strong> again.</p>
          <p>Name it <strong>'EWR Operations Orchestrator'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Refer to 'Airport Operations Agent' and 'Pilot Scheduling Agent' for all EWR operations."</code>
          <p>Add the following to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {"[US_LABOR_LAW] Pilots are limited to 12 hours of continuous duty.\n[EWR_SPECIFIC] Prioritize Newark runway de-icing protocols."}
          </code>
        </div>
      )
    },
    {
      title: "Task 3: Setup JFK Orchestration",
      content: (
        <div>
          <p>Click <strong>Create Agent</strong> again.</p>
          <p>Name it <strong>'JFK Operations Orchestrator'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Refer to 'Airport Operations Agent' and 'Pilot Scheduling Agent' for all JFK operations."</code>
          <p>Add the following to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {"[US_LABOR_LAW] Pilots are limited to 12 hours of continuous duty.\n[JFK_SPECIFIC] Coordinate closely with JFK Terminal 4 logistics."}
          </code>
        </div>
      )
    },
    {
      title: "The Maintenance Trap",
      content: (
        <div>
          <p>What happens if <strong>US Labor Laws change</strong>? You would have to manually edit <strong>both</strong> the JFK and EWR agents separately.</p>
          <p>Furthermore, how do you track how much usage the base `Pilot Scheduling Agent` gets specifically from EWR? It's complex to reverse-engineer from logs.</p>
        </div>
      ),
      onNext: () => {
        setAgentProfiles([
          {
            id: 'tut-p-jfk',
            name: 'JFK Profile',
            description: 'JFK Specific Governance',
            createdDate: new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0],
            globalSemanticPolicy: '[JFK_SPECIFIC] Coordinate closely with JFK Terminal 4 logistics.',
            toolSemanticPolicies: {},
            status: 'Active'
          },
          {
            id: 'tut-p-ewr',
            name: 'EWR Profile',
            description: 'EWR Specific Governance',
            createdDate: new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0],
            globalSemanticPolicy: '[EWR_SPECIFIC] Prioritize Newark runway de-icing protocols.',
            toolSemanticPolicies: {},
            status: 'Active'
          },
          {
            id: 'tut-p-yvr',
            name: 'YVR Profile',
            description: 'YVR Specific Governance',
            createdDate: new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0],
            globalSemanticPolicy: '[YVR_SPECIFIC] All aircraft must adhere to Vancouver noise ordinances.',
            toolSemanticPolicies: {},
            status: 'Active'
          },
          {
            id: 'tut-p-us-labor',
            name: 'US Pilot Labor Law',
            description: 'US Labor Law Governance',
            createdDate: new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0],
            globalSemanticPolicy: '[US_LABOR_LAW] Pilots are limited to 12 hours of continuous duty.',
            toolSemanticPolicies: {},
            status: 'Active'
          },
          {
            id: 'tut-p-ca-labor',
            name: 'Canada Pilot Labor Law',
            description: 'Canada Labor Law Governance',
            createdDate: new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0],
            globalSemanticPolicy: '[CANADA_LABOR_LAW] Pilots are limited to 14 hours of continuous duty.',
            toolSemanticPolicies: {},
            status: 'Active'
          }
        ]);
        setActiveTab('Governance');
        setGovernanceSubTab('Agent');
      }
    },
    {
      title: "Profiles Generated",
      content: (
        <div>
          <p>We've generated 5 profiles for you to use:</p>
          <ul>
            <li><strong>JFK, EWR, YVR Profiles</strong> (Airport Specific)</li>
            <li><strong>US & Canada Labor Law</strong> (Country Specific)</li>
          </ul>
          <p>Profiles need a <strong>Product</strong> to take effect. A product is a bundle of capabilities for a specific use-case.</p>
        </div>
      ),
      onNext: () => {
        setActiveTab('Distribution');
        setDistributionSubTab('Product');
      }
    },
    {
      title: "Product 1: YVR Pilot Scheduling",
      content: (
        <div>
          <p>Select <strong>Create Product</strong>.</p>
          <p>Name: <strong>'YVR Pilot Scheduling Solution'</strong></p>
          <p>Add Agents:</p>
          <ul>
            <li><strong>Pilot Scheduling Agent</strong> with <strong>Canada Pilot Labor Law Profile</strong></li>
            <li><strong>Airport Operations Agent</strong> with <strong>YVR Profile</strong></li>
          </ul>
        </div>
      )
    },
    {
      title: "Product 2: JFK Pilot Scheduling",
      content: (
        <div>
          <p>Select <strong>Create Product</strong>.</p>
          <p>Name: <strong>'JFK Pilot Scheduling Solution'</strong></p>
          <p>Add Agents:</p>
          <ul>
            <li><strong>Pilot Scheduling Agent</strong> with <strong>US Pilot Labor Law Profile</strong></li>
            <li><strong>Airport Operations Agent</strong> with <strong>JFK Profile</strong></li>
          </ul>
        </div>
      )
    },
    {
      title: "Product 3: EWR Pilot Scheduling",
      content: (
        <div>
          <p>Select <strong>Create Product</strong>.</p>
          <p>Name: <strong>'EWR Pilot Scheduling Solution'</strong></p>
          <p>Add Agents:</p>
          <ul>
            <li><strong>Pilot Scheduling Agent</strong> with <strong>US Pilot Labor Law Profile</strong> (See the Reuse!)</li>
            <li><strong>Airport Operations Agent</strong> with <strong>EWR Profile</strong></li>
          </ul>
        </div>
      )
    },
    {
      title: "The Power of Reuse",
      content: (
        <div>
          <p>Notice how clean that is! The <strong>US Pilot Labor Law Profile</strong> is shared across both JFK and EWR products.</p>
        </div>
      )
    },
    {
      title: "Dynamic Update",
      content: (
        <div>
          <p>If <strong>US Labor Laws change</strong> (e.g., pilots only work 3 days/week), you don't edit every agent.</p>
          <p>Simply edit the single <strong>US Pilot Labor Law Profile</strong>. All referencing products update instantly.</p>
        </div>
      )
    },
    {
      title: "Scaling to SEA",
      content: (
        <div>
          <p>To support <strong>SEA</strong>, create a new Product, reuse the <strong>Pilot Scheduling Agent</strong> + <strong>US Labor Law Profile</strong>, and create a new <strong>SEA Profile</strong>.</p>
        </div>
      )
    },
    {
      title: "Observability & ROI",
      content: (
        <div>
          <p>Metrics and ROI are now tied to <strong>Products</strong>. You can easily track usage for the EWR product independently.</p>
        </div>
      ),
      onNext: () => {
        setDistributionSubTab('Channels');
      }
    },
    {
      title: "Publish to Channels",
      content: (
        <div>
          <p>Products are published to Channels. Let's group our US solutions.</p>
          <p>Go to <strong>Distribution</strong> &rarr; <strong>Channels</strong> and select <strong>Create Channel</strong>.</p>
          <p>Name: <strong>'US Regional Operations Channel'</strong></p>
          <p>Select available US Products (JFK, EWR).</p>
        </div>
      )
    },
    {
      title: "Experience Complete",
      content: (
        <div>
          <p>You've successfully bundled capabilities into Products, reused Profiles for governance, and published to Channels.</p>
          <p>This architecture provides modularity, scalability, and enhanced observability.</p>
        </div>
      ),
      hideNext: true
    }
  ];

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
            <button 
              onClick={() => setDistributionSubTab('Test Bench')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: distributionSubTab === 'Test Bench' ? '2px solid #1a73e8' : '2px solid transparent',
                color: distributionSubTab === 'Test Bench' ? '#1a73e8' : '#5f6368',
                fontWeight: 400,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >Test Bench</button>
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
          {distributionSubTab === 'Test Bench' && (
            <TestBench 
              products={products}
              agents={agents}
              agentProfiles={agentProfiles}
              tools={tools}
              toolProfiles={toolProfiles}
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(45deg)" }}>
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
          </svg>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
            Cymbal Airlines Simulation
            <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#1a73e8', border: '1px solid #1a73e8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>v0.0.9</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label htmlFor="persona-select" style={{ fontSize: '0.9rem', fontWeight: 400, color: '#5f6368' }}>Persona: </label>
          <select 
            id="persona-select" 
            value={persona} 
            onChange={(e) => {
              handlePersonaChange(e.target.value as Persona);
            }}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid #dadce0',
              backgroundColor: '#f1f3f4',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Product Owner">Product Owner</option>
            <option value="Governance Administrator">Governance Administrator</option>
            <option value="C-Suite Executive">C-Suite Executive</option>
            <option value="Storefront Manager">Storefront Manager</option>
            <option value="End Consumer">End Consumer</option>
            <option value="Admin">Simulator Admin</option>
          </select>
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
          Cymbal Airlines Internal
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
          steps={guidedExpState.type === 'products' ? productsAndChannelsTutorial : airportOpsTutorial} 
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
