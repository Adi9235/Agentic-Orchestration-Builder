import React, { useState } from "react";
import { useApproval } from "../hooks/useApproval";
import { useUIStore } from "../store/uiStore";

export default function ApprovalModal() {
  const { isApprovalModalOpen, closeApprovalModal, selectedWorkflowId } = useUIStore();
  const [note, setNote] = useState("");
  const approveMutation = useApproval();

  if (!isApprovalModalOpen) return null;

  const handleApprove = async () => {
    try {
      const node_id = (window as any).__approval_node_id || "human_node";
      const run_id = (window as any).__approval_run_id || "";
      await approveMutation.mutateAsync({
        run_id,
        node_id,
        approvalPayload: { approved: true, message: note },
      });
      setNote("");
      closeApprovalModal();
      alert("Approved ✅");
    } catch (err: any) {
      console.error(err);
      alert("Approval failed");
    }
  };

  const handleReject = async () => {
    try {
      const node_id = (window as any).__approval_node_id || "human_node";
      const run_id = (window as any).__approval_run_id || "";
      await approveMutation.mutateAsync({
        run_id,
        node_id,
        approvalPayload: { approved: false, message: note },
      });
      setNote("");
      closeApprovalModal();
      alert("Rejected");
    } catch (err: any) {
      console.error(err);
      alert("Reject failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Human Approval</h3>
        <p className="text-sm text-slate-600 mb-4">
          Add a note for the approver (optional), then Approve or Reject to resume the run.
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
          className="w-full p-3 border rounded-md mb-4 min-h-[100px]"
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md border"
            onClick={() => {
              setNote("");
              closeApprovalModal();
            }}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-md bg-red-100 text-red-700"
            onClick={handleReject}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? "Processing..." : "Reject"}
          </button>

          <button
            className="px-4 py-2 rounded-md bg-brand-600 text-white"
            onClick={handleApprove}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
