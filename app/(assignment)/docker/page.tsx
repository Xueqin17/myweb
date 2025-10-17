'use client';

import React, { useState } from 'react';

export default function DockerPage() {
  const [imageName, setImageName] = useState('myweb-app');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!imageName) {
      alert('Please enter a Docker image name!');
      return;
    }

    setLoading(true);
    setLogs(`Starting Docker build for image: ${imageName}\n`);

    try {
      const res = await fetch('/api/docker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageName }),
      });

      const data = await res.json();

      if (data.success) {
        setLogs((prev) => prev + `\n ${data.message}\n\n${data.logs}`);
      } else {
        setLogs((prev) => prev + `\n ${data.message}\n${data.error}`);
      }
    } catch (error) {
      setLogs('Failed to execute Docker automation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Docker Automation </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          className="border px-3 py-2 rounded w-64"
          placeholder="Enter Docker image name..."
        />
        <button
          onClick={handleExecute}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Building...' : 'Execute'}
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap h-[500px]">
        {logs || 'No output yet. Click Execute to start.'}
      </pre>
    </div>
  );
}