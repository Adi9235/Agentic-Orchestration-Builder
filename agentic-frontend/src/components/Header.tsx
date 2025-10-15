import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, Workflow, List } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-brand-50 p-2 rounded-md">
            <HomeIcon size={20} className="text-brand-600" />
          </div>
          <div className="text-lg font-semibold text-slate-800">Agentic Orchestrator</div>
        </Link>

        <nav className="flex gap-4 items-center text-sm">
          <Link to="/workflows" className="text-slate-600 hover:text-brand-600">Workflows</Link>
          <Link to="/runs" className="text-slate-600 hover:text-brand-600">Runs</Link>
        </nav>
      </div>
    </header>
  );
}
