import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import type { Node, Edge, Connection, ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import { NODE_TEMPLATES } from "./node-templates";

type NodeData = {
  label: string;
  type: string;
  config: Record<string, any>;
};

type Props = {
  onSave: (graph: any) => void;
};

export default function FlowCanvas({ onSave }: Props) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const template = NODE_TEMPLATES[nodeType];
      if (!template) return;

      const position = rfInstance
        ? rfInstance.project({
            x: event.clientX - 250,
            y: event.clientY - 80,
          })
        : { x: 100, y: 100 };

      const newNode: Node<NodeData> = {
        id: `${nodeType}_${Date.now()}`,
        type: "default",
        position,
        data: {
          label: template.label,
          type: template.type,
          config: { ...template.defaultConfig },
        },
        style: {
          background: template.color,
          color: "#fff",
          padding: 8,
          borderRadius: 8,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [rfInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleSaveWorkflow = () => {
    if (!rfInstance) return;
    const flow = rfInstance.toObject();

    const workflowDefinition = {
      startNode: flow.nodes[0]?.id || null,
      nodes: flow.nodes.map((n: any) => ({
        id: n.id,
        type: n.data.type,
        name: n.data.label,
        config: n.data.config,
        next: flow.edges
          .filter((e: any) => e.source === n.id)
          .map((e: any) => e.target),
      })),
    };

    onSave({
      workflow_id: `wf_${Date.now()}`,
      name: "Visual Workflow",
      definition: workflowDefinition,
    });
  };

  return (
    <div className="flex w-full h-[80vh] bg-gray-50 border rounded-lg overflow-hidden">
      {/* Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {/* Right panel */}
      <div className="w-64 border-l bg-white p-4 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold mb-2">Nodes in Workflow</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {nodes.map((n) => (
              <li key={n.id}>• {n.data?.label || "Unnamed Node"}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSaveWorkflow}
          className="mt-4 w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700"
        >
          Save Workflow
        </button>
      </div>
    </div>
  );
}
