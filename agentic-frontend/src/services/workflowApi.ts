// API service for backend integration
// Replace BASE_URL with your actual backend endpoint

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://agentic-orchestration-builder.onrender.com/api";

export interface Workflow {
  id?: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
}

export interface WorkflowExecutionRequest {
  workflowId: string;
  parameters?: Record<string, any>;
}

export interface WorkflowExecutionResponse {
  executionId: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
  error?: string;
}

// Create a new workflow
export const createWorkflow = async (workflow: any): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      throw new Error("Failed to create workflow");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }
};

// Get all workflows
export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    const response = await fetch(`${BASE_URL}/workflows`);

    if (!response.ok) {
      throw new Error("Failed to fetch workflows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
};

// Get a specific workflow by ID
export const getWorkflow = async (id: string): Promise<Workflow> => {
  try {
    const response = await fetch(`${BASE_URL}/workflows/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch workflow");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching workflow:", error);
    throw error;
  }
};

// Update a workflow
export const updateWorkflow = async (
  id: string,
  workflow: any
): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/workflows/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      throw new Error("Failed to update workflow");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
};

// Delete a workflow
export const deleteWorkflow = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/workflows/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete workflow");
    }
  } catch (error) {
    console.error("Error deleting workflow:", error);
    throw error;
  }
};

// Execute a workflow - creates a new run
export const executeWorkflow = async (
  request: WorkflowExecutionRequest
): Promise<WorkflowExecutionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: request.workflowId,
        parameters: request.parameters || {},
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to execute workflow");
    }

    return await response.json();
  } catch (error) {
    console.error("Error executing workflow:", error);
    throw error;
  }
};

// Get execution status
export const getExecutionStatus = async (
  executionId: string
): Promise<WorkflowExecutionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/runs/${executionId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch execution status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching execution status:", error);
    throw error;
  }
};

// Get all execution runs
export const getExecutionRuns = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/runs`);

    if (!response.ok) {
      throw new Error("Failed to fetch execution runs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching execution runs:", error);
    throw error;
  }
};

// Replay a workflow execution
export const replayExecution = async (
  runId: string
): Promise<WorkflowExecutionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/runs/replay/${runId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to replay execution");
    }

    return await response.json();
  } catch (error) {
    console.error("Error replaying execution:", error);
    throw error;
  }
};

// Get detailed run information including response
export const getRunDetails = async (runId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/runs/${runId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch run details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching run details:", error);
    throw error;
  }
};

// Approve a human approval step
export const approveWorkflowStep = async (
  runId: string,
  nodeId: string,
  approved: boolean,
  message?: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/approvals/${runId}/${nodeId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        run_id: runId,
        node_id: nodeId,
        approvalPayload: {
          approved,
          message: message || (approved ? "Approved" : "Rejected"),
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to approve workflow step");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving workflow step:", error);
    throw error;
  }
};
