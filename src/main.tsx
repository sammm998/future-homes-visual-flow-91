import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { enableServiceWorker } from './utils/performanceUtils'

// Register service worker for caching
if ('serviceWorker' in navigator) {
  enableServiceWorker();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
