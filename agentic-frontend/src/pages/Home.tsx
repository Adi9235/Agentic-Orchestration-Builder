import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 text-center">
        <h1 className="text-4xl font-bold mb-3 text-brand-700">Agentic Orchestration Builder</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Build, visualize and run hybrid deterministic + agentic workflows with human-in-the-loop checkpoints,
          event-driven orchestration, replay and observability.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/workflows" className="px-6 py-3 rounded-lg bg-brand-600 text-white hover:bg-brand-700">
            Open Workflows
          </Link>
          <Link to="/runs" className="px-6 py-3 rounded-lg border border-gray-200">
            View Runs
          </Link>
        </div>
      </div>
    </div>
  );
}
