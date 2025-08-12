import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is globally available
if (typeof window !== 'undefined') {
  window.React = React;
}

createRoot(document.getElementById("root")!).render(<App />);