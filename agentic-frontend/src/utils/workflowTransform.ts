export interface BackendWorkflow {
  workflow_id: string;
  version: number;
  name: string;
  definition: {
    startNode: string;
    nodes: Array<{
      id: string;
      type: string;
      params: Record<string, any>;
      next?: string[];
    }>;
  };
}

export interface FrontendWorkflow {
  name: string;
  nodes: any[];
  edges: any[];
}

export const transformToBackendFormat = (
  frontendWorkflow: FrontendWorkflow,
  workflowId?: string
): BackendWorkflow => {
  const { name, nodes, edges } = frontendWorkflow;

  // Find the start node
  const startNode = nodes.find((node) => node.type === "start");
  if (!startNode) {
    throw new Error("No start node found in workflow");
  }

  // Find the first node connected to start
  const firstEdge = edges.find((edge) => edge.source === startNode.id);
  const startNodeId = firstEdge?.target || nodes.find((n) => n.type !== "start")?.id || "";

  // Build next connections for each node
  const getNextNodes = (nodeId: string): string[] => {
    return edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  };

  // Transform nodes (exclude start node as backend doesn't need it)
  const transformedNodes = nodes
    .filter((node) => node.type !== "start")
    .map((node) => ({
      id: node.id,
      type: node.type,
      params: node.data.config || {},
      ...(getNextNodes(node.id).length > 0 && { next: getNextNodes(node.id) }),
    }));

  return {
    workflow_id: workflowId || `workflow_${Date.now()}`,
    version: 1,
    name,
    definition: {
      startNode: startNodeId,
      nodes: transformedNodes,
    },
  };
};

export const transformFromBackendFormat = (
  backendWorkflow: BackendWorkflow
): FrontendWorkflow => {
  const { name, definition } = backendWorkflow;
  const { startNode, nodes: backendNodes } = definition;

  // Create nodes with positions (auto-layout)
  const nodes = backendNodes.map((node, index) => ({
    id: node.id,
    type: node.type,
    position: {
      x: 200 + (index % 3) * 250,
      y: 100 + Math.floor(index / 3) * 150,
    },
    data: {
      label: getNodeLabel(node.type),
      icon: getNodeIcon(node.type),
      color: getNodeColor(node.type),
      config: node.params,
    },
  }));

  // Add start node
  nodes.unshift({
    id: "start-node",
    type: "start",
    position: { x: 200, y: 0 },
    data: {
      label: "Start Node",
      icon: "🚀",
      color: "#22c55e",
      config: {},
    },
  });

  // Create edges
  const edges: any[] = [];
  
  // Connect start to first node
  edges.push({
    id: `edge-start-${startNode}`,
    source: "start-node",
    target: startNode,
  });

  // Connect other nodes
  backendNodes.forEach((node) => {
    if (node.next) {
      node.next.forEach((nextNodeId) => {
        edges.push({
          id: `edge-${node.id}-${nextNodeId}`,
          source: node.id,
          target: nextNodeId,
        });
      });
    }
  });

  return { name, nodes, edges };
};

const getNodeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    agent: "Agent Node",
    http: "HTTP Node",
    plugin: "Plugin Node",
    human: "Human Approval",
  };
  return labels[type] || type;
};

const getNodeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    agent: "🤖",
    http: "🌐",
    plugin: "💬",
    human: "🧍‍♂️",
  };
  return icons[type] || "📦";
};

const getNodeColor = (type: string): string => {
  const colors: Record<string, string> = {
    agent: "#3b82f6",
    http: "#eab308",
    plugin: "#8b5cf6",
    human: "#f97316",
  };
  return colors[type] || "#64748b";
};
