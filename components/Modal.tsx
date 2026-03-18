/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import { createElement, Fragment } from 'react';
import * as React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', color: '#f8fafc', width: '640px', maxWidth: '95%', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon}
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.05em' }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
