import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Workflow, List, HomeIcon, Menu, X } from "lucide-react";

import Home from "./pages/Home";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowEditor from "./pages/WorkflowEditor";
import RunsPage from "./pages/RunsPage";
import RunDetail from "./pages/RunDetail";

const queryClient = new QueryClient();

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* Sidebar */}
          <motion.aside
            animate={{ width: sidebarOpen ? 260 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-white border-r shadow-sm flex flex-col z-20 ${
              sidebarOpen ? "w-64" : "w-0"
            }`}
          >
            {sidebarOpen && (
              <>
                <div className="p-6 text-xl font-bold text-brand-600 border-b flex justify-between items-center">
                  Agentic Builder
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scroll">
                  <SidebarLink to="/" label="Home" icon={<HomeIcon size={16} />} />
                  <SidebarLink
                    to="/workflows"
                    label="Workflows"
                    icon={<Workflow size={16} />}
                  />
                  <SidebarLink to="/runs" label="Runs" icon={<List size={16} />} />
                </nav>

                <div className="text-xs text-gray-400 text-center py-3 border-t">
                  © {new Date().getFullYear()} Agentic Builder
                </div>
              </>
            )}
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            {/* Top bar (mobile toggle) */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-4 left-4 bg-white border rounded-md p-2 shadow-sm hover:bg-gray-50 z-10"
              >
                <Menu size={18} />
              </button>
            )}

            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workflows" element={<WorkflowsPage />} />
                <Route path="/workflows/:workflow_id" element={<WorkflowEditor />} />
                <Route path="/runs" element={<RunsPage />} />
                <Route path="/runs/:run_id" element={<RunDetail />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

/* Helper Component for Sidebar Links */
function SidebarLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
          isActive
            ? "bg-brand-50 text-brand-700 font-medium border border-brand-100"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
