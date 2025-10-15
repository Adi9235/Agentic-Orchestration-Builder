# Backend Integration Guide

This guide explains how to integrate the Agentic Workflow Builder frontend with your backend APIs.

## API Service Configuration

The frontend includes an API service file at `src/services/workflowApi.ts` that handles all backend communication.

### Step 1: Update Backend URL

Open `src/services/workflowApi.ts` and update the `BASE_URL` constant with your backend endpoint:

```typescript
const BASE_URL = "http://your-backend-url.com/api";
```

### Step 2: Backend API Endpoints

Your backend should implement the following REST API endpoints:

#### Workflow Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/workflows` | Create a new workflow | `{ name, nodes, edges, createdAt }` | Created workflow object |
| GET | `/workflows` | Get all workflows | - | Array of workflow objects |
| GET | `/workflows/:id` | Get specific workflow | - | Workflow object |
| PUT | `/workflows/:id` | Update workflow | Partial workflow object | Updated workflow object |
| DELETE | `/workflows/:id` | Delete workflow | - | 204 No Content |

#### Workflow Execution

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/workflows/execute` | Execute a workflow | `{ workflowId, parameters? }` | Execution response object |
| GET | `/executions/:executionId` | Get execution status | - | Execution status object |

### Step 3: Expected Data Structures

#### Workflow Object
```typescript
{
  id: string;              // Unique workflow identifier
  name: string;            // Workflow name
  nodes: Array<{           // Array of workflow nodes
    id: string;
    type: "deterministic" | "nondeterministic";
    position: { x: number; y: number };
    data: { label: string };
  }>;
  edges: Array<{           // Array of connections between nodes
    id: string;
    source: string;        // Source node ID
    target: string;        // Target node ID
  }>;
  createdAt: string;       // ISO 8601 timestamp
}
```

#### Execution Response
```typescript
{
  executionId: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;            // Execution result (if completed)
  error?: string;          // Error message (if failed)
}
```

### Step 4: Enable Backend Integration

Once your backend is ready, update the following files to use the API service instead of localStorage:

#### In `src/pages/Workflows.tsx`
Replace the `handleSaveWorkflow` function:

```typescript
import { createWorkflow } from "@/services/workflowApi";

const handleSaveWorkflow = async () => {
  try {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    };

    await createWorkflow(workflow);
    toast.success("Workflow saved successfully");
  } catch (error) {
    toast.error("Failed to save workflow");
  }
};
```

#### In `src/pages/Run.tsx`
Replace the `loadWorkflows` and `handleRunWorkflow` functions:

```typescript
import { getWorkflows, executeWorkflow } from "@/services/workflowApi";

const loadWorkflows = async () => {
  try {
    const workflows = await getWorkflows();
    setWorkflows(workflows);
  } catch (error) {
    toast.error("Failed to load workflows");
  }
};

const handleRunWorkflow = async (workflow: Workflow) => {
  try {
    const result = await executeWorkflow({
      workflowId: workflow.id!,
    });

    const executionResult: ExecutionResult = {
      workflowName: workflow.name,
      status: "running",
      timestamp: new Date().toISOString(),
      message: "Workflow execution started...",
    };

    setExecutionResults((prev) => [executionResult, ...prev]);
    toast.info(`Running workflow: ${workflow.name}`);

    // Poll for execution status
    const checkStatus = setInterval(async () => {
      const status = await getExecutionStatus(result.executionId);
      
      if (status.status === "completed") {
        clearInterval(checkStatus);
        setExecutionResults((prev) =>
          prev.map((r) =>
            r.timestamp === executionResult.timestamp
              ? { ...r, status: "success", message: "Workflow completed!" }
              : r
          )
        );
        toast.success("Workflow completed");
      } else if (status.status === "failed") {
        clearInterval(checkStatus);
        setExecutionResults((prev) =>
          prev.map((r) =>
            r.timestamp === executionResult.timestamp
              ? { ...r, status: "error", message: status.error || "Execution failed" }
              : r
          )
        );
        toast.error("Workflow failed");
      }
    }, 2000);
  } catch (error) {
    toast.error("Failed to execute workflow");
  }
};
```

## CORS Configuration

Ensure your backend has CORS enabled to allow requests from the frontend. Example for Express.js:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true
}));
```

## Authentication (Optional)

If your backend requires authentication, update the API service to include authentication headers:

```typescript
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
});

// Then use in fetch calls:
const response = await fetch(`${BASE_URL}/workflows`, {
  headers: getAuthHeaders(),
});
```

## Testing

1. Start your backend server
2. Update the `BASE_URL` in `workflowApi.ts`
3. Test workflow creation, saving, and execution
4. Monitor network requests in browser DevTools to debug any issues

## Current Behavior

Currently, the application uses **localStorage** for workflow persistence as a fallback. This allows the frontend to work independently without a backend connection. Once you integrate your backend APIs, workflows will be stored in your database instead.
