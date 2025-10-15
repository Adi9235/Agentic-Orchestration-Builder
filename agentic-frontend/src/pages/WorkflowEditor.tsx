import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Save, Download } from "lucide-react";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { NodePalette } from "@/components/workflow/NodePalette";
import { toast } from "sonner";
import { transformToBackendFormat, transformFromBackendFormat, BackendWorkflow } from "@/utils/workflowTransform";
import { getWorkflow, createWorkflow, updateWorkflow } from "@/services/workflowApi";

const WorkflowEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get("id");

  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    try {
      const workflow = await getWorkflow(id);
      const frontendWorkflow = transformFromBackendFormat(workflow as any);
      setNodes(frontendWorkflow.nodes);
      setEdges(frontendWorkflow.edges);
      setWorkflowName(workflow.name);
      setCurrentVersion((workflow as any).version || 1);
      setCurrentWorkflowId(workflow.id);
    } catch (error) {
      console.error("Failed to load workflow:", error);
      toast.error("Failed to load workflow from backend");
    }
  };

  const handleImportWorkflow = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            
            if (data.definition && data.workflow_id) {
              const frontendWorkflow = transformFromBackendFormat(data);
              setNodes(frontendWorkflow.nodes);
              setEdges(frontendWorkflow.edges);
              setWorkflowName(data.name);
              setCurrentVersion(data.version);
              setCurrentWorkflowId(data.workflow_id);
            } else {
              setNodes(data.nodes || []);
              setEdges(data.edges || []);
              setWorkflowName(data.name || "Imported Workflow");
            }
            
            toast.success("Workflow imported and displayed on canvas");
          } catch (error) {
            toast.error("Failed to import workflow");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveWorkflow = async () => {
    try {
      const frontendWorkflow = { name: workflowName, nodes, edges };
      const backendWorkflow = transformToBackendFormat(
        frontendWorkflow,
        currentWorkflowId
      );

      // Increment version if updating existing workflow
      const newVersion = currentWorkflowId ? currentVersion + 1 : 1;
      backendWorkflow.version = newVersion;

      let savedWorkflow;
      if (currentWorkflowId) {
        // Update existing workflow
        savedWorkflow = await updateWorkflow(currentWorkflowId, backendWorkflow);
      } else {
        // Create new workflow
        savedWorkflow = await createWorkflow(backendWorkflow);
        setCurrentWorkflowId(savedWorkflow.workflow_id || savedWorkflow.id);
      }

      setCurrentVersion(newVersion);
      toast.success(`Workflow saved (v${newVersion})`);
    } catch (error: any) {
      toast.error(error.message || "Failed to save workflow");
    }
  };

  const handleExportWorkflow = () => {
    try {
      const frontendWorkflow = { name: workflowName, nodes, edges };
      const backendWorkflow = transformToBackendFormat(frontendWorkflow, currentWorkflowId);
      backendWorkflow.version = currentVersion;

      const blob = new Blob([JSON.stringify(backendWorkflow, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${workflowName}-v${currentVersion}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Workflow exported");
    } catch (error: any) {
      toast.error(error.message || "Failed to export workflow");
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <NodePalette />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/workflows")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 transition-all"
              />
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                v{currentVersion}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleImportWorkflow} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleExportWorkflow} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleSaveWorkflow} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </header>

        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>
    </div>
  );
};

export default WorkflowEditor;
