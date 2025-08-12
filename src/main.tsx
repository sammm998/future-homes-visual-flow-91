import React from 'react'
import { createRoot } from 'react-dom/client'

// Basic HTML structure to test if React loads
const TestApp = () => {
  console.log('TestApp rendering - React is:', typeof React);
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      lineHeight: '1.6'
    }}>
      <h1>React Test App</h1>
      <p>✅ If you can see this page, React is working!</p>
      <p>React type: {typeof React}</p>
      <p>useState available: {typeof React.useState}</p>
      <p>useEffect available: {typeof React.useEffect}</p>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '8px'
      }}>
        <h2>Debug Info:</h2>
        <pre>{JSON.stringify({
          ReactExists: !!React,
          ReactType: typeof React,
          HasUseState: !!React.useState,
          HasUseEffect: !!React.useEffect,
          HasCreateElement: !!React.createElement
        }, null, 2)}</pre>
      </div>
    </div>
  );
};

console.log('=== REACT DEBUG INFO ===');
console.log('React import:', React);
console.log('React type:', typeof React);
console.log('React.useState:', React.useState);
console.log('React.useEffect:', React.useEffect);
console.log('React.createElement:', React.createElement);
console.log('========================');

const root = document.getElementById('root');
if (!root) {
  document.body.innerHTML = '<div style="padding: 20px; color: red;">ERROR: Root element not found!</div>';
} else {
  try {
    createRoot(root).render(<TestApp />);
  } catch (error) {
    console.error('Failed to render React app:', error);
    root.innerHTML = `<div style="padding: 20px; color: red;">React render failed: ${error.message}</div>`;
  }
}