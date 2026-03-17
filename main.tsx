/**
 * @jsx React.createElement
 * @jsxFrag React.Fragment
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {sanitizeHtmlAssertUnchanged} from 'safevalues';
import {setElementInnerHtml} from 'safevalues/dom';
import App from './app';

const container = document.getElementById('root')!;
window.onerror = (msg, url, line, col, error) => {
  const errDiv = document.createElement('div');
  errDiv.style.color = 'red';
  errDiv.style.padding = '20px';
  setElementInnerHtml(errDiv, sanitizeHtmlAssertUnchanged(`<h1>Runtime Error</h1><p>${msg}</p><pre>${error?.stack}</pre>`));
  document.body.prepend(errDiv);
};

if (container) {
  const root = (ReactDOM as any).createRoot(container);
  try {
    root.render(React.createElement(App, null));
  } catch (e: any) {
    const errDiv = document.createElement('div');
    errDiv.style.color = 'red';
    errDiv.style.padding = '20px';
    setElementInnerHtml(errDiv, sanitizeHtmlAssertUnchanged(`<h1>React Render Error</h1><p>${e.message}</p><pre>${e.stack}</pre>`));
    document.body.prepend(errDiv);
  }
}
