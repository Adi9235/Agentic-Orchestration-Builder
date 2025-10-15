import React from "react";
import { formatDateTime } from "../utils/format";

type Props = {
  workflow: any;
  onEdit?: (id: string) => void;
  onRun?: (id: string) => void;
  onSaveVersion?: (payload: any) => void;
};

export default function WorkflowCard({ workflow, onEdit, onRun, onSaveVersion }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold text-slate-800">{workflow.name}</div>
          <div className="text-xs text-gray-500 mt-1">id: {workflow.workflow_id}</div>
        </div>
        <div className="text-sm text-gray-400">v{workflow.version || 1}</div>
      </div>

      <p className="text-sm text-gray-500 mt-3 line-clamp-3 flex-1">
        {workflow.definition?.description || "No description provided."}
      </p>

      <div className="mt-4 flex gap-2">
        <button onClick={() => onEdit?.(workflow.workflow_id)} className="px-3 py-2 rounded-md border text-sm">Edit</button>
        <button onClick={() => onRun?.(workflow.workflow_id)} className="px-3 py-2 rounded-md bg-brand-600 text-white text-sm">Run</button>
        <button onClick={() => onSaveVersion?.(workflow)} className="px-3 py-2 rounded-md bg-gray-100 text-sm">Save v</button>
      </div>

      <div className="text-xs text-gray-400 mt-3">Updated {formatDateTime(workflow.updatedAt)}</div>
    </div>
  );
}
