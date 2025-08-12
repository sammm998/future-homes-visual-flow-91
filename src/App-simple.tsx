import React from "react";

const SimpleApp = () => {
  console.log('SimpleApp - React check:', React);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Simple App Test</h1>
      <p>If you can see this, React is loading correctly.</p>
      <p>React object: {typeof React}</p>
      <p>useState: {typeof React.useState}</p>
      <p>useEffect: {typeof React.useEffect}</p>
    </div>
  );
};

export default SimpleApp;