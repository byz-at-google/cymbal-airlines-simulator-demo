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
        minHeight: '120px',
        maxHeight: '30vh',
        backgroundColor: 'white',
        borderTop: '1px solid #dadce0',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        zIndex: 2001,
        gap: '2rem',
        overflowY: 'auto'
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
          padding: '8px 0'
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
            
            {!step.hideNext && (
              <button 
                onClick={() => {
                  if (step.onNext) step.onNext();
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
                {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
