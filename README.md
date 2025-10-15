# ⚙️ Agentic Orchestration Builder — Backend
## **Live Site** - https://gleaming-quokka-edc25b.netlify.app/

Backend for running **AI-driven and event-based workflows** with human approvals.  
Built using **Node.js, Express, PostgreSQL, Redis, and OpenAI**.

---

### 🧩 What It Does
- Runs workflows combining **AI, API calls, plugins, and human approvals**
- Uses **Redis** for event orchestration and **Postgres** for state persistence
- Includes **Slack + Email plugins** for notifications

---

### ⚙️ APIs

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/workflows` | Create / save workflow definition |
| GET | `/api/workflows` | List workflows |
| POST | `/api/runs` | Start a workflow run |
| GET | `/api/runs` | List workflow runs |
| POST | `/api/approvals/:run_id/:node_id/approve` | Resume paused workflow after approval |

---


### ⚙️ API Flow

1️⃣ **Define a Workflow** → `/api/workflows`  
Store your workflow structure (nodes, connections, types).

2️⃣ **Start a Workflow Run** → `/api/runs`  
Trigger a new execution instance of the saved workflow.

3️⃣ **Workflow Executes Automatically**  
Each node runs — AI (agent), API call (http), plugin (email/slack).  
If a human approval node is reached → workflow **pauses**.

4️⃣ **Resume After Approval** → `/api/approvals/:run_id/:node_id/approve`  
A human approves via API → workflow **resumes** and finishes.


---

### 🧠 Example: Invoice Approval Flow
AI extracts invoice data → validates via API → decides if human approval is needed → notifies via Slack & Email.

---

### 🧪 Example Postman Requests

**Create Workflow**
```json
POST /api/workflows
{
  "workflow_id": "invoice_processing",
  "definition": {
    "startNode": "agent_extract",
    "nodes": [
      { "id": "agent_extract", "type": "agent", "params": { "prompt": "Extract invoice" }, "next": ["validate"] },
      { "id": "validate", "type": "http", "params": { "method": "POST", "url": "http://api-internal/validate-invoice" }, "next": ["approval"] },
      { "id": "approval", "type": "human", "params": { "message": "Manager approval needed" }, "next": ["notify"] },
      { "id": "notify", "type": "plugin", "params": { "pluginType": "slack", "params": { "text": "Invoice approved!" } } }
    ]
  }
}
```

**Start Run**
```json
POST /api/runs
{ "workflow_id": "invoice_processing", "input": { "amount": 12000 } }
```

**Approve Workflow**
```json
POST /api/approvals/run_123/approval/approve
{ "approvedBy": "Manager", "decision": "approved" }

```


# Agentic Workflow - Frontend

A visual workflow automation platform for creating and executing AI-powered workflows.

![Built by Aditya](https://img.shields.io/badge/Built%20by-Aditya-blue)

## UI Flow

### 1. Home Page
Landing page with an overview and quick action buttons to navigate to workflows or runs.

### 2. Workflows Page
Displays all saved workflows in a list. Users can:
- Create a new workflow (opens the editor)
- Edit existing workflows (opens the editor)
- Delete workflows

### 3. Workflow Editor
The main workspace where users build workflows:
- **Left Panel** - Node palette with draggable node types (Start, Agent, HTTP, Plugin, Human)
- **Center Canvas** - Interactive area to drop and connect nodes
- **Right Panel** - Configuration panel that opens when clicking a node to set its parameters
- **Top Bar** - Workflow name, version, and buttons to save, import, or export

Users drag nodes from the palette, drop them on the canvas, connect them by drawing lines between nodes, and configure each node's settings.

### 4. Runs Page
Shows execution history of all workflow runs with:
- Run status (success, failed, pending)
- Timestamp and duration
- Option to view detailed results or replay the workflow

## Tech Stack

React, TypeScript, React Flow, Tailwind CSS, shadcn/ui

## Getting Started

```bash
npm install
npm run dev
```
