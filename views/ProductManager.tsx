/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import {createElement, Fragment} from 'react';
import * as React from 'react';
import {Agent} from '../app';
import {Tool} from './ToolManager';
import {AgentProfile, ToolProfile} from './ProfileManager';

export interface Product {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  agents: Array<{agentId: string, profileId: string}>;
  tools: Array<{toolId: string, profileId: string}>;
  gtmCharacteristics: string;
  technicalSpec: string;
  useCases: string;
  status: 'Draft' | 'Active' | 'Deprecated';
}

interface ProductManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  agents: Agent[];
  agentProfiles: AgentProfile[];
  tools: Tool[];
  toolProfiles: ToolProfile[];
  canEdit: boolean;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products, setProducts, agents, agentProfiles, tools, toolProfiles, canEdit
}) => {
  const [view, setView] = React.useState<'list' | 'create' | 'edit'>('list');
  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(null);

  const [formData, setFormData] = React.useState<Omit<Product, 'id' | 'createdDate' | 'modifiedDate'>>({
    name: '',
    description: '',
    agents: [],
    tools: [],
    gtmCharacteristics: '',
    technicalSpec: '',
    useCases: '',
    status: 'Draft'
  });
  
  const [agentSearchQuery, setAgentSearchQuery] = React.useState<{[key: number]: string}>({});
  const [agentProfileSearchQuery, setAgentProfileSearchQuery] = React.useState<{[key: number]: string}>({});
  const [toolSearchQuery, setToolSearchQuery] = React.useState<{[key: number]: string}>({});
  const [toolProfileSearchQuery, setToolProfileSearchQuery] = React.useState<{[key: number]: string}>({});
  const [showDropdown, setShowDropdown] = React.useState<{type: 'agent'|'agentProfile'|'tool'|'toolProfile', index: number} | null>(null);

  const handleCreate = () => {
    setView('create');
    setFormData({name: '', description: '', agents: [], tools: [], gtmCharacteristics: '', technicalSpec: '', useCases: '', status: 'Draft'});
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      agents: product.agents || [],
      tools: product.tools || [],
      gtmCharacteristics: product.gtmCharacteristics || '',
      technicalSpec: product.technicalSpec || '',
      useCases: product.useCases || '',
      status: product.status
    });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];

    if (view === 'create') {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdDate: now,
        modifiedDate: now
      };
      setProducts([...products, newProduct]);
    } else if (view === 'edit' && currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? {
        ...p,
        ...formData,
        modifiedDate: now
      } : p));
    }
    setView('list');
  };

  const addAgentRow = () => {
    setFormData({
        ...formData,
        agents: [...formData.agents, {agentId: '', profileId: ''}]
    });
  };

  const updateAgentRow = (index: number, field: 'agentId' | 'profileId', value: string) => {
    const updatedAgents = [...formData.agents];
    updatedAgents[index] = {...updatedAgents[index], [field]: value};
    setFormData({...formData, agents: updatedAgents});
  };

  const removeAgentRow = (index: number) => {
    setFormData({
        ...formData,
        agents: formData.agents.filter((_, i) => i !== index)
    });
  };

  const addToolRow = () => {
    setFormData({
        ...formData,
        tools: [...formData.tools, {toolId: '', profileId: ''}]
    });
  };

  const updateToolRow = (index: number, field: 'toolId' | 'profileId', value: string) => {
    const updatedTools = [...formData.tools];
    updatedTools[index] = {...updatedTools[index], [field]: value};
    setFormData({...formData, tools: updatedTools});
  };

  const removeToolRow = (index: number) => {
    setFormData({
        ...formData,
        tools: formData.tools.filter((_, i) => i !== index)
    });
  };

  if (view === 'list') {
    return (
      <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Products Management</h2>
          {canEdit && (
            <button 
              onClick={handleCreate}
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Create Product
            </button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0' }}>Product Name</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0' }}>Description</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0' }}>Created</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0' }}>Modified</th>
                <th style={{ padding: '1rem 2rem', fontWeight: 400, borderBottom: '1px solid #dadce0', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #dadce0' }}>
                  <td style={{ padding: '1rem 2rem' }}>
                    <button 
                      onClick={() => handleEdit(product)}
                      style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {product.name}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{product.description}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 400,
                      backgroundColor: product.status === 'Active' ? '#e6f4ea' : (product.status === 'Draft' ? '#fef7e0' : '#fce8e6'),
                      color: product.status === 'Active' ? '#1e8e3e' : (product.status === 'Draft' ? '#f9ab00' : '#d93025')
                    }}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{product.createdDate}</td>
                  <td style={{ padding: '1rem 2rem', color: '#5f6368' }}>{product.modifiedDate}</td>
                  <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value === 'edit') handleEdit(product);
                        if (e.target.value === 'delete') handleDelete(product.id);
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
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{view === 'create' ? 'Create Product' : (canEdit ? 'Edit Product' : 'View Product')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Product Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            disabled={!canEdit}
            required
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0' }}
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
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Agents & Profiles</label>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.5rem', minWidth: '600px' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid #dadce0' }}>Agent</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #dadce0' }}>Agent Profile</th>
                  {canEdit && <th style={{ padding: '0.5rem', border: '1px solid #dadce0', width: '50px' }}></th>}
                </tr>
              </thead>
              <tbody>
                {formData.agents.map((row, idx) => {
                  const selectedAgent = agents.find(a => a.id === row.agentId);
                  const selectedProfile = agentProfiles.find(p => p.id === row.profileId);
                  const agentQuery = agentSearchQuery[idx] || '';
                  const profileQuery = agentProfileSearchQuery[idx] || '';
                  
                  const filteredAgents = agents.filter(a => 
                    a.name.toLowerCase().includes(agentQuery.toLowerCase()) &&
                    !formData.agents.some((ag, i) => i !== idx && ag.agentId === a.id)
                  ).slice(0, 50);
                  const filteredProfiles = agentProfiles.filter(p => p.name.toLowerCase().includes(profileQuery.toLowerCase())).slice(0, 50);

                  return (
                    <tr key={idx}>
                      <td style={{ padding: '0.5rem', border: '1px solid #dadce0', position: 'relative', zIndex: showDropdown?.type === 'agent' && showDropdown?.index === idx ? 10 : 1 }}>
                        <input 
                          type="text"
                          placeholder={selectedAgent ? selectedAgent.name : "Search agent..."}
                          value={agentQuery}
                          onChange={e => {
                            setAgentSearchQuery({...agentSearchQuery, [idx]: e.target.value});
                            setShowDropdown({type: 'agent', index: idx});
                          }}
                          onFocus={() => setShowDropdown({type: 'agent', index: idx})}
                          disabled={!canEdit}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box' }}
                        />
                        {showDropdown?.type === 'agent' && showDropdown?.index === idx && agentQuery && (
                          <div style={{ position: 'absolute', top: '100%', left: '0.5rem', right: '0.5rem', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {filteredAgents.map(a => (
                              <div 
                                key={a.id}
                                onClick={() => {
                                  updateAgentRow(idx, 'agentId', a.id);
                                  setAgentSearchQuery({...agentSearchQuery, [idx]: ''});
                                  setShowDropdown(null);
                                }}
                                style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                {a.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #dadce0', position: 'relative', zIndex: showDropdown?.type === 'agentProfile' && showDropdown?.index === idx ? 10 : 1 }}>
                        <input 
                          type="text"
                          placeholder={selectedProfile ? selectedProfile.name : "Search profile..."}
                          value={profileQuery}
                          onChange={e => {
                            setAgentProfileSearchQuery({...agentProfileSearchQuery, [idx]: e.target.value});
                            setShowDropdown({type: 'agentProfile', index: idx});
                          }}
                          onFocus={() => setShowDropdown({type: 'agentProfile', index: idx})}
                          disabled={!canEdit}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box' }}
                        />
                        {showDropdown?.type === 'agentProfile' && showDropdown?.index === idx && profileQuery && (
                          <div style={{ position: 'absolute', top: '100%', left: '0.5rem', right: '0.5rem', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {filteredProfiles.map(p => (
                              <div 
                                key={p.id}
                                onClick={() => {
                                  updateAgentRow(idx, 'profileId', p.id);
                                  setAgentProfileSearchQuery({...agentProfileSearchQuery, [idx]: ''});
                                  setShowDropdown(null);
                                }}
                                style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                {p.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      {canEdit && (
                        <td style={{ padding: '0.5rem', border: '1px solid #dadce0', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeAgentRow(idx)} style={{ color: '#ea4335', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {canEdit && <button type="button" onClick={addAgentRow} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer' }}>+ Add Agent</button>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tools & Profiles</label>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.5rem', minWidth: '600px' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid #dadce0' }}>Tool</th>
                  <th style={{ padding: '0.5rem', border: '1px solid #dadce0' }}>Tool Profile</th>
                  {canEdit && <th style={{ padding: '0.5rem', border: '1px solid #dadce0', width: '50px' }}></th>}
                </tr>
              </thead>
              <tbody>              {formData.tools.map((row, idx) => {
                  const selectedTool = tools.find(t => t.id === row.toolId);
                  const selectedProfile = toolProfiles.find(p => p.id === row.profileId);
                  const toolQuery = toolSearchQuery[idx] || '';
                  const profileQuery = toolProfileSearchQuery[idx] || '';

                  const filteredTools = tools.filter(t => 
                    t.name.toLowerCase().includes(toolQuery.toLowerCase()) &&
                    !formData.tools.some((to, i) => i !== idx && to.toolId === t.id)
                  ).slice(0, 50);
                  const filteredProfiles = toolProfiles.filter(p => p.name.toLowerCase().includes(profileQuery.toLowerCase())).slice(0, 50);

                  return (
                    <tr key={idx}>
                      <td style={{ padding: '0.5rem', border: '1px solid #dadce0', position: 'relative', zIndex: showDropdown?.type === 'tool' && showDropdown?.index === idx ? 10 : 1 }}>
                        <input 
                          type="text"
                          placeholder={selectedTool ? selectedTool.name : "Search tool..."}
                          value={toolQuery}
                          onChange={e => {
                            setToolSearchQuery({...toolSearchQuery, [idx]: e.target.value});
                            setShowDropdown({type: 'tool', index: idx});
                          }}
                          onFocus={() => setShowDropdown({type: 'tool', index: idx})}
                          disabled={!canEdit}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box' }}
                        />
                        {showDropdown?.type === 'tool' && showDropdown?.index === idx && toolQuery && (
                          <div style={{ position: 'absolute', top: '100%', left: '0.5rem', right: '0.5rem', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {filteredTools.map(t => (
                              <div 
                                key={t.id}
                                onClick={() => {
                                  updateToolRow(idx, 'toolId', t.id);
                                  setToolSearchQuery({...toolSearchQuery, [idx]: ''});
                                  setShowDropdown(null);
                                }}
                                style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                {t.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid #dadce0', position: 'relative', zIndex: showDropdown?.type === 'toolProfile' && showDropdown?.index === idx ? 10 : 1 }}>
                        <input 
                          type="text"
                          placeholder={selectedProfile ? selectedProfile.name : "Search profile..."}
                          value={profileQuery}
                          onChange={e => {
                            setToolProfileSearchQuery({...toolProfileSearchQuery, [idx]: e.target.value});
                            setShowDropdown({type: 'toolProfile', index: idx});
                          }}
                          onFocus={() => setShowDropdown({type: 'toolProfile', index: idx})}
                          disabled={!canEdit}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box' }}
                        />
                        {showDropdown?.type === 'toolProfile' && showDropdown?.index === idx && profileQuery && (
                          <div style={{ position: 'absolute', top: '100%', left: '0.5rem', right: '0.5rem', backgroundColor: 'white', border: '1px solid #dadce0', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {filteredProfiles.map(p => (
                              <div 
                                key={p.id}
                                onClick={() => {
                                  updateToolRow(idx, 'profileId', p.id);
                                  setToolProfileSearchQuery({...toolProfileSearchQuery, [idx]: ''});
                                  setShowDropdown(null);
                                }}
                                style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                {p.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      {canEdit && (
                        <td style={{ padding: '0.5rem', border: '1px solid #dadce0', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeToolRow(idx)} style={{ color: '#ea4335', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {canEdit && <button type="button" onClick={addToolRow} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f8f9fa', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer' }}>+ Add Tool</button>}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Go-to-market Characteristics</label>
          <textarea 
            rows={3}
            value={formData.gtmCharacteristics} 
            onChange={e => setFormData({...formData, gtmCharacteristics: e.target.value})}
            disabled={!canEdit}
            placeholder="Describe marketing and positioning..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Technical Specifications</label>
          <textarea 
            rows={4}
            value={formData.technicalSpec} 
            onChange={e => setFormData({...formData, technicalSpec: e.target.value})}
            disabled={!canEdit}
            placeholder="Detailed technical capabilities, latency, data structures..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Strategic Use Cases</label>
          <textarea 
            rows={4}
            value={formData.useCases} 
            onChange={e => setFormData({...formData, useCases: e.target.value})}
            disabled={!canEdit}
            placeholder="Example business scenarios and value propositions..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #dadce0', resize: 'vertical' }}
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
