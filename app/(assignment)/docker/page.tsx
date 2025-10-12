// app/(assignment)/docker/page.tsx
'use client';

import { useState } from 'react';

export default function DockerPage() {
  const [output, setOutput] = useState("");

  const [log, setLog] = useState<string>('');
  const handleRunDocker = async () => {
  const res = await fetch('/api/docker', { method: 'POST' });
  const data = await res.json();
  setLog(data.output);
  };

    // <pre
    // style={{
    //   background: '#f1f1f1',
    //   padding: '15px',
    //   marginTop: '20px',
    //   whiteSpace: 'pre-wrap',
    //   borderRadius: '5px'
    // }}
    // >
    // {log}
    // </pre>

  return (
    <div style={{ padding: "2rem" }}>
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
            marginTop: '10px'
          }}
>
          Run Docker
      </button>
      <pre style={{ backgroundColor: "#eee", padding: "1rem", marginTop: "1rem" }}>
        {output}
      </pre>
    </div>
  );
}
