// src/pages/WorkflowEditor.tsx
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function WorkflowEditor() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const isNew = search.get("mode") === "new";

  // ✅ define mutation inside component
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/api/workflows", payload);
      return res.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["workflows"] });
      // navigate to edit view of saved workflow
      navigate(`/workflows/${data.workflow_id}`);
    },
    onError: (err) => {
      console.error("Save failed", err);
      alert("Save failed");
    },
  });

  // ✅ safe save handler
  async function handleSaveFromEditor(graphDefinition: any) {
    const payload = {
      workflow_id: graphDefinition.workflow_id || `wf_${Date.now()}`,
      name: graphDefinition.name || "Untitled",
      definition: graphDefinition.definition || graphDefinition,
    };
    await saveMutation.mutateAsync(payload);
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Workflow Editor</h2>

      <div className="bg-white rounded-lg shadow p-4 h-[70vh]">
        {/* TODO: ReactFlow canvas here */}
        <p className="text-gray-500">
          Visual editor placeholder. Drag nodes and connect them.
        </p>
      </div>

      <button
        onClick={() =>
          handleSaveFromEditor({
            name: "Test Workflow",
            definition: {
              startNode: "agent_node",
              nodes: [
                {
                  id: "agent_node",
                  type: "agent",
                  params: { prompt: "Say hello" },
                  next: ["slack_node"],
                },
                {
                  id: "slack_node",
                  type: "plugin",
                  params: { pluginType: "slack", text: "Workflow executed!" },
                },
              ],
            },
          })
        }
        className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700"
      >
        Save Workflow
      </button>
    </div>
  );
}
