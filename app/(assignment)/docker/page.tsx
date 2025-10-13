'use client';

import { useState } from 'react';

export default function DockerPage() {
  const [log, setLog] = useState<string>(''); 

  const handleRunDocker = async () => {
    try {
      const res = await fetch('/api/docker', {
        method: 'POST',
      });
      const data = await res.json();
      setLog(data.output); 
    } catch (err) {
      setLog('Error running Docker.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Docker Execution</h2>
      <p>This demonstrates Docker build and run output.</p>

      <button
        onClick={handleRunDocker}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '10px',
        }}
      >
        Run Docker
      </button>

      {/* Output log */}
      <pre
        style={{
          backgroundColor: '#eee',
          padding: '1rem',
          marginTop: '1rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {log}
      </pre>
    </div>
  );
}