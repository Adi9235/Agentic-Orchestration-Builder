import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import RunTimeline from "../components/RunTimeline";
import { useUIStore } from "../store/uiStore";

export default function RunDetail() {
  const { run_id } = useParams<{ run_id: string }>();
  const { data: run, isLoading } = useQuery({
    queryKey: ["run", run_id],
    enabled: !!run_id,
    queryFn: async () => (await api.get(`/api/runs/${run_id}`)).data,
  });

  const { openApprovalModal } = useUIStore();

  const openApproval = (node_id: string) => {
    // we use window globals to connect to ApprovalModal (consistent with earlier helper)
    (window as any).__approval_run_id = run_id;
    (window as any).__approval_node_id = node_id;
    openApprovalModal();
  };

  if (isLoading) return <div className="p-6">Loading run...</div>;
  if (!run) return <div className="p-6 text-gray-500">Run not found</div>;

  // attempt to get events — backend may return events list or run.state.events
  const events = run.events || run.state?.events || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Run: {run.run_id}</h2>
          <div className="text-sm text-gray-500">Workflow: {run.workflow_id} • Status: {run.status}</div>
        </div>

        <div>
          {run.status === "paused" && (
            <button
              onClick={() => {
                // find paused node from events if available (best-effort)
                const pausedEv = events.find((e: any) => e.type === "node.paused");
                const nodeId = pausedEv?.node_id || (window as any).__approval_node_id;
                if (!nodeId) return alert("No node identified for approval");
                openApproval(nodeId);
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded"
            >
              Resolve Approval
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-medium mb-2">Run State</h3>
        <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto max-h-60">{JSON.stringify(run.state || run, null, 2)}</pre>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-3">Event Timeline</h3>
        <RunTimeline events={events} />
      </div>
    </div>
  );
}
