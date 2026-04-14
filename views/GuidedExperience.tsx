/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment, useState, useEffect, useRef} from 'react';
import * as React from 'react';

export interface TutorialStep {
  title: string;
  content: React.ReactNode;
  targetSelector?: string;
  onNext?: () => void;
  hideNext?: boolean;
}

interface GuidedExperienceProps {
  steps: TutorialStep[];
  currentStep: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GuidedExperienceOverlay: React.FC<GuidedExperienceProps> = ({
  steps,
  currentStep,
  onClose,
  onNext,
  onPrev
}) => {
  const step = steps[currentStep];

  if (!step) return null;

  return (
    <Fragment>
      {/* Bottom Bar Navigation */}
      <div style={{
        height: '200px',
        backgroundColor: 'white',
        borderTop: '1px solid #dadce0',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        zIndex: 2001,
        flexShrink: 0,
        gap: '2rem'
      }}>
        <div style={{ flexShrink: 0, maxWidth: '300px' }}>
          <div style={{ fontSize: '0.75rem', color: '#1a73e8', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Progress: {currentStep + 1} of {steps.length}
          </div>
          <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#202124', fontWeight: 500 }}>{step.title}</h4>
        </div>
        
        <div style={{ 
          flexGrow: 1, 
          fontSize: '1.1rem', 
          color: '#3c4043', 
          lineHeight: '1.5',
          padding: '8px 0',
          maxHeight: '160px',
          overflowY: 'auto'
        }}>
          {step.content}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: 'white',
              color: '#5f6368',
              border: '1px solid #dadce0',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Exit Tutorial
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentStep > 0 && (
              <button 
                onClick={onPrev}
                style={{
                  backgroundColor: 'white',
                  color: '#1a73e8',
                  border: '1px solid #1a73e8',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length - 1 && !step.hideNext && (
              <button 
                onClick={() => {
                  onNext();
                }}
                style={{
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 2rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(26,115,232,0.3)'
                }}
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export const getAirportOpsTutorial = (
  setAgents: Function,
  setAgentProfiles: Function,
  setActiveTab: Function,
  setGovernanceSubTab: Function
): TutorialStep[] => [
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

export const getBundlesAndChannelsTutorial = (
  setAgentProfiles: Function,
  setActiveTab: Function,
  setGovernanceSubTab: Function,
  setDistributionSubTab: Function
): TutorialStep[] => [
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
      title: "Task 1: Setup YVR Pilot Scheduling",
      content: (
        <div>
          <p>Click <strong>Create Agent</strong> on the Agents screen.</p>
          <p>Name it <strong>'YVR Pilot Scheduling Orchestrator'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Leverage the Airport Operations Agent and Pilot Scheduling Agent to schedule operations for YVR"</code>
          <p>Add the following to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {"[CANADA_LABOR_LAW] Pilots are limited to 14 hours of continuous duty.\n[YVR_SPECIFIC] Account for travel time to off-site crew hotels during peak Vancouver traffic."}
          </code>
        </div>
      )
    },
    {
      title: "Task 2: Setup EWR Pilot Scheduling",
      content: (
        <div>
          <p>Click <strong>Create Agent</strong> again.</p>
          <p>Name it <strong>'EWR Pilot Scheduling Orchestrator'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Leverage the Airport Operations Agent and Pilot Scheduling Agent to schedule operations for EWR"</code>
          <p>Add the following to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {"[US_LABOR_LAW] Pilots are limited to 12 hours of continuous duty.\n[EWR_SPECIFIC] Coordinate deadheading crews with Atlantic Coast shuttle timetables."}
          </code>
        </div>
      )
    },
    {
      title: "Task 3: Setup JFK Pilot Scheduling",
      content: (
        <div>
          <p>Click <strong>Create Agent</strong> again.</p>
          <p>Name it <strong>'JFK Pilot Scheduling Orchestrator'</strong> and add this to the <strong>Instructions</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"Leverage the Airport Operations Agent and Pilot Scheduling Agent to schedule operations for JFK"</code>
          <p>Add the following to the <strong>Global Agent Semantic Governance Policy</strong>:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
            {"[US_LABOR_LAW] Pilots are limited to 12 hours of continuous duty.\n[JFK_SPECIFIC] Factor in JFK runway taxi times when calculating continuous duty start times."}
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
          <p>Bundles are the way that capabilities like agents are distributed to address a specific use-case. Profiles help tailor governance and functionality for each bundle to ensure its customized for that exact use case.</p>
        </div>
      ),
      onNext: () => {
        setActiveTab('Distribution');
        setDistributionSubTab('Bundle');
      }
    },
    {
      title: "Bundle 1: YVR Pilot Scheduling",
      content: (
        <div>
          <p>Select <strong>Create Bundle</strong>.</p>
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
      title: "Bundle 2: JFK Pilot Scheduling",
      content: (
        <div>
          <p>Select <strong>Create Bundle</strong>.</p>
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
      title: "Bundle 3: EWR Pilot Scheduling",
      content: (
        <div>
          <p>Select <strong>Create Bundle</strong>.</p>
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
          <p>Notice how clean that is! The <strong>US Pilot Labor Law Profile</strong> is shared across both JFK and EWR bundles.</p>
        </div>
      )
    },
    {
      title: "Dynamic Update",
      content: (
        <div>
          <p>If <strong>US Labor Laws change</strong> (e.g., pilots only work 3 days/week), you don't edit every agent.</p>
          <p>Simply edit the single <strong>US Pilot Labor Law Profile</strong>. All referencing bundles update instantly.</p>
        </div>
      )
    },
    {
      title: "Scaling to SEA",
      content: (
        <div>
          <p>To support <strong>SEA</strong> (Seattle), we first need to define its specific governance.</p>
          <p>Go to <strong>Governance</strong> &rarr; <strong>Agent Profiles</strong> and select <strong>Create Agent Profile</strong>.</p>
          <p>Name: <strong>'SEA Profile'</strong></p>
          <p>Global Semantic Policy:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"[SEA_SPECIFIC] Account for Seattle-Tacoma low-visibility approach delays in pilot rest calculations."</code>
          <p>Then, create a new <strong>Bundle</strong> for SEA and bundle it up!</p>
        </div>
      )
    },
    {
      title: "Observability & ROI",
      content: (
        <div>
          <p>Metrics and ROI are now tied to <strong>Bundles</strong>. You can easily track usage for the EWR bundle independently.</p>
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
          <p>Bundles are published to Channels. Let's group our US solutions.</p>
          <p>Go to <strong>Distribution</strong> &rarr; <strong>Channels</strong> and select <strong>Create Channel</strong>.</p>
          <p>Name: <strong>'US Regional Operations Channel'</strong></p>
          <p>Select available US Bundles (JFK, EWR, SEA).</p>
        </div>
      )
    },
    {
      title: "Experience Complete",
      content: (
        <div>
          <p>You've successfully navigated the simulation with and without Profiles.</p>
          <p>This architecture provides modularity, scalability, and enhanced observability.</p>
        </div>
      ),
      hideNext: true
    }
];

export const getPublishAndConsumeTutorial = (
  setPersona: Function,
  setActiveTab: Function,
  setDistributionSubTab: Function,
  setStorefrontConfig: Function,
  setChannels: Function,
  setConsumerApps: Function,
  bundles: any[],
  channels: any[]
): TutorialStep[] => [
    {
      title: "Goal: Publish and Consume",
      content: (
        <div>
          <p>This scenario demonstrates the end-to-end workflow of publishing a channel, subscribing to it via a storefront, managing bundle visibility, and completing the consumer app submission and approval process.</p>
          <p>We will switch between multiple personas to complete this workflow.</p>
        </div>
      )
    },
    {
      title: "Step 1: Open Edit Channel (Product Owner)",
      content: (
        <div>
          <p>As a <strong>Product Owner</strong>, you need to publish a channel to make its bundles available to storefronts.</p>
          <p>Go to the <strong>Distribution</strong> tab, then the <strong>Channels</strong> sub-tab.</p>
          <p>Find the channel <strong>'Cymbal Partner Rewards Network'</strong> (created for you) and click on its name or select <strong>Edit</strong> from the Actions menu to open the edit form.</p>
        </div>
      ),
      onNext: () => {
        setPersona('IT Team');
        setActiveTab('Distribution');
        setDistributionSubTab('Channels');
        setChannels((prevChannels: any[]) => {
          const channelExists = prevChannels.some((c: any) => c.name === 'Cymbal Partner Rewards Network');
          if (channelExists) {
              return prevChannels.map((c: any) => c.name === 'Cymbal Partner Rewards Network' ? {...c, status: 'Draft', publishedUrl: undefined} : c);
          } else {
              return [...prevChannels, {
                  id: 'tut-ch-pub',
                  name: 'Cymbal Partner Rewards Network',
                  description: 'Channel for distributing Cymbal Airlines partner rewards and offers to storefronts.',
                  status: 'Draft',
                  bundles: ['tut-p1', 'tut-p2'],
                  createdDate: new Date().toISOString().split('T')[0],
                  modifiedDate: new Date().toISOString().split('T')[0],
                  gtmInfo: 'Cymbal Partner Rewards GTM info'
              }];
          }
        });
      }
    },
    {
      title: "Step 2: Publish the Channel (Product Owner)",
      content: (
        <div>
          <p>In the edit form, change the <strong>Status</strong> to <strong>Published</strong> and click <strong>Save Changes</strong>.</p>
          <p><em>Note: It is expected that a real endpoint is not generated in this simulation.</em></p>
        </div>
      ),
      onNext: () => {
         setChannels((prevChannels: any[]) => {
              return prevChannels.map((c: any) => c.name === 'Cymbal Partner Rewards Network' ? {...c, status: 'Published', publishedUrl: 'https://api.cymbal.com/v1/channels/cymbal-partner-rewards'} : c);
         });
      }
    },
    {
      title: "Step 3: Switch to Storefront Owner",
      content: (
        <div>
          <p>Now we need to switch to the <strong>Storefront Manager</strong> persona to subscribe to the channel.</p>
          <p>Click <strong>Next Step</strong> to automatically switch, or use the switch in the top right.</p>
        </div>
      ),
      onNext: () => {
        setPersona('Storefront Manager');
      }
    },
    {
      title: "Step 4: Subscribe to Channel (Storefront Owner)",
      content: (
        <div>
          <p>Select <strong>'Cymbal Partner Rewards Network'</strong> from the <strong>Active Endpoint</strong> dropdown in Catalog Settings.</p>
          <p>Click <strong>Next Step</strong> to continue.</p>
        </div>
      ),
      onNext: () => {
          setChannels((prevChannels: any[]) => {
               return prevChannels.map((c: any) => c.name === 'Cymbal Partner Rewards Network' ? {...c, status: 'Published', publishedUrl: 'https://api.cymbal.com/v1/channels/cymbal-partner-rewards'} : c);
          });
          setStorefrontConfig((prev: any) => ({
              ...prev,
              channelUrl: 'https://api.cymbal.com/v1/channels/cymbal-partner-rewards'
          }));
      }
    },
    {
      title: "Step 5: Manage Bundle Visibility (Storefront Owner)",
      content: (
        <div>
          <p>Try unpublishing a bundle (e.g., 'North America Customer Support Package') by clicking the <strong>Unpublish Agent</strong> button in the table.</p>
          <p>This will hide it from the End Consumer.</p>
        </div>
      )
    },
    {
      title: "Step 6: Switch to End Consumer",
      content: (
        <div>
          <p>Now we need to switch to the <strong>End Consumer</strong> persona to browse the catalog.</p>
          <p>Click <strong>Next Step</strong> to automatically switch.</p>
        </div>
      ),
      onNext: () => {
        setPersona('End Consumer');
      }
    },
    {
      title: "Step 7: Submit Consumer App (End Consumer)",
      content: (
        <div>
          <p>Browse the catalog. Notice that any bundles you unpublished are hidden.</p>
          <p>Select a visible bundle and click <strong>Create Consumer App for Access</strong>.</p>
          <p>Fill out the form and submit.</p>
        </div>
      )
    },
    {
      title: "Step 8: Switch to Product Owner",
      content: (
        <div>
          <p>Now we need to switch back to the <strong>Product Owner</strong> persona to review the application.</p>
          <p>Click <strong>Next Step</strong> to automatically switch.</p>
        </div>
      ),
      onNext: () => {
        setPersona('IT Team');
      }
    },
    {
      title: "Step 9: Approve Consumer App (Product Owner)",
      content: (
        <div>
          <p>Go to the <strong>Distribution</strong> tab, then the <strong>Consumer App Approval</strong> sub-tab.</p>
          <p>Find the pending request and click <strong>Approve</strong>.</p>
        </div>
      ),
      onNext: () => {
          setPersona('IT Team');
          setActiveTab('Distribution');
          setDistributionSubTab('Consumer App Approval');
      }
    },
    {
      title: "Step 10: Switch to End Consumer",
      content: (
        <div>
          <p>Now we need to switch back to the <strong>End Consumer</strong> persona to verify the approval.</p>
          <p>Click <strong>Next Step</strong> to automatically switch.</p>
        </div>
      ),
      onNext: () => {
        setPersona('End Consumer');
      }
    },
    {
      title: "Step 11: Verify Approval (End Consumer)",
      content: (
        <div>
          <p>Click on <strong>My Profile</strong> in the top navigation.</p>
          <p>Verify that your application status is now <strong>Approved</strong>.</p>
        </div>
      )
    },
    {
      title: "Experience Complete",
      content: (
        <div>
          <p>You've successfully navigated the end-to-end workflow!</p>
        </div>
      ),
      hideNext: true
    }
];

export const getGoldmanTutorial = (
  setActiveTab: Function,
  setGovernanceSubTab: Function
): TutorialStep[] => [
    {
      title: "Goldman Sachs Scenario: Ethical Wall",
      content: (
        <div>
          <p>Goldman Sachs needs to ensure no sensitive data is passed between its <strong>Commodities teams</strong> (and their agentic system) and its <strong>Futures teams</strong> (and their agentic system).</p>
          <p>This requires a strict ethical wall between these two groups of agents.</p>
        </div>
      )
    },
    {
      title: "Navigate to Privacy Controls",
      content: (
        <div>
          <p>As this is a business rule, you need to configure this in <strong>Functional Governance</strong>.</p>
          <p>Click on the <strong>Governance</strong> tab and then the <strong>Privacy Controls</strong> sub-tab.</p>
        </div>
      ),
      onNext: () => {
        setActiveTab('Governance');
        setGovernanceSubTab('PrivacyControls');
      }
    },
    {
      title: "Enforce Ethical Wall",
      content: (
        <div>
          <p>You are now in the Privacy Controls section.</p>
          <p>Scroll down to the <strong>Example: Inter-Agent Communication Firewall</strong> playground.</p>
          <p>Notice that the <strong>POLICY: Ethical Wall Enforcement</strong> is active.</p>
          <p>You can utilize this specific policy to prevent two different agents from two different privacy classifications from talking to each other.</p>
        </div>
      )
    },
    {
      title: "Test Policy Enforcement",
      content: (
        <div>
          <p>In the playground dropdowns, you can see 3 Commodities Agents and 3 Futures Agents.</p>
          <p><strong>Try it out:</strong></p>
          <ol>
            <li>Select a <strong>Commodities Trading Agent</strong> as Source and a <strong>Futures Trading Agent</strong> as Destination (or vice versa).</li>
            <li>Enter a message containing sensitive words like "oil" or "position".</li>
            <li>Click <strong>Run Policy</strong> and observe the <strong>DENY</strong> response.</li>
            <li>Now try selecting two agents from the <strong>same team</strong> (e.g., both Commodities) and observe the <strong>ALLOW</strong> response.</li>
          </ol>
        </div>
      ),
      hideNext: true
    }
];

export const getUnicreditTutorial = (
  setActiveTab: Function,
  setDistributionSubTab: Function,
  setGovernanceSubTab: Function
): TutorialStep[] => [
    {
      title: "Unicredit Scenario: Regional Agent Distribution",
      content: (
        <div>
          <p>Unicredit needs to deploy the same functional agent to different geographical regions with specific governance in each region to ensure compliance with local laws and regulations.</p>
          <p>This is a need shared by many customers, who have also said they need to <strong>"decouple rules from agents"</strong> and that <strong>"distribution without governance is not working"</strong>.</p>
        </div>
      )
    },
    {
      title: "Navigate to Agent Profiles",
      content: (
        <div>
          <p>To deploy the Customer Banking agent to multiple regions with different rules, we need to create region-specific profiles.</p>
          <p>Under the <strong>PORTFOLIO MANAGEMENT</strong> section, click on the <strong>Lifecycle</strong> tab and then the <strong>Agent Profiles</strong> sub-tab.</p>
        </div>
      ),
      onNext: () => {
        setActiveTab('Distribution');
        setDistributionSubTab('Agent');
      }
    },
    {
      title: "Create NA Agent Profile",
      content: (
        <div>
          <p>You are now in the Agent Profiles section.</p>
          <p>Please create an <strong>NA Agent Profile</strong> for the <strong>Customer Banking</strong> agent.</p>
          <p>Specify an example <strong>NA-only semantic policy constraint</strong> (e.g., "Do not offer investment advice on products not registered with SEC") and save the profile.</p>
        </div>
      )
    },
    {
      title: "Create EU Agent Profile",
      content: (
        <div>
          <p>Now, create an <strong>EU Agent Profile</strong> for the <strong>Customer Banking</strong> agent.</p>
          <p>Specify a more-complex <strong>EU-only semantic policy constraint</strong> (e.g., "Strictly adhere to GDPR data minimization principles. Do not process transaction data without explicit consent for each recommendation.") and save the profile.</p>
        </div>
      )
    },
    {
      title: "Decoupled Governance",
      content: (
        <div>
          <p>Great! We can now deploy the same <strong>Customer Banking</strong> agent in two different ways, each governed differently based on the region.</p>
        </div>
      )
    },
    {
      title: "Update EU Governance",
      content: (
        <div>
          <p>Now we need to update the EU governance due to updated EU laws.</p>
          <p>Please go back to <strong>Agent Profiles</strong> to update the EU profile.</p>
        </div>
      ),
      onNext: () => {
        setActiveTab('Distribution');
        setDistributionSubTab('Agent');
      }
    },
    {
      title: "Modify EU Profile",
      content: (
        <div>
          <p>Open the <strong>EU Agent Profile</strong> and add the following constraint to the global semantic policy:</p>
          <p style={{ background: '#f1f3f4', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem', margin: '0.5rem 0' }}>"Ensure all investment recommendations explicitly mention the risk level, as per new EU investor protection guidelines."</p>
          <p>This demonstrates how we can update governance independently of the agent's core logic.</p>
        </div>
      )
    },
    {
      title: "Scenario Summary",
      content: (
        <div>
          <p>In summary, profiles made it possible to deploy the same agent functionally to different business use-cases and govern each differently.</p>
          <p>We can update agent functionality or code without needing duplication, maintaining a clean separation of concerns.</p>
        </div>
      ),
      hideNext: true
    }
];;
