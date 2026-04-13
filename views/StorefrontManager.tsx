/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment, useState, useEffect} from 'react';
import * as React from 'react';
import {StorefrontConfig, Channel, Bundle} from '../app';

interface StorefrontManagerProps {
  config: StorefrontConfig;
  setConfig: React.Dispatch<React.SetStateAction<StorefrontConfig>>;
  channels: Channel[];
  bundles: Bundle[];
}

export const StorefrontManager: React.FC<StorefrontManagerProps> = ({
  config, setConfig, channels, bundles
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [currentTab, setCurrentTab] = useState<'Catalog' | 'Analytics'>('Catalog');
  
  const mockAnalytics = bundles.map(p => ({
    id: p.id,
    name: p.name,
    totalRequests: Math.floor(Math.random() * 100) + 20,
    approvalRate: (Math.random() * 30 + 60).toFixed(1) + '%',
    activeIntegrations: Math.floor(Math.random() * 40) + 10,
    avgLatency: (Math.random() * 200 + 150).toFixed(0) + 'ms'
  }));
  
  const activeChannel = channels.find(c => c.publishedUrl === config.channelUrl) || channels[0];
  const channelBundles = bundles.filter(p => activeChannel?.bundles.includes(p.id));

  const toggleVisibility = (bundleId: string) => {
    setConfig(prev => ({
      ...prev,
      hiddenBundleIds: prev.hiddenBundleIds.includes(bundleId)
        ? prev.hiddenBundleIds.filter(id => id !== bundleId)
        : [...prev.hiddenBundleIds, bundleId]
    }));
  };

  const handleSave = () => {
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 3000);
  };

  const themeIndigo = '#3f51b5';
  const themeIndigoLight = '#e8eaf6';

  const NotImplementedBadge = () => (
    <span style={{ 
      fontSize: '0.65rem', 
      background: '#f1f5f9', 
      color: '#64748b', 
      padding: '2px 6px', 
      borderRadius: '4px', 
      marginLeft: 'auto',
      fontWeight: 700,
      textTransform: 'uppercase'
    }}>Not Implemented</span>
  );

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)', background: '#f5f7f9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e0e6ed', padding: '2rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: themeIndigo }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          Portal Admin
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div 
            onClick={() => setCurrentTab('Catalog')}
            style={{ padding: '0.85rem 1.25rem', background: currentTab === 'Catalog' ? themeIndigoLight : 'transparent', color: currentTab === 'Catalog' ? themeIndigo : '#64748b', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Catalog Settings
          </div>
          <div 
            onClick={() => setCurrentTab('Analytics')}
            style={{ padding: '0.85rem 1.25rem', background: currentTab === 'Analytics' ? themeIndigoLight : 'transparent', color: currentTab === 'Analytics' ? themeIndigo : '#64748b', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
            Analytics
          </div>
          <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Appearance
            <NotImplementedBadge />
          </div>
          <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Domain & SSL
            <NotImplementedBadge />
          </div>
          <div style={{ padding: '0.85rem 1.25rem', borderRadius: '10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.7 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Team Access
            <NotImplementedBadge />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', position: 'relative' }}>
        {/* Banner */}
        {showBanner && (
          <div style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            background: '#059669', 
            color: 'white', 
            padding: '0.75rem 2rem', 
            borderRadius: '12px', 
            fontWeight: 600, 
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            zIndex: 1000,
            animation: 'fadeInDown 0.3s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Simulation state updated successfully
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              {currentTab === 'Catalog' ? 'Agentic Catalog Management' : 'Bundle Usage Analytics'}
            </h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.1rem' }}>
              {currentTab === 'Catalog' ? 'Curate and manage AI agent bundles for your public portal.' : 'Monitor performance and integration metrics across your agentic bundle portfolio.'}
            </p>
          </div>
          {currentTab === 'Catalog' && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a 
                href="/?persona=End Consumer" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', color: '#1e293b', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                View portal
              </a>
              <button onClick={handleSave} style={{ padding: '0.75rem 1.5rem', background: themeIndigo, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)' }}>Save Changes</button>
            </div>
          )}
        </div>

        {currentTab === 'Catalog' ? (
          <Fragment>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e0e6ed' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={themeIndigo} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Source Channel
                </h3>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Active Endpoint</label>
                <select 
                  value={config.channelUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, channelUrl: e.target.value }))}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}
                >
                  {channels.map(c => (
                    <option key={c.id} value={c.publishedUrl}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e0e6ed' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={themeIndigo} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Branding
                </h3>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Portal Display Name</label>
                <input 
                  type="text"
                  value={config.portalName}
                  onChange={(e) => setConfig(prev => ({ ...prev, portalName: e.target.value }))}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}
                />
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e0e6ed', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e0e6ed', background: '#ffffff', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                Available Agentic {channelBundles.length === 1 ? 'Bundle' : 'Bundles'} ({channelBundles.length})
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent Bundle</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catalog Visibility</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channelBundles.map(p => {
                    const isHidden = config.hiddenBundleIds.includes(p.id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>{activeChannel?.name} Output</div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>Active</span>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isHidden ? '#cbd5e1' : '#10b981' }}></div>
                            <span style={{ fontSize: '0.9rem', color: isHidden ? '#64748b' : '#1e293b' }}>{isHidden ? 'Hidden' : 'Visible'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => toggleVisibility(p.id)}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              borderRadius: '8px', 
                              border: isHidden ? 'none' : '1px solid #e2e8f0', 
                              background: isHidden ? themeIndigo : 'white', 
                              color: isHidden ? 'white' : '#1e293b',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              transition: 'all 0.2s'
                            }}
                          >
                            {isHidden ? 'Publish to Catalog' : 'Unpublish Bundle'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </Fragment>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e0e6ed', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e0e6ed', background: '#ffffff', fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
              Bundle Performance Overview
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agentic Bundle</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Requests</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approval Rate</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Integrations</th>
                    <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Avg. Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAnalytics.map(stat => (
                    <tr key={stat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.5rem 2rem' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{stat.name}</div>
                      </td>
                      <td style={{ padding: '1.5rem 2rem', color: '#1e293b' }}>{stat.totalRequests}</td>
                      <td style={{ padding: '1.5rem 2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: stat.approvalRate, background: '#10b981', borderRadius: '3px' }}></div>
                          </div>
                          <span style={{ fontSize: '0.9rem' }}>{stat.approvalRate}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem 2rem', color: '#1e293b' }}>{stat.activeIntegrations}</td>
                      <td style={{ padding: '1.5rem 2rem', textAlign: 'right', color: '#1e293b' }}>{stat.avgLatency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '2rem', background: '#f8fafc', borderTop: '1px solid #e0e6ed', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Metrics are updated in real-time based on simulation traffic within your CitC workspace.
            </div>
          </div>
        )}
      </main>
      
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};
