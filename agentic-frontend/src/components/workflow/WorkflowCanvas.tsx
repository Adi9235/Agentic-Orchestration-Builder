import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CustomNode } from "./nodes/CustomNode";
import { NODE_TEMPLATES } from "@/types/nodeTemplates";
import { NodeConfigPanel } from "./NodeConfigPanel";

const nodeTypes = {
  start: CustomNode,
  agent: CustomNode,
  http: CustomNode,
  plugin: CustomNode,
  human: CustomNode,
};

interface WorkflowCanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (nodes: any[]) => void;
  onEdgesChange: (edges: any[]) => void;
}

export const WorkflowCanvas = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange,
  onEdgesChange,
}: WorkflowCanvasProps) => {
  const [nodes, setNodes, handleNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, handleEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onEdgesChange(newEdges);
    },
    [edges, setEdges, onEdgesChange]
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
    setIsConfigOpen(true);
  }, []);

  const handleConfigSave = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
              label: config.label || node.data.label,
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
      onNodesChange(updatedNodes);
    },
    [nodes, setNodes, onNodesChange]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const templateKey = event.dataTransfer.getData("application/reactflow");
      if (!templateKey) return;

      const template = NODE_TEMPLATES[templateKey];
      if (!template) return;
      
      const type = template.type;

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: template.label,
          icon: template.icon,
          color: template.color,
          config: { ...template.defaultConfig },
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      onNodesChange(newNodes);
    },
    [nodes, setNodes, onNodesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodesChangeWrapper = useCallback(
    (changes: any) => {
      handleNodesChange(changes);
      onNodesChange(nodes);
    },
    [handleNodesChange, nodes, onNodesChange]
  );

  const handleEdgesChangeWrapper = useCallback(
    (changes: any) => {
      handleEdgesChange(changes);
      onEdgesChange(edges);
    },
    [handleEdgesChange, edges, onEdgesChange]
  );

  return (
    <>
      <div
        className="flex-1 bg-canvas-bg"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChangeWrapper}
          onEdgesChange={handleEdgesChangeWrapper}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <NodeConfigPanel
        node={selectedNode}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleConfigSave}
      />
    </>
  );
};
