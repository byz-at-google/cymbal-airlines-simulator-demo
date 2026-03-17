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
}

export const GuidedExperienceOverlay: React.FC<GuidedExperienceProps> = ({
  steps,
  currentStep,
  onClose,
  onNext
}) => {
  const step = steps[currentStep];
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2000
  });
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({
    display: 'none'
  });

  useEffect(() => {
    if (step?.targetSelector) {
      const target = document.querySelector(step.targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        setBubbleStyle({
          position: 'fixed',
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
          zIndex: 2000
        });
        setHighlightStyle({
          position: 'fixed',
          top: `${rect.top - 5}px`,
          left: `${rect.left - 5}px`,
          width: `${rect.width + 10}px`,
          height: `${rect.height + 10}px`,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: '4px',
          zIndex: 1999,
          pointerEvents: 'none'
        });
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    
    // Default to center if no target or target not found
    setBubbleStyle({
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2000
    });
    setHighlightStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1999
    });
  }, [step]);

  if (!step) return null;

  return (
    <Fragment>
      <div style={highlightStyle} />
      <div style={{
        ...bubbleStyle,
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        width: '350px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderTop: '5px solid #1a73e8'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#1a73e8' }}>{step.title}</h4>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.25rem', 
              cursor: 'pointer',
              color: '#5f6368',
              lineHeight: 1
            }}
          >&times;</button>
        </div>
        <div style={{ fontSize: '0.95rem', color: '#3c4043', lineHeight: '1.5' }}>
          {step.content}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#5f6368' }}>
            Step {currentStep + 1} of {steps.length}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        </div>

        {/* Arrow pointer */}
        {step.targetSelector && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid white'
          }} />
        )}
      </div>
    </Fragment>
  );
};
