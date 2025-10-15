import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { NODE_TEMPLATES } from "../features/visual-editor/node-templates";
import WorkflowCard from "../components/WorkflowCard";
import NodePalette from "../components/NodePalette";
import { useNavigate } from "react-router-dom";

export default function WorkflowsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [importText, setImportText] = useState("");

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => (await api.get("/api/workflows")).data,
  });

  const saveWorkflow = useMutation({
    mutationFn: async (payload: any) => (await api.post("/api/workflows", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workflows"] }),
  });

  const handleCreateVisual = () => {
    const workflow_id = `wf_new_${Date.now()}`;
    navigate(`/workflows/${workflow_id}?mode=new`);
  };

  const handleImport = async () => {
    try {
      if (!importText) return alert("Paste JSON or choose a file first.");
      const def = JSON.parse(importText);
      if (!def.nodes) return alert("Invalid workflow JSON (missing nodes).");
      const payload = {
        workflow_id: def.workflow_id || `wf_import_${Date.now()}`,
        name: def.name || "Imported workflow",
        definition: def,
      };
      await saveWorkflow.mutateAsync(payload);
      setImportText("");
      alert("Workflow imported");
    } catch (err: any) {
      console.error(err);
      alert("Invalid JSON or save failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImportText(String(reader.result || ""));
    reader.readAsText(f);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-start gap-6">
        <div className="w-64 sticky top-6">
          <NodePalette />
          <div className="mt-4 bg-white p-3 rounded-lg shadow border">
            <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
            <button onClick={handleCreateVisual} className="w-full mb-2 bg-brand-600 text-white py-2 rounded">
              Create Visual Workflow
            </button>
            <div className="text-xs text-gray-500 mb-2">Import JSON or upload file</div>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste workflow JSON here'
              className="w-full h-24 p-2 border rounded mb-2"
            />
            <input ref={fileRef} type="file" accept="application/json" onChange={handleFileChange} />
            <button
              onClick={handleImport}
              disabled={saveWorkflow.isPending}
              className="w-full mt-2 bg-brand-600 text-white py-2 rounded"
            >
              {saveWorkflow.isPending ? "Importing..." : "Import"}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Workflows</h2>
            <button onClick={() => qc.invalidateQueries({ queryKey: ["workflows"] })} className="text-sm px-3 py-2 border rounded">
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 bg-white rounded shadow">Loading workflows...</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((wf: any) => (
                <WorkflowCard
                  key={wf.workflow_id}
                  workflow={wf}
                  onEdit={(id) => navigate(`/workflows/${id}`)}
                  onRun={(id) => api.post("/api/runs", { workflow_id: id }).then(()=> alert("Run started"))}
                  onSaveVersion={(wfPayload) => saveWorkflow.mutate({ ...wfPayload, workflow_id: wfPayload.workflow_id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
