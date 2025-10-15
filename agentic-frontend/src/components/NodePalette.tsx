import React from "react";
import { NODE_TEMPLATES } from "../features/visual-editor/node-templates.ts";

export default function NodePalette() {
  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-56 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Node Palette</h3>

      <div className="space-y-2">
        {Object.entries(NODE_TEMPLATES).map(([key, node]) => (
          <div
            key={key}
            draggable
            onDragStart={(e) => onDragStart(e, key)}
            className="flex items-center justify-between p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-grab transition"
            title={`Drag ${node.label} node onto the canvas`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{node.icon || "🔘"}</span>
              <div>
                <div className="text-sm font-medium text-gray-800">{node.label}</div>
                <div className="text-xs text-gray-500">type: {node.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
