import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const MinimalApp = () => {
  const [test, setTest] = useState('React hooks working!');
  
  useEffect(() => {
    console.log('useEffect working!');
    setTest('React hooks are fully functional!');
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Minimal App Test</h1>
      <p>{test}</p>
      <p>If you see this, React is working correctly.</p>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<MinimalApp />} />
    </Routes>
  </BrowserRouter>
);

export default App;