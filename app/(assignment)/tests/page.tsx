'use client';
import { useState } from 'react';

export default function TestsPage() {
  const [result, setResult] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Try to click "Run API Test" to start the test
  const runTest = async () => {
    setResult('Running test...');
    setTime('');

    try {
      const res = await fetch('/api/test');
      const data = await res.json();

      if (data.success) {
        setResult('Test Passed! Database connection OK.');
      } else {
        setResult(`Test Failed: ${data.error || 'Unknown error'}`);
      }

      setTime(`Executed at: ${new Date().toISOString()}`);
    } catch (err) {
      setResult('Test Failed: API unreachable');
      setTime(`Executed at: ${new Date().toISOString()}`);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>System Test Dashboard</h2>
      <p>This page validates API and Prisma database connection.</p >

      <button
        onClick={runTest}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Run API Test
      </button>

      <div style={{ marginTop: '20px', fontSize: '16px' }}>
        <strong>{result}</strong>
        <p>{time}</p >
      </div>
    </div>
  );
}