/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment, useState} from 'react';
import * as React from 'react';
import {ConsumerApp, Product} from '../app';

interface ConsumerAppManagerProps {
  consumerApps: ConsumerApp[];
  products: Product[];
  onUpdateStatus: (id: string, status: 'Pending' | 'Approved' | 'Denied') => void;
}

export const ConsumerAppManager: React.FC<ConsumerAppManagerProps> = ({
  consumerApps, products, onUpdateStatus
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const selectedApp = consumerApps.find(a => a.id === selectedAppId);

  if (selectedApp) {
    const selectedProducts = products.filter(p => selectedApp.productIds.includes(p.id));
    return (
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', fontFamily: "'Google Sans', Roboto, sans-serif" }}>
        <button 
          onClick={() => setSelectedAppId(null)}
          style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400, fontFamily: 'inherit' }}
        >
          ← Back to Requests
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 400 }}>{selectedApp.name}</h2>
            <div style={{ marginTop: '0.5rem', color: '#5f6368' }}>Submitted by {selectedApp.submitterName} ({selectedApp.submitterEmail})</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => onUpdateStatus(selectedApp.id, 'Approved')}
              style={{ 
                padding: '0.6rem 1.5rem', 
                backgroundColor: selectedApp.status === 'Approved' ? '#1e8e3e' : '#fff', 
                color: selectedApp.status === 'Approved' ? '#fff' : '#1e8e3e',
                border: '1px solid #1e8e3e', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontWeight: 400,
                fontFamily: 'inherit'
              }}
            >
              Approve
            </button>
            <button 
              onClick={() => onUpdateStatus(selectedApp.id, 'Denied')}
              style={{ 
                padding: '0.6rem 1.5rem', 
                backgroundColor: selectedApp.status === 'Denied' ? '#d93025' : '#fff', 
                color: selectedApp.status === 'Denied' ? '#fff' : '#d93025',
                border: '1px solid #d93025', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontWeight: 400,
                fontFamily: 'inherit'
              }}
            >
              Deny
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#5f6368', textTransform: 'uppercase', fontWeight: 400 }}>Application Details</h4>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#5f6368', marginBottom: '0.25rem' }}>Use Case Description</div>
              <div style={{ fontSize: '1rem', color: '#202124' }}>{selectedApp.description}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#5f6368', marginBottom: '0.5rem' }}>Requested Products ({selectedProducts.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedProducts.map(p => (
                  <div key={p.id} style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'white', 
                    borderRadius: '6px', 
                    border: '1px solid #dadce0',
                    fontSize: '0.9rem',
                    color: '#202124'
                  }}>
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#5f6368', textTransform: 'uppercase', fontWeight: 400 }}>Request Status</h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#5f6368', marginBottom: '0.25rem' }}>Current Status</div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '12px', 
                fontSize: '0.75rem', 
                fontWeight: 400,
                backgroundColor: selectedApp.status === 'Approved' ? '#e6f4ea' : (selectedApp.status === 'Denied' ? '#fce8e6' : '#fef7e0'),
                color: selectedApp.status === 'Approved' ? '#1e8e3e' : (selectedApp.status === 'Denied' ? '#d93025' : '#f9ab00')
              }}>
                {selectedApp.status}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#5f6368', marginBottom: '0.25rem' }}>Date Submitted</div>
              <div style={{ fontSize: '1rem', color: '#202124' }}>{selectedApp.createdDate}</div>
            </div>
          </div>
          <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#5f6368', textTransform: 'uppercase', fontWeight: 400 }}>Usage Semantic Governance Policy</h4>
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '1rem', color: '#202124', lineHeight: 1.6, minHeight: '100px' }}>
              {selectedApp.semanticPolicy ? selectedApp.semanticPolicy : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No specific policy provided.</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(60,64,67,.3)', fontFamily: "'Google Sans', Roboto, sans-serif" }}>
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400, marginBottom: '1.5rem' }}>Consumer App Requests</h2>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', width: '25%' }}>App Name (Use Case)</th>
              <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', width: '20%' }}>Submitter</th>
              <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', width: '30%' }}>Requested Products</th>
              <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'center', width: '10%' }}>Status</th>
              <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'right', width: '15%' }}>Review</th>
            </tr>
          </thead>
          <tbody>
            {consumerApps.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid #dadce0' }}>
                <td style={{ padding: '1rem 2rem' }}>
                  <button 
                    onClick={() => setSelectedAppId(app.id)}
                    style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 400, fontSize: 'inherit', textAlign: 'left', fontFamily: 'inherit', display: 'block' }}
                  >
                    {app.name}
                  </button>
                  <div style={{ fontSize: '0.75rem', color: '#5f6368', marginTop: '0.25rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.description}
                  </div>
                </td>
                <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{app.submitterName}</td>
                <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {app.productIds.map(pid => {
                      const p = products.find(prod => prod.id === pid);
                      return (
                        <span key={pid} style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 8px', 
                          background: '#f1f3f4', 
                          borderRadius: '10px',
                          border: '1px solid #dadce0'
                        }}>
                          {p?.name || pid}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 400,
                    backgroundColor: app.status === 'Approved' ? '#e6f4ea' : (app.status === 'Denied' ? '#fce8e6' : '#fef7e0'),
                    color: app.status === 'Approved' ? '#1e8e3e' : (app.status === 'Denied' ? '#d93025' : '#f9ab00')
                  }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => setSelectedAppId(app.id)}
                    style={{ 
                      padding: '0.4rem 1rem', 
                      backgroundColor: 'transparent', 
                      color: '#1a73e8',
                      border: '1px solid #dadce0', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontWeight: 400,
                      fontSize: '0.85rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
