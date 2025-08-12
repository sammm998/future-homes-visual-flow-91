import React from 'react'
import { createRoot } from 'react-dom/client'

// Ultra-minimal test to check if React works at all
const MinimalApp = () => {
  return React.createElement('div', { 
    style: { padding: '20px', fontFamily: 'Arial' } 
  }, 'Minimal React Test - If you see this, React is working');
};

console.log('Minimal main - React:', React);
console.log('Minimal main - createElement:', React.createElement);

const container = document.getElementById("root");
if (!container) throw new Error('Root element not found');

createRoot(container).render(React.createElement(MinimalApp));