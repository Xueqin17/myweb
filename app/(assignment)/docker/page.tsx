"use client";

import { useState } from "react";

export default function DockerPage() {
  const [tool, setTool] = useState<"sequelize" | "prisma">("sequelize");
  const [log, setLog] = useState<string>("");

  
  const handleExecute = async () => {
    setLog(" Running docker build and execution...");

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool }),
      });

      const data = await res.json();
      setLog(data.message || " Execution complete!");
    } catch (err) {
      console.error(err);
      setLog(" Failed to execute command.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Docker Automation</h1>

      {/* Toggle */}
      <div className="flex space-x-6 mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="tool"
            value="sequelize"
            checked={tool === "sequelize"}
            onChange={() => setTool("sequelize")}
          />
          <span>Sequelize</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="tool"
            value="prisma"
            checked={tool === "prisma"}
            onChange={() => setTool("prisma")}
          />
          <span>Prisma</span>
        </label>
      </div>

      <button
        onClick={handleExecute}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Execute
      </button>

      <pre className="bg-gray-100 p-4 mt-6 rounded text-sm text-gray-700 whitespace-pre-wrap">
        {log}
      </pre>
    </div>
  );
}