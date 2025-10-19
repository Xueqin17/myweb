'use client';

import React, { useEffect, useState } from 'react';

export default function ApiDocs() {
  const [baseUrl, setBaseUrl] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const testAPI = async (method: string, endpoint: string, body?: object) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({ error: 'Connection failed or invalid response' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dockerized API CRUD Documentation</h1>
      <p>Base URL: <code>{baseUrl}/api/users</code></p>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => testAPI('GET', '/api/users')}>GET Users</button>
        <button onClick={() => testAPI('POST', '/api/users', { name: 'Tony', lineStatus: 'offline' })} style={{ marginLeft: '10px' }}>POST Add User</button>
        <button onClick={() => testAPI('PATCH', '/api/users?id=1', { lineStatus: 'online' })} style={{ marginLeft: '10px' }}>PATCH Update</button>
        <button onClick={() => testAPI('DELETE', '/api/users?id=1')} style={{ marginLeft: '10px', color: 'red' }}>DELETE User</button>
      </div>

      <h3>Response:</h3>
      <pre style={{ backgroundColor: '#f7f7f7', padding: '10px', border: '1px solid #ddd' }}>
        {loading ? 'Loading...' : JSON.stringify(response, null, 2) || 'No response yet.'}
      </pre>
    </div>
  );
}