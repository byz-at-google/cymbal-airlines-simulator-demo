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
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        backgroundColor: 'white',
        borderTop: '1px solid #dadce0',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        zIndex: 2001,
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

export const getProductsAndChannelsTutorial = (
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
          <p>Products are the way that capabilities like agents are distributed to address a specific use-case. Profiles help tailor governance and functionality for each product to ensure its customized for that exact use case.</p>
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
          <p>To support <strong>SEA</strong> (Seattle), we first need to define its specific governance.</p>
          <p>Go to <strong>Governance</strong> &rarr; <strong>Agent Profiles</strong> and select <strong>Create Agent Profile</strong>.</p>
          <p>Name: <strong>'SEA Profile'</strong></p>
          <p>Global Semantic Policy:</p>
          <code style={{ display: 'block', padding: '0.5rem', backgroundColor: '#f1f3f4', margin: '0.5rem 0' }}>"[SEA_SPECIFIC] Account for Seattle-Tacoma low-visibility approach delays in pilot rest calculations."</code>
          <p>Then, create a new <strong>Product</strong> for SEA and bundle it up!</p>
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
          <p>Select available US Products (JFK, EWR, SEA).</p>
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
