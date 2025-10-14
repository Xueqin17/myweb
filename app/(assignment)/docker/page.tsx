'use client';

import React, { useState } from "react";

export default function DockerPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  
  const runDocker = async () => {
    setLoading(true);
    setDone(false);
    setOutput("Running Docker build...");
    try {
      const res = await fetch("/api/docker", {
        method: "POST",
      });
      const data = await res.json();
      setOutput(data.output || "No output received.");
    } catch (err) {
      setOutput("Error running Docker command.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Docker Execution</h2>
      <p className="mb-4">This demonstrates Docker build and run output.</p>

      <button
        onClick={runDocker}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Running..." : "Run Docker"}
      </button>

       {done && <p className="mt-2 text-green-600"> Build completed successfully.</p>}

       {output && (
        <>
          <h2 className="mt-6 text-xl font-semibold mb-2">Docker Build Output:</h2>

          <pre className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm text-black overflow-auto">
            {output}
          </pre>
        </>
      )}
    </div>
  );
}