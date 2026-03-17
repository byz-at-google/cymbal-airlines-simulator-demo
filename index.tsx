/**
 * @jsx React.createElement
 * @jsxFrag React.Fragment
 */
import * as React from 'react';
import {createRoot} from 'react-dom';
import App from './app';

const container = document.getElementById('root')!;
window.onerror = (msg, url, line, col, error) => {
  const errDiv = document.createElement('div');
  errDiv.style.color = 'red';
  errDiv.style.padding = '20px';
  
  const h1 = document.createElement('h1');
  h1.textContent = 'Runtime Error';
  errDiv.appendChild(h1);
  
  const p = document.createElement('p');
  p.textContent = String(msg);
  errDiv.appendChild(p);
  
  const pre = document.createElement('pre');
  pre.textContent = error?.stack || '';
  errDiv.appendChild(pre);
  
  document.body.prepend(errDiv);
};

if (container) {
  const root = createRoot(container);
  try {
    root.render(React.createElement(App, null));
  } catch (e: any) {
    const errDiv = document.createElement('div');
    errDiv.style.color = 'red';
    errDiv.style.padding = '20px';
    
    const h1 = document.createElement('h1');
    h1.textContent = 'React Render Error';
    errDiv.appendChild(h1);
    
    const p = document.createElement('p');
    p.textContent = e.message;
    errDiv.appendChild(p);
    
    const pre = document.createElement('pre');
    pre.textContent = e.stack;
    errDiv.appendChild(pre);
    
    document.body.prepend(errDiv);
  }
}
