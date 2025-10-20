'use client';

import React, { useEffect, useState } from 'react';

// Detect base url like http://ec2-xx-xx-xx-xx.compute-1.amazonaws.com:4080
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href).origin.replace(/\/$/, '');
  }
  return '';
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getBaseUrl());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: 980, margin: '0 auto' }}>
      <h1>Dockerized API CRUD Documentation</h1>

      <p><strong>Base URL:</strong> <code>{baseUrl}/api/users</code></p>
      <p>
        Endpoints: <code>GET</code> (list or by <code>?id=</code>), <code>POST</code> (create),
        <code>PATCH</code> (update), <code>DELETE</code> (delete)
      </p>
      <hr />

      {/* GET */}
      <h3>1) GET users</h3>
      <p>List all users:</p>
      <pre><code>{`curl -X GET ${baseUrl}/api/users`}</code></pre>
      <p>PowerShell:</p>
      <pre><code>{`Invoke-RestMethod -Uri "${baseUrl}/api/users" -Method Get`}</code></pre>

      <p>Get one by id (example: id=1):</p>
      <pre><code>{`curl -X GET "${baseUrl}/api/users?id=1"`}</code></pre>
      <p>PowerShell:</p>
      <pre><code>{`Invoke-RestMethod -Uri "${baseUrl}/api/users?id=1" -Method Get`}</code></pre>

      <hr />

      {/* POST */}
      <h3>2) POST create</h3>
      <p>Create a new user (Linux/Mac):</p>
      <pre><code>{`curl -X POST ${baseUrl}/api/users -H "Content-Type: application/json" -d '{"name":"new-user","lineStatus":"offline"}'`}</code></pre>
      <p>PowerShell:</p>
      <pre><code>{`Invoke-RestMethod -Uri "${baseUrl}/api/users" -Method Post -ContentType "application/json" -Body '{"name":"new-user","lineStatus":"offline"}'`}</code></pre>

      <hr />

      {/* PATCH */}
      <h3>3) PATCH update</h3>
      <p>Update user status to online (id=1):</p>
      <pre><code>{`curl -X PATCH "${baseUrl}/api/users?id=1" -H "Content-Type: application/json" -d '{"lineStatus":"online"}'`}</code></pre>
      <p>PowerShell:</p>
      <pre><code>{`Invoke-RestMethod -Uri "${baseUrl}/api/users?id=1" -Method Patch -ContentType "application/json" -Body '{"lineStatus":"online"}'`}</code></pre>

      <hr />

      {/* DELETE */}
      <h3>4) DELETE user</h3>
      <p>Delete user (id=1):</p>
      <pre><code>{`curl -X DELETE "${baseUrl}/api/users?id=1" -H "Content-Type: application/json" -d '{"id":1}'`}</code></pre>
      <p>PowerShell:</p>
      <pre><code>{`Invoke-RestMethod -Uri "${baseUrl}/api/users?id=1" -Method Delete -ContentType "application/json" -Body '{"id":1}'`}</code></pre>

      <hr />
    </div>
  );
};

export default ApiDocumentation;