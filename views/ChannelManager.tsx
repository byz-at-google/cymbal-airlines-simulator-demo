/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {Bundle} from './BundleManager';

export interface Channel {
  id: string;
  name: string;
  description: string;
  status: 'Draft' | 'Published';
  bundles: string[];
  gtmInfo: string;
  publishedUrl?: string;
  createdDate: string;
  modifiedDate: string;
}

interface ChannelManagerProps {
  channels: Channel[];
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  bundles: Bundle[];
  canEdit: boolean;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
  channels, setChannels, bundles, canEdit
}) => {
  const [view, setView] = React.useState<'list' | 'create' | 'edit'>('list');
  const [currentChannel, setCurrentChannel] = React.useState<Channel | null>(null);

  const [formData, setFormData] = React.useState<Omit<Channel, 'id' | 'createdDate' | 'modifiedDate'>>({
    name: '',
    description: '',
    status: 'Draft',
    bundles: [],
    gtmInfo: ''
  });

  const [bundleSearchQuery, setBundleSearchQuery] = React.useState('');
  const [showBundleDropdown, setShowBundleDropdown] = React.useState(false);

  const handleCreate = () => {
    setView('create');
    setFormData({name: '', description: '', status: 'Draft', bundles: [], gtmInfo: ''});
  };

  const handleEdit = (channel: Channel) => {
    setCurrentChannel(channel);
    setFormData({
      name: channel.name,
      description: channel.description,
      status: channel.status,
      bundles: channel.bundles || [],
      gtmInfo: channel.gtmInfo || '',
      publishedUrl: channel.publishedUrl
    });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      setChannels(channels.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    
    let publishedUrl = formData.publishedUrl;
    if (formData.status === 'Published' && !publishedUrl) {
      publishedUrl = `https://api.cymbal.com/v1/channels/${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
    }

    if (view === 'create') {
      const newChannel: Channel = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        publishedUrl,
        createdDate: now,
        modifiedDate: now
      };
      setChannels([...channels, newChannel]);
    } else if (view === 'edit' && currentChannel) {
      setChannels(channels.map(c => c.id === currentChannel.id ? {
        ...c,
        ...formData,
        publishedUrl: formData.status === 'Published' ? (c.publishedUrl || publishedUrl) : undefined,
        modifiedDate: now
      } : c));
    }
    setView('list');
  };

  const toggleBundle = (bundleId: string) => {
    const updatedBundles = formData.bundles.includes(bundleId)
      ? formData.bundles.filter(id => id !== bundleId)
      : [...formData.bundles, bundleId];
    setFormData({...formData, bundles: updatedBundles});
  };

  if (view === 'list') {
    return (
      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Channels Management</h2>
          {canEdit && (
            <button 
              onClick={handleCreate}
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Create Channel
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Channel Name</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0' }}>Description</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Bundles</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0' }}>Modified</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map(channel => (
                <tr key={channel.id} style={{ borderBottom: '1px solid #dadce0' }}>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(channel)}
                      style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 500, textAlign: 'center', display: 'block', width: '100%' }}
                    >
                      {channel.name}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{channel.description}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: channel.status === 'Published' ? '#e6f4ea' : '#fef7e0',
                      color: channel.status === 'Published' ? '#1e8e3e' : '#f9ab00'
                    }}>
                      {channel.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap', fontSize: '0.9rem', textAlign: 'center' }}>
                    {channel.bundles.length} {channel.bundles.length === 1 ? 'Bundle' : 'Bundles'}
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{channel.modifiedDate}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === 'edit') handleEdit(channel);
                        if (e.target.value === 'delete') handleDelete(channel.id);
                        e.target.value = '';
                      }}
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #dadce0' }}
                    >
                      <option value="" disabled>Actions</option>
                      <option value="edit">Edit</option>
                      <option value="delete" disabled={!canEdit}>Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', padding: '2rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{view === 'create' ? 'Create Channel' : (canEdit ? 'Edit Channel' : 'View Channel')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Channel Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            disabled={!canEdit}
            required
            placeholder="e.g. North America Retail Channel"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
          <input 
            type="text" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            disabled={!canEdit}
            required
            placeholder="Describe the target storefronts and market..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Associated Bundles</label>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                minHeight: '40px', 
                padding: '0.5rem', 
                border: '1px solid #dadce0', 
                borderRadius: '4px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem',
                cursor: canEdit ? 'text' : 'default',
                backgroundColor: canEdit ? 'white' : '#f1f3f4'
              }}
              onClick={() => canEdit && setShowBundleDropdown(true)}
            >
              {formData.bundles.length === 0 && !bundleSearchQuery && <span style={{ color: '#aaa' }}>Select bundles...</span>}
              {formData.bundles.map(id => {
                const p = bundles.find(prod => prod.id === id);
                return (
                  <span key={id} style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {p?.name}
                    {canEdit && <span onClick={(e) => { e.stopPropagation(); toggleBundle(id); }} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</span>}
                  </span>
                );
              })}
              {canEdit && (
                <input 
                  type="text"
                  value={bundleSearchQuery}
                  onChange={e => {
                    setBundleSearchQuery(e.target.value);
                    setShowBundleDropdown(true);
                  }}
                  onFocus={() => setShowBundleDropdown(true)}
                  style={{ border: 'none', outline: 'none', flex: 1, minWidth: '100px', background: 'transparent' }}
                />
              )}
            </div>
            {showBundleDropdown && canEdit && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '4px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {bundles
                  .filter(p => p.name.toLowerCase().includes(bundleSearchQuery.toLowerCase()))
                  .map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        toggleBundle(p.id);
                        setBundleSearchQuery('');
                      }}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        backgroundColor: formData.bundles.includes(p.id) ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #eee'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = formData.bundles.includes(p.id) ? '#f8f9fa' : 'white')}
                    >
                      <span>{p.name}</span>
                      {formData.bundles.includes(p.id) && <span style={{ color: '#1a73e8' }}>✓</span>}
                    </div>
                  ))
                }
                {bundles.length === 0 && <div style={{ padding: '1rem', color: '#5f6368', textAlign: 'center' }}>No bundles found</div>}
              </div>
            )}
          </div>
          {showBundleDropdown && <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 90 }} onClick={() => setShowBundleDropdown(false)} />}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Go-To-Market Information</label>
          <textarea 
            rows={3}
            value={formData.gtmInfo} 
            onChange={e => setFormData({...formData, gtmInfo: e.target.value})}
            disabled={!canEdit}
            placeholder="Special positioning or launch strategy..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', resize: 'vertical', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
          <select 
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value as any})}
            disabled={!canEdit}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {formData.status === 'Published' && (
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#1e8e3e' }}>Channel API Endpoint (Public)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={formData.publishedUrl || 'Generating endpoint...'} 
                readOnly
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', backgroundColor: '#f8f9fa', color: '#5f6368', fontFamily: 'monospace' }}
              />
              <button 
                type="button" 
                onClick={() => navigator.clipboard.writeText(formData.publishedUrl || '')}
                style={{ padding: '0.6rem 1rem', background: '#f1f3f4', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer' }}
              >
                Copy
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#5f6368', marginTop: '0.5rem' }}>This endpoint is consumed by storefronts to retrieve available bundles.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {canEdit && (
            <button type="submit" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
              {view === 'create' ? 'Create Channel' : 'Save Changes'}
            </button>
          )}
          <button 
            type="button" 
            onClick={() => setView('list')}
            style={{ padding: '0.6rem 1.5rem', backgroundColor: '#fff', color: '#5f6368', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
          >
            {canEdit ? 'Cancel' : 'Back to list'}
          </button>
        </div>
      </form>
    </div>
  );
};
