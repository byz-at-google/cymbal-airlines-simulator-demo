/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {Tool} from '../app';

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  globalSemanticPolicy: string;
  toolSemanticPolicies: {[toolId: string]: string};
  status: 'Draft' | 'Active' | 'Deprecated';
}

export interface ToolProfile {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  semanticPolicy: string;
  status: 'Draft' | 'Active' | 'Deprecated';
}

interface AgentProfileManagerProps {
  profiles: AgentProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<AgentProfile[]>>;
  tools: Tool[];
  canEdit: boolean;
}

export const AgentProfileManager: React.FC<AgentProfileManagerProps> = ({profiles, setProfiles, tools, canEdit}) => {
  const [view, setView] = React.useState<'list' | 'create' | 'edit'>('list');
  const [currentProfile, setCurrentProfile] = React.useState<AgentProfile | null>(null);

  const [formData, setFormData] = React.useState<Omit<AgentProfile, 'id' | 'createdDate' | 'modifiedDate' | 'toolSemanticPolicies'>>({
    name: '',
    description: '',
    globalSemanticPolicy: '',
    status: 'Draft'
  });

  const [formRows, setFormRows] = React.useState<Array<{toolId: string, policy: string}>>([]);
  const [toolSearchQuery, setToolSearchQuery] = React.useState<{[key: number]: string}>({});
  const [showDropdown, setShowDropdown] = React.useState<number | null>(null);

  const handleCreate = () => {
    setView('create');
    setFormData({name: '', description: '', globalSemanticPolicy: '', status: 'Draft'});
    setFormRows([]);
  };

  const handleEdit = (profile: AgentProfile) => {
    setCurrentProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description,
      globalSemanticPolicy: profile.globalSemanticPolicy,
      status: profile.status
    });
    setFormRows(Object.entries(profile.toolSemanticPolicies).map(([toolId, policy]) => ({toolId, policy})));
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agent profile?')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];

    const toolSemanticPolicies: {[toolId: string]: string} = {};
    formRows.forEach(row => {
      if (row.toolId) {
        toolSemanticPolicies[row.toolId] = row.policy;
      }
    });

    const profileData = {
      ...formData,
      toolSemanticPolicies
    };

    if (view === 'create') {
      const newProfile: AgentProfile = {
        id: Math.random().toString(36).substr(2, 9),
        ...profileData,
        createdDate: now,
        modifiedDate: now
      };
      setProfiles([...profiles, newProfile]);
    } else if (view === 'edit' && currentProfile) {
      setProfiles(profiles.map(p => p.id === currentProfile.id ? {
        ...p,
        ...profileData,
        modifiedDate: now
      } : p));
    }
    setView('list');
  };

  const addRow = () => {
    setFormRows([...formRows, {toolId: '', policy: ''}]);
  };

  const removeRow = (index: number) => {
    const newRows = [...formRows];
    newRows.splice(index, 1);
    setFormRows(newRows);
  };

  const updateRow = (index: number, updates: Partial<{toolId: string, policy: string}>) => {
    const newRows = [...formRows];
    newRows[index] = {...newRows[index], ...updates};
    setFormRows(newRows);
  };

  if (view === 'list') {
    return (
      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Agent Profiles</h2>
          {canEdit && (
            <button 
              id="create-agent-profile"
              onClick={handleCreate}
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Create Agent Profile
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Profile Name</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0' }}>Description</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', whiteSpace: 'nowrap' }}>Created</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', whiteSpace: 'nowrap' }}>Modified</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id} style={{ borderBottom: '1px solid #dadce0' }}>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(profile)}
                      style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {profile.name}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{profile.description}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: profile.status === 'Active' ? '#e6f4ea' : (profile.status === 'Draft' ? '#fef7e0' : '#fce8e6'),
                      color: profile.status === 'Active' ? '#1e8e3e' : (profile.status === 'Draft' ? '#f9ab00' : '#d93025')
                    }}>
                      {profile.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{profile.createdDate}</td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{profile.modifiedDate}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === 'edit') handleEdit(profile);
                        if (e.target.value === 'delete') handleDelete(profile.id);
                        e.target.value = '';
                      }}
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '4px', 
                        border: '1px solid #dadce0', 
                        fontSize: '0.85rem', 
                        backgroundColor: '#f8f9fa', 
                        cursor: 'pointer',
                        outline: 'none',
                        opacity: !canEdit ? 0.7 : 1
                      }}
                    >
                      <option value="" disabled>Actions</option>
                      <option value="edit" disabled={!canEdit}>Edit</option>
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
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{view === 'create' ? 'Create Agent Profile' : (canEdit ? 'Edit Agent Profile' : 'View Agent Profile')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Profile Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={!canEdit}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
              <input 
                type="text" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                disabled={!canEdit}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Lifecycle Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                disabled={!canEdit}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Global Agent Semantic Governance Policy</label>
            <textarea 
              rows={5}
              value={formData.globalSemanticPolicy} 
              onChange={e => setFormData({...formData, globalSemanticPolicy: e.target.value})}
              disabled={!canEdit}
              placeholder="e.g. Always include disclaimer. Never use offensive language."
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', resize: 'vertical', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>Tool-Specific Semantic Governance Policies</h3>
            {canEdit && (
              <button 
                type="button" 
                onClick={addRow}
                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
              >
                + Add Tool-Specific Policy
              </button>
            )}
          </div>
          
          <div style={{ overflowX: 'auto', paddingBottom: formRows.length > 0 ? '160px' : '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '0.5rem', width: '30%' }}>Tool</th>
                  <th style={{ padding: '0.5rem' }}>Semantic Governance Policy</th>
                  {canEdit && <th style={{ padding: '0.5rem', width: '50px' }}></th>}
                </tr>
              </thead>
              <tbody>
                {formRows.map((row, index) => {
                  const selectedTool = tools.find(t => t.id === row.toolId);
                  const query = toolSearchQuery[index] || '';
                  const filteredTools = tools.filter(t => 
                    t.name.toLowerCase().includes(query.toLowerCase()) &&
                    !formRows.some((r, i) => i !== index && r.toolId === t.id)
                  ).slice(0, 50);

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.5rem', position: 'relative', zIndex: showDropdown === index ? 10 : 1 }}>
                        <input 
                          type="text"
                          placeholder={selectedTool ? selectedTool.name : "Search tool..."}
                          value={query}
                          onChange={e => {
                            setToolSearchQuery({...toolSearchQuery, [index]: e.target.value});
                            setShowDropdown(index);
                          }}
                          onFocus={() => setShowDropdown(index)}
                          disabled={!canEdit}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
                        />
                        {showDropdown === index && (
                          <div style={{ position: 'absolute', top: '100%', left: '0.5rem', right: '0.5rem', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {filteredTools.map(t => (
                              <div 
                                key={t.id}
                                onClick={() => {
                                  updateRow(index, {toolId: t.id});
                                  setToolSearchQuery({...toolSearchQuery, [index]: ''});
                                  setShowDropdown(null);
                                }}
                                style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                {t.name}
                              </div>
                            ))}
                            {filteredTools.length === 0 && <div style={{ padding: '0.5rem', color: '#999' }}>No tools found</div>}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input 
                          type="text"
                          value={row.policy}
                          onChange={e => updateRow(index, {policy: e.target.value})}
                          disabled={!canEdit}
                          placeholder={selectedTool ? `Governance policy for ${selectedTool.name}...` : "Select a tool first"}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
                        />
                      </td>
                      {canEdit && (
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <button 
                            type="button" 
                            onClick={() => removeRow(index)}
                            style={{ background: 'none', border: 'none', color: '#d93025', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
                          >&times;</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {formRows.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 3 : 2} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                      No tool-specific policies defined. Click "+ Add Tool-Specific Policy" to specify one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {canEdit && (
            <button type="submit" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
              {view === 'create' ? 'Create' : 'Save Changes'}
            </button>
          )}
          <button 
            type="button" 
            onClick={() => { setView('list'); setShowDropdown(null); }}
            style={{ padding: '0.6rem 1.5rem', backgroundColor: '#fff', color: '#5f6368', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
          >
            {canEdit ? 'Cancel' : 'Back to list'}
          </button>
        </div>
      </form>
      {showDropdown !== null && (
        <div 
          onClick={() => setShowDropdown(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }} 
        />
      )}
    </div>
  );
};

interface ToolProfileManagerProps {
  profiles: ToolProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<ToolProfile[]>>;
  canEdit: boolean;
}

export const ToolProfileManager: React.FC<ToolProfileManagerProps> = ({profiles, setProfiles, canEdit}) => {
  const [view, setView] = React.useState<'list' | 'create' | 'edit'>('list');
  const [currentProfile, setCurrentProfile] = React.useState<ToolProfile | null>(null);

  const [formData, setFormData] = React.useState<Omit<ToolProfile, 'id' | 'createdDate' | 'modifiedDate'>>({
    name: '',
    description: '',
    semanticPolicy: '',
    status: 'Draft'
  });

  const handleCreate = () => {
    setView('create');
    setFormData({name: '', description: '', semanticPolicy: '', status: 'Draft'});
  };

  const handleEdit = (profile: ToolProfile) => {
    setCurrentProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description,
      semanticPolicy: profile.semanticPolicy,
      status: profile.status
    });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tool profile?')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];

    if (view === 'create') {
      const newProfile: ToolProfile = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdDate: now,
        modifiedDate: now
      };
      setProfiles([...profiles, newProfile]);
    } else if (view === 'edit' && currentProfile) {
      setProfiles(profiles.map(p => p.id === currentProfile.id ? {
        ...p,
        ...formData,
        modifiedDate: now
      } : p));
    }
    setView('list');
  };

  if (view === 'list') {
    return (
      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Tool Profiles</h2>
          {canEdit && (
            <button 
              onClick={handleCreate}
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Create Tool Profile
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Profile Name</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0' }}>Description</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', whiteSpace: 'nowrap' }}>Created</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', whiteSpace: 'nowrap' }}>Modified</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 500, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id} style={{ borderBottom: '1px solid #dadce0' }}>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(profile)}
                      style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {profile.name}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{profile.description}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: profile.status === 'Active' ? '#e6f4ea' : (profile.status === 'Draft' ? '#fef7e0' : '#fce8e6'),
                      color: profile.status === 'Active' ? '#1e8e3e' : (profile.status === 'Draft' ? '#f9ab00' : '#d93025')
                    }}>
                      {profile.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{profile.createdDate}</td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{profile.modifiedDate}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === 'edit') handleEdit(profile);
                        if (e.target.value === 'delete') handleDelete(profile.id);
                        e.target.value = '';
                      }}
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '4px', 
                        border: '1px solid #dadce0', 
                        fontSize: '0.85rem', 
                        backgroundColor: '#f8f9fa', 
                        cursor: 'pointer',
                        outline: 'none',
                        opacity: !canEdit ? 0.7 : 1
                      }}
                    >
                      <option value="" disabled>Actions</option>
                      <option value="edit" disabled={!canEdit}>Edit</option>
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
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{view === 'create' ? 'Create Tool Profile' : (canEdit ? 'Edit Tool Profile' : 'View Tool Profile')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Profile Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={!canEdit}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
              <input 
                type="text" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                disabled={!canEdit}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Lifecycle Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                disabled={!canEdit}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tool Semantic Governance Policy</label>
            <textarea 
              rows={5}
              value={formData.semanticPolicy} 
              onChange={e => setFormData({...formData, semanticPolicy: e.target.value})}
              disabled={!canEdit}
              placeholder="e.g. Always include usage limit disclaimer."
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', resize: 'vertical', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {canEdit && (
            <button type="submit" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
              {view === 'create' ? 'Create' : 'Save Changes'}
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
