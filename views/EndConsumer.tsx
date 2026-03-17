/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment, useState} from 'react';
import * as React from 'react';
import {StorefrontConfig, Channel, Product, ConsumerApp} from '../app';

interface EndConsumerProps {
  config: StorefrontConfig;
  channels: Channel[];
  products: Product[];
  consumerApps: ConsumerApp[];
  setConsumerApps: React.Dispatch<React.SetStateAction<ConsumerApp[]>>;
}

export const EndConsumer: React.FC<EndConsumerProps> = ({
  config, channels, products, consumerApps, setConsumerApps
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showMyIntegrations, setShowMyIntegrations] = useState(false);
  const [showAppForm, setShowAppForm] = useState(false);
  const [appFormData, setAppFormData] = useState({
    name: '',
    description: '',
    semanticPolicy: '',
    submitterName: 'John Doe',
    submitterEmail: 'john.doe@cymbal.com',
    productIds: [] as string[]
  });
  const [userData, setUserData] = useState({ name: 'John Doe', email: 'john.doe@cymbal.com' });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  const activeChannel = channels.find(c => c.publishedUrl === config.channelUrl) || channels[0];
  const visibleProducts = products.filter(p => 
    activeChannel?.products.includes(p.id) && !config.hiddenProductIds.includes(p.id)
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const name = target.elements.devName.value;
    const email = target.elements.devEmail.value;
    setUserData({ name, email });
    setAppFormData(prev => ({ ...prev, submitterName: name, submitterEmail: email }));
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowLogoutMessage(false);
  };

  const themeIndigo = '#3f51b5';

  const handleEditApp = (app: ConsumerApp) => {
    setEditingAppId(app.id);
    setAppFormData({
      name: app.name,
      description: app.description,
      semanticPolicy: app.semanticPolicy || '',
      submitterName: app.submitterName,
      submitterEmail: app.submitterEmail,
      productIds: app.productIds
    });
    setSubmissionSuccess(false);
    setShowAppForm(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Google Sans', Roboto, sans-serif" }}>
      {/* Header */}
      <header style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: themeIndigo, fontWeight: 400, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          {config.portalName}
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '1.75rem', fontWeight: 400, fontSize: '0.95rem' }}>
            <div onClick={() => { setSelectedProductId(null); setShowMyIntegrations(false); }} style={{ cursor: 'pointer', color: (!selectedProductId && !showMyIntegrations) ? themeIndigo : '#64748b' }}>Agentic Products</div>
            <div onClick={() => setShowMyIntegrations(true)} style={{ cursor: 'pointer', color: showMyIntegrations ? themeIndigo : '#64748b' }}>My Profile</div>
            <div style={{ cursor: 'pointer', color: '#64748b' }}>Solutions</div>
            <div style={{ cursor: 'pointer', color: '#64748b' }}>Docs</div>
          </nav>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: themeIndigo, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>{userData.name.split(' ').map(n => n[0]).join('')}</div>
              <button onClick={() => setShowLogoutMessage(true)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 400, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit' }}>Log out</button>
              
              {showLogoutMessage && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '1rem', background: '#1e293b', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', whiteSpace: 'nowrap', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>Logout is disabled for this demo session.</span>
                  <button onClick={() => setShowLogoutMessage(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' }}>Got it</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ padding: '0.75rem 1.5rem', background: themeIndigo, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 400, cursor: 'pointer', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)' }}>Get Started</button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '8rem 5rem', textAlign: 'center', background: 'radial-gradient(circle at top right, #eef2ff, #ffffff)' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#eef2ff', color: themeIndigo, borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          The Future of Airline Automation
        </div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Unlock Next-Gen <span style={{ color: themeIndigo }}>Agentic</span> Intelligence
        </h1>
        <p style={{ fontSize: '1.4rem', color: '#64748b', maxWidth: '800px', margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
          Deploy sophisticated AI agents designed to handle complex airline workflows, from personalized travel planning to autonomous fleet logistics.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button 
            onClick={() => document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '1rem 2.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 400, cursor: 'pointer', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.15)' }}
          >Explore Agents</button>
          <button style={{ padding: '1rem 2.5rem', background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 400, cursor: 'pointer' }}>Watch Demo</button>
        </div>
      </section>

      {/* Agent Listing */}
      <section id="product-catalog" style={{ padding: '6rem 5rem', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>Agentic Product Catalog</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Browse our production-ready agents for the aviation industry.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search for agents..." style={{ padding: '1rem 1.5rem', paddingLeft: '3.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', width: '350px', outline: 'none', fontSize: '1rem', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
            <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {showMyIntegrations ? (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '3rem', borderRadius: '32px', color: 'white', marginBottom: '3rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: themeIndigo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 400 }}>{userData.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 400, margin: 0 }}>{userData.name}</h2>
                  <p style={{ fontSize: '1.2rem', color: '#94a3b8', margin: '0.5rem 0 0' }}>{userData.email}</p>
                </div>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.75rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem' }}>My Consumer Applications</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {consumerApps.filter(app => app.submitterEmail === userData.email).map(app => (
                <div key={app.id} style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{app.name}</h3>
                    <p style={{ color: '#64748b', margin: '0 0 1rem' }}>{app.description}</p>
                    {app.semanticPolicy && (
                      <div style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', borderLeft: `3px solid ${themeIndigo}` }}>
                        <span style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Semantic Governance Policy</span>
                        {app.semanticPolicy}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 400 }}>Products:</span>
                      {app.productIds.map(pid => (
                        <span key={pid} style={{ color: themeIndigo, background: '#eef2ff', padding: '2px 8px', borderRadius: '6px' }}>
                          {products.find(p => p.id === pid)?.name || pid}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem', 
                      fontWeight: 400,
                      background: app.status === 'Approved' ? '#ecfdf5' : app.status === 'Denied' ? '#fef2f2' : '#fffbeb',
                      color: app.status === 'Approved' ? '#059669' : app.status === 'Denied' ? '#dc2626' : '#d97706'
                    }}>
                      {app.status}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Submitted: {app.createdDate}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => handleEditApp(app)}
                      style={{ background: 'white', border: `1px solid ${themeIndigo}`, color: themeIndigo, padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 400 }}
                    >
                      Edit Application
                    </button>
                  </div>
                </div>
              ))}
              {consumerApps.filter(app => app.submitterEmail === userData.email).length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', background: '#ffffff', borderRadius: '24px', border: '2px dashed #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM20 12l2 1-10 5-10-5 2-1"></path><path d="M2 17l10 5 10-5"></path></svg>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>No Integrations Yet</h3>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>You haven't requested any agentic product integrations. Browse the catalog to get started.</p>
                  <button 
                    onClick={() => { setShowMyIntegrations(false); setSelectedProductId(null); }}
                    style={{ padding: '0.75rem 2rem', background: themeIndigo, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 400, cursor: 'pointer' }}
                  >
                    Browse Agentic Products
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : selectedProductId ? (
          (() => {
            const p = products.find(prod => prod.id === selectedProductId);
            if (!p) return null;
            return (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button 
                  onClick={() => setSelectedProductId(null)}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 400, cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  ← Back to Catalog
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
                  <div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>{p.name}</h2>
                    <p style={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.6, marginBottom: '3rem' }}>{p.description}</p>
                    
                    <div style={{ marginBottom: '4rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '1.5rem', color: '#0f172a' }}>Technical Specification</h3>
                      <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', fontSize: '1.05rem', lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-wrap' }}>
                        {p.technicalSpec || "This advanced agentic product utilizes autonomous reasoning and tool-coordinated workflows to process dynamic airline operational data. It features low-latency response cycles and built-in governance compliance for enterprise-grade deployments."}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '32px', position: 'sticky', top: '100px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: '1rem', color: '#0f172a' }}>Ready to deploy?</h4>
                      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>Start the integration process by requesting a consumer application credentials.</p>
                      <button 
                        onClick={() => {
                          if (!isLoggedIn) setShowLogin(true);
                          else {
                            setAppFormData(prev => ({...prev, productIds: [p.id]}));
                            setShowAppForm(true);
                          }
                        }}
                        style={{ width: '100%', padding: '1rem', background: themeIndigo, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)' }}
                      >
                        Create Consumer App for Access
                      </button>
                      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          Governance Approved
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                          Dedicated Support
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
              {visibleProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProductId(p.id)}
                  style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} 
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = themeIndigo; }} 
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: '#eef2ff', color: themeIndigo, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '1rem' }}>{p.name}</h3>
                  <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: '1.7', marginBottom: '2.5rem', minHeight: '5.1rem' }}>
                    {p.description || "Sophisticated agentic product designed to optimize airline operations and customer engagement through autonomous reasoning."}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    <span style={{ color: themeIndigo }}>View Agent Details →</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', color: '#475569', fontSize: '0.75rem' }}>Production</span>
                    </div>
                  </div>
                </div>
              ))}
              {visibleProducts.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8rem', color: '#64748b', background: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No Agents Available</h3>
                  <p>This portal is not currently serving any agentic products.</p>
                </div>
              )}
            </div>
        )}
      </section>

      {/* Integration Request Modal */}
      {showAppForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '3.5rem', borderRadius: '32px', width: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            {submissionSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1rem' }}>Request Submitted</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  Your integration request for <strong>{appFormData.productIds.length > 1 ? `${appFormData.productIds.length} products` : products.find(p => p.id === appFormData.productIds[0])?.name}</strong> has been sent to the Product Owner for approval.
                </p>
                <button 
                  onClick={() => { setShowAppForm(false); setSubmissionSuccess(false); setShowMyIntegrations(true); setSelectedProductId(null); setEditingAppId(null); }}
                  style={{ width: '100%', padding: '1rem', background: themeIndigo, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  Track My Requests
                </button>
              </div>
            ) : (
              <Fragment>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (editingAppId) {
                  setConsumerApps(prev => prev.map(app => 
                    app.id === editingAppId 
                      ? { ...app, name: appFormData.name, description: appFormData.description, semanticPolicy: appFormData.semanticPolicy, productIds: appFormData.productIds, status: 'Pending' }
                      : app
                  ));
                } else {
                  const newApp: ConsumerApp = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: appFormData.name,
                    description: appFormData.description,
                    semanticPolicy: appFormData.semanticPolicy,
                    productIds: appFormData.productIds,
                    submitterName: appFormData.submitterName,
                    submitterEmail: appFormData.submitterEmail,
                    status: 'Pending',
                    createdDate: new Date().toISOString().split('T')[0]
                  };
                  setConsumerApps(prev => [...prev, newApp]);
                }
                setSubmissionSuccess(true);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <h3 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {editingAppId ? 'Edit Consumer App' : 'Create Consumer App'}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                {editingAppId ? 'Update your application details and requested products.' : 'Define your consumer application to request access to the Agentic Product.'}
              </p>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Application Name</label>
                    <input type="text" required value={appFormData.name} onChange={e => setAppFormData({...appFormData, name: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} placeholder="My Travel Assistant" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Use Case Description</label>
                    <textarea required value={appFormData.description} onChange={e => setAppFormData({...appFormData, description: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem', minHeight: '80px', resize: 'vertical' }} placeholder="Explain how you plan to use this agent..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Requested Agentic Products (Select at least one)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: '150px', overflowY: 'auto' }}>
                      {visibleProducts.map(p => (
                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input 
                            type="checkbox" 
                            checked={appFormData.productIds.includes(p.id)} 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAppFormData({...appFormData, productIds: [...appFormData.productIds, p.id]});
                              } else {
                                setAppFormData({...appFormData, productIds: appFormData.productIds.filter(id => id !== p.id)});
                              }
                            }}
                          />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Usage Semantic Governance Policy</label>
                    <textarea value={appFormData.semanticPolicy} onChange={e => setAppFormData({...appFormData, semanticPolicy: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem', minHeight: '80px', resize: 'vertical' }} placeholder="Specify the semantic governance policy for agent usage (e.g. 'Only allow flight lookups for US domestic routes')..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Contact Name</label>
                      <input type="text" required value={appFormData.submitterName} onChange={e => setAppFormData({...appFormData, submitterName: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} placeholder="Your Name" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Contact Email</label>
                      <input type="email" required value={appFormData.submitterEmail} onChange={e => setAppFormData({...appFormData, submitterEmail: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} placeholder="email@example.com" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="submit"
                      disabled={appFormData.productIds.length === 0}
                      style={{ width: '100%', padding: '1.25rem', background: appFormData.productIds.length > 0 ? themeIndigo : '#94a3b8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: appFormData.productIds.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                    >
                      {editingAppId ? 'Save and Resubmit' : 'Submit Request'}
                    </button>
                    {editingAppId && (
                      <button 
                        type="button"
                        onClick={() => { setShowAppForm(false); setEditingAppId(null); }}
                        style={{ width: '100%', marginTop: '1rem', background: 'transparent', color: '#64748b', border: 'none', fontWeight: 400, cursor: 'pointer' }}
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>
                </form>
              </Fragment>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: '6rem 5rem', background: '#0f172a', color: '#94a3b8' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', paddingBottom: '5rem', borderBottom: '1px solid #1e293b' }}>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 400, fontSize: '1.4rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={themeIndigo} strokeWidth="3">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              {config.portalName}
            </div>
            <p style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>The premier ecosystem for aviation intelligence. Empowering developers to build the next generation of autonomous flight services.</p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '2rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ecosystem</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontWeight: 400 }}>
              <li style={{ cursor: 'pointer' }}>Search Agents</li>
              <li style={{ cursor: 'pointer' }}>Marketplace</li>
              <li style={{ cursor: 'pointer' }}>Developer Hub</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '2rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontWeight: 400 }}>
              <li style={{ cursor: 'pointer' }}>Network Status</li>
              <li style={{ cursor: 'pointer' }}>API Reference</li>
              <li style={{ cursor: 'pointer' }}>Security</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '2rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontWeight: 400 }}>
              <li style={{ cursor: 'pointer' }}>Community</li>
              <li style={{ cursor: 'pointer' }}>Events</li>
              <li style={{ cursor: 'pointer' }}>Blog</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '3rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>© 2026 Cymbal Airlines Agentic Portal. All autonomous rights reserved.</span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '3.5rem', borderRadius: '32px', width: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Join the Ecosystem</h3>
            <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>Start building with our elite suite of airline agents.</p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Work Email</label>
                <input type="email" name="devEmail" required style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} placeholder="john.doe@cymbal.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Developer Name</label>
                <input type="text" name="devName" required style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem' }} placeholder="John Doe" />
              </div>
              <button type="submit" style={{ padding: '1rem', background: themeIndigo, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '1.5rem', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)' }}>Create Developer Account</button>
              <button onClick={() => setShowLogin(false)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 400, cursor: 'pointer', fontSize: '0.95rem' }}>Maybe later</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
