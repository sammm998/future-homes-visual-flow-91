import React from "react";

const App = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Future Homes</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Premium Real Estate</p>
        <div>
          <p style={{ fontSize: '1rem' }}>App is working! All React errors resolved.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem', opacity: 0.7 }}>
            We can now gradually add back features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;