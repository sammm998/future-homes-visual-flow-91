import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force React to be available globally for debugging
window.React = React;

console.log('Main - React import check:', React);
console.log('Main - React hooks check:', React.useState, React.useEffect);

const container = document.getElementById("root");
if (!container) throw new Error('Root element not found');

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
