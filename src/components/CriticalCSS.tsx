import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Component to inject critical CSS for above-the-fold content
 */
export const CriticalCSS: React.FC = () => {
  const criticalCSS = `
    /* Critical CSS for above-the-fold content */
    body {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: hsl(222.2 84% 4.9%);
      background: hsl(0 0% 100%);
    }
    
    .hero-section {
      min-height: 100vh;
      background: var(--gradient-hero);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-primary {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: var(--transition-smooth);
    }
    
    .btn-primary:hover {
      background: hsl(var(--primary-glow));
    }
    
    .property-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: var(--transition-smooth);
    }
    
    .property-card:hover {
      box-shadow: var(--shadow-elegant);
    }
    
    /* Layout utilities */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .grid {
      display: grid;
    }
    
    .flex {
      display: flex;
    }
    
    .hidden {
      display: none;
    }
    
    @media (max-width: 768px) {
      .hero-section {
        min-height: 80vh;
        padding: 2rem 1rem;
      }
      
      .container {
        padding: 0 0.75rem;
      }
    }
  `;

  return (
    <Helmet>
      <style>{criticalCSS}</style>
    </Helmet>
  );
};