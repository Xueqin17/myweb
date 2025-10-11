// app/(assignment)/docker/page.tsx
'use client';

import { useState } from 'react';

export default function DockerPage() {
  const [output, setOutput] = useState("");

  const runDocker = async () => {
    const res = await fetch("/api/docker", { method: "POST" });
    const data = await res.json();
    setOutput(data.output || data.error || "No output.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Docker Execution</h2>
      <p>This demonstrates Docker build and run output.</p>
      <button onClick={runDocker}>Run Docker</button>
      <pre style={{ backgroundColor: "#eee", padding: "1rem", marginTop: "1rem" }}>
        {output}
      </pre>
    </div>
  );
}
