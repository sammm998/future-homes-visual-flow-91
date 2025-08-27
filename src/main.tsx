import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initWebVitalsOptimizations } from './utils/webVitalsOptimizer'
import { initPerformanceOptimizations } from './utils/criticalCSS'
import { warmCache } from './utils/performanceCache'
import { initIntelligentPrefetching } from './utils/bundleOptimizer'

// Initialize performance optimizations immediately
initWebVitalsOptimizations();
initPerformanceOptimizations();
initIntelligentPrefetching();

// Warm critical caches for better performance
warmCache([
  '/api/properties',
  '/api/locations', 
  '/api/testimonials'
]).catch(console.warn);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
