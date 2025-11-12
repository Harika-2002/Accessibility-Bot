import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AccessibilityProvider } from './AccessibilityContext';
import './style.css';

ReactDOM.render(
  <React.StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
