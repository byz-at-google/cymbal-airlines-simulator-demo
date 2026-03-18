/**
 * @jsx createElement
 * @jsxFrag Fragment
 */
import { createContext, useContext, useState, createElement, Fragment, ReactNode } from 'react';
import * as React from 'react';

export type Persona = 'Admin' | 'Governance' | 'ProductOwner' | 'Operator' | 'Consumer';

interface SimulatorContextType {
  persona: Persona;
  setPersona: (p: Persona) => void;
  isGuidedExperienceActive: boolean;
  setIsGuidedExperienceActive: (b: boolean) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider = ({ children }: { children: ReactNode }) => {
  const [persona, setPersona] = useState<Persona>('Admin');
  const [isGuidedExperienceActive, setIsGuidedExperienceActive] = useState(false);

  return (
    <SimulatorContext.Provider value={{ persona, setPersona, isGuidedExperienceActive, setIsGuidedExperienceActive }}>
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
