/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  endpoint: string;
  status: 'Draft' | 'Active' | 'Deprecated';
}

interface ToolManagerProps {
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  canEdit: boolean;
}

export const ToolManager: React.FC<ToolManagerProps> = ({tools, setTools, canEdit}) => {
  const [view, setView] = React.useState<'list' | 'create' | 'edit'>('list');
  const [currentTool, setCurrentTool] = React.useState<Tool | null>(null);

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    endpoint: '',
    status: 'Draft' as 'Draft' | 'Active' | 'Deprecated'
  });

  const handleCreate = () => {
    setView('create');
    setFormData({name: '', description: '', endpoint: '', status: 'Draft'});
  };

  const handleEdit = (tool: Tool) => {
    setCurrentTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      endpoint: tool.endpoint,
      status: tool.status
    });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      setTools(tools.filter(t => t.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];

    if (view === 'create') {
      const newTool: Tool = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        endpoint: formData.endpoint,
        status: formData.status,
        createdDate: now,
        modifiedDate: now
      };
      setTools([...tools, newTool]);
    } else if (view === 'edit' && currentTool) {
      setTools(tools.map(t => t.id === currentTool.id ? {
        ...t,
        ...formData,
        modifiedDate: now
      } : t));
    }
    setView('list');
  };

  if (view === 'list') {
    return (
      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Tools Management</h2>
          {canEdit && (
            <button 
              onClick={handleCreate}
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Create Tool
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Tool Name</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0' }}>Description</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', whiteSpace: 'nowrap' }}>Created</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', whiteSpace: 'nowrap' }}>Modified</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => (
                <tr key={tool.id} style={{ borderBottom: '1px solid #dadce0' }}>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(tool)}
                      style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {tool.name}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{tool.description}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 400,
                      backgroundColor: tool.status === 'Active' ? '#e6f4ea' : (tool.status === 'Draft' ? '#fef7e0' : '#fce8e6'),
                      color: tool.status === 'Active' ? '#1e8e3e' : (tool.status === 'Draft' ? '#f9ab00' : '#d93025')
                    }}>
                      {tool.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{tool.createdDate}</td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368', whiteSpace: 'nowrap' }}>{tool.modifiedDate}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === 'edit') handleEdit(tool);
                        if (e.target.value === 'delete') handleDelete(tool.id);
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
                      <option value="edit" disabled={!canEdit} style={{ color: !canEdit ? '#dadce0' : 'inherit' }}>Edit</option>
                      <option 
                        value="delete" 
                        disabled={!canEdit} 
                        style={{ color: !canEdit ? '#dadce0' : 'inherit' }}>Delete</option>
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
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{view === 'create' ? 'Create Tool' : (canEdit ? 'Edit Tool' : 'View Tool')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tool Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            disabled={!canEdit}
            required
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
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
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
          />
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Endpoint</label>
          <input 
            type="text" 
            value={formData.endpoint} 
            onChange={e => setFormData({...formData, endpoint: e.target.value})}
            disabled={!canEdit}
            required
            placeholder="https://api.example.com/tool"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', backgroundColor: canEdit ? '#ffffff' : '#f1f3f4' }}
          />
        </div>
        <div style={{ marginBottom: '2rem' }}>
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
