/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {Agent} from '../app';
import {Tool} from './ToolManager';
import {AgentProfile, ToolProfile} from './ProfileManager';
import {Bundle} from './BundleManager';

interface TestBenchProps {
  bundles: Bundle[];
  agents: Agent[];
  agentProfiles: AgentProfile[];
  tools: Tool[];
  toolProfiles: ToolProfile[];
}

interface Message {
  role: 'user' | 'agent';
  content: string;
  governanceDetails?: {
    originalContent: string;
    modifications: string[];
    profilesApplied: string[];
  };
}

export const TestBench: React.FC<TestBenchProps> = ({
  bundles, agents, agentProfiles, tools, toolProfiles
}) => {
  const [selectedBundleId, setSelectedBundleId] = React.useState<string>(bundles[0]?.id || '');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isSimulating, setIsSimulating] = React.useState(false);

  const selectedBundle = bundles.find(p => p.id === selectedBundleId);

  const simulateResponse = async (userText: string) => {
    setIsSimulating(true);
    
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const baseResponse = `Hello! I'm your AI assistant for ${selectedBundle?.name || 'Cymbal Airlines'}. I can help you with your booking. My internal records show your customer ID is CUST-9928 and your private phone number is +1-555-0199. How can I assist you today?`;
    
    // Governance Simulation Logic
    const modifications: string[] = [];
    const profilesApplied: string[] = [];
    let governedContent = baseResponse;

    if (selectedBundle) {
      const bundleProfiles = selectedBundle.agents.map(a => agentProfiles.find(ap => ap.id === a.profileId));
      
      bundleProfiles.forEach(p => {
        if (!p) return;
        const semanticPolicy = p.globalSemanticPolicy;

        if (semanticPolicy.includes('[ENFORCE_GDPR]')) {
          if (!profilesApplied.includes('GDPR Compliance')) {
            profilesApplied.push('GDPR Compliance');
            const original = governedContent;
            governedContent = governedContent.replace('+1-555-0199', '[REDACTED PII]');
            governedContent = governedContent.replace('CUST-9928', '[REDACTED ID]');
            if (original !== governedContent) {
              modifications.push('Redacted PII (Phone/ID) to comply with GDPR directive.');
            }
          }
        }

        if (semanticPolicy.includes('[INJECT_SAFETY]')) {
          if (!profilesApplied.includes('Safety Operations')) {
            profilesApplied.push('Safety Operations');
            governedContent += '\n\n[Safety Notice: All systems nominal. Operation authorized.]';
            modifications.push('Injected mandatory safety status block.');
          }
        }

        if (semanticPolicy.includes('[FORMAL_TONE]')) {
          if (!profilesApplied.includes('Formal Tone Enforcement')) {
            profilesApplied.push('Formal Tone Enforcement');
            governedContent = governedContent.replace('Hello!', 'Greetings, valued passenger.');
            modifications.push('Adjusted language to match formal corporate standards.');
          }
        }

        if (semanticPolicy.includes('[CASUAL_TONE]')) {
          if (!profilesApplied.includes('Casual Tone Alignment')) {
            profilesApplied.push('Casual Tone Alignment');
            governedContent = governedContent.replace('Hello!', 'Hey there! 👋');
            modifications.push('Personalized greeting for friendly concierge experience.');
          }
        }

        if (semanticPolicy.includes('[APPEND_SLOGAN]')) {
          if (!profilesApplied.includes('Branding Enforcement')) {
            profilesApplied.push('Branding Enforcement');
            governedContent += '\n\nCymbal Airlines - Your journey, our passion.';
            modifications.push('Appended corporate slogan.');
          }
        }

        if (semanticPolicy.includes('[STRICT_JSON_OUTPUT]')) {
          if (!profilesApplied.includes('Data Format Enforcement')) {
            profilesApplied.push('Data Format Enforcement');
            governedContent = JSON.stringify({
              status: 'success',
              agent_response: governedContent,
              timestamp: new Date().toISOString()
            }, null, 2);
            modifications.push('Enforced strict JSON output format for downstream ingestion.');
          }
        }
      });
    }

    const newMessage: Message = {
      role: 'agent',
      content: governedContent,
      governanceDetails: modifications.length > 0 ? {
        originalContent: baseResponse,
        modifications,
        profilesApplied
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setIsSimulating(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSimulating) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    simulateResponse(input);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Governance Test Bench</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#5f6368', fontSize: '0.9rem' }}>Interact with bundles to see Governance Profiles in action.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Select Bundle:</label>
          <select 
            value={selectedBundleId} 
            onChange={e => {
              setSelectedBundleId(e.target.value);
              setMessages([]); // Reset chat when switching bundles
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0' }}
          >
            {bundles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {selectedBundle && (
        <div style={{ background: '#e8f0fe', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #1a73e8', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Bundle Manifest & Semantic Governance Policy
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#202124', marginBottom: '0.5rem' }}>Agents & Governance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedBundle.agents.map((sa, i) => {
                  const agent = agents.find(a => a.id === sa.agentId);
                  const profile = agentProfiles.find(p => p.id === sa.profileId);
                  return (
                    <div key={i} style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #dadce0', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600 }}>{agent?.name} <span style={{ fontWeight: 400, color: '#5f6368' }}>uses</span> {profile?.name}</div>
                      <div style={{ color: '#5f6368', marginTop: '0.25rem', fontStyle: 'italic' }}>{profile?.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#202124', marginBottom: '0.5rem' }}>Tools & Governance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedBundle.tools.map((st, i) => {
                  const tool = tools.find(t => t.id === st.toolId);
                  const profile = toolProfiles.find(p => p.id === st.profileId);
                  return (
                    <div key={i} style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #dadce0', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600 }}>{tool?.name} <span style={{ fontWeight: 400, color: '#5f6368' }}>uses</span> {profile?.name}</div>
                      <div style={{ color: '#5f6368', marginTop: '0.25rem', fontStyle: 'italic' }}>{profile?.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, gap: '1.5rem', minHeight: 0 }}>
        {/* Chat Area */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#5f6368', marginTop: '2rem' }}>
                Start a conversation to see the agent response.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: m.role === 'user' ? '#1a73e8' : '#f1f3f4',
                color: m.role === 'user' ? '#ffffff' : '#202124',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}>
                {m.content.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
              </div>
            ))}
            {isSimulating && (
              <div style={{ alignSelf: 'flex-start', background: '#f1f3f4', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#5f6368', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                <span style={{ width: '6px', height: '6px', background: '#5f6368', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', background: '#5f6368', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #dadce0', display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isSimulating}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '24px', border: '1px solid #dadce0', outline: 'none' }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isSimulating}
              style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '24px', cursor: 'pointer', fontWeight: 500 }}
            >
              Send
            </button>
          </form>
        </div>

        {/* Governance Inspector */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #dadce0', background: '#f8f9fa' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Governance Inspector
            </h3>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
            {messages.length > 0 && messages[messages.length - 1].role === 'agent' && messages[messages.length - 1].governanceDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5f6368', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Profiles Applied</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {messages[messages.length - 1].governanceDetails?.profilesApplied.map((p, i) => (
                      <span key={i} style={{ padding: '0.2rem 0.6rem', border: '1px solid #1a73e8', borderRadius: '4px', color: '#1a73e8', fontSize: '0.85rem', fontWeight: 500 }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5f6368', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Modifications Made</div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#202124' }}>
                    {messages[messages.length - 1].governanceDetails?.modifications.map((m, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem' }}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5f6368', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Original Raw Output</div>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', fontSize: '0.85rem', color: '#5f6368', position: 'relative', border: '1px solid #dadce0' }}>
                    {messages[messages.length - 1].governanceDetails?.originalContent}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#5f6368', paddingTop: '2rem' }}>
                {messages.length > 0 && messages[messages.length - 1].role === 'user' ? 'Simulating governance check...' : 'Select a response to see governance details.'}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};
