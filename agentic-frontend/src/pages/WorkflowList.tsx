import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import { BackendWorkflow } from "@/utils/workflowTransform";
import { getWorkflows, deleteWorkflow } from "@/services/workflowApi";

const WorkflowList = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<BackendWorkflow[]>([]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await getWorkflows();
      setWorkflows(data as any);
    } catch (error) {
      console.error("Failed to load workflows:", error);
      toast.error("Failed to load workflows");
    }
  };

  const handleEdit = (workflowId: string) => {
    navigate(`/workflows/editor?id=${workflowId}`);
  };

  const handleDelete = async (workflowId: string) => {
    toast.info("Feature in progress - Delete not implemented yet");
  };

  const handleRun = (workflow: BackendWorkflow) => {
    // Store workflow ID for execution
    navigate(`/runs?execute=${workflow.workflow_id}`);
  };

  return (
    <div className="h-full bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflows</h1>
            <p className="text-muted-foreground mt-1">Manage your saved workflows</p>
          </div>
          <Button onClick={() => navigate("/workflows/editor")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {workflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No workflows yet</p>
              <Button onClick={() => navigate("/workflows/editor")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workflow
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.workflow_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{workflow.name}</span>
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      v{workflow.version}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() => handleEdit(workflow.workflow_id)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 h-8"
                      onClick={() => handleRun(workflow)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() => handleDelete(workflow.workflow_id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowList;
