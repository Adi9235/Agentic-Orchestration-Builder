import React from "react";
import { formatDateTime } from "../utils/format";

type EventItem = {
  id?: string;
  type: string;
  node_id?: string | null;
  payload?: any;
  createdAt?: string;
};

type Props = {
  events: EventItem[] | undefined;
};

export default function RunTimeline({ events = [] }: Props) {
  if (!events?.length) {
    return <div className="text-sm text-gray-500">No events yet.</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((ev, i) => (
        <div key={ev.id || i} className="flex gap-3 items-start">
          <div className="w-10 text-xs text-gray-400">{formatDateTime(ev.createdAt || new Date().toISOString())}</div>
          <div className="flex-1 bg-white p-3 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-slate-800">{ev.type}</div>
                <div className="text-xs text-gray-500">{ev.node_id || "workflow"}</div>
              </div>
            </div>

            {ev.payload && (
              <pre className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded overflow-auto">
                {typeof ev.payload === "string" ? ev.payload : JSON.stringify(ev.payload, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
