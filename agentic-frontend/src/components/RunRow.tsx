import React from "react";
import { formatDateTime } from "../utils/format";
import { STATUS_COLORS } from "../utils/constants";

type Props = {
  run: any;
  onView?: (id: string) => void;
  onReplay?: (id: string) => void;
};

export default function RunRow({ run, onView, onReplay }: Props) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div>
        <div className="font-medium text-slate-800">{run.workflow_id}</div>
        <div className="text-xs text-gray-500">{formatDateTime(run.createdAt)}</div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[run.status] || "bg-slate-100 text-slate-700"}`}>
          {run.status}
        </span>

        <button
          onClick={() => onView?.(run.run_id)}
          className="text-sm text-brand-600 hover:underline"
        >
          View
        </button>

        <button
          onClick={() => onReplay?.(run.run_id)}
          className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
