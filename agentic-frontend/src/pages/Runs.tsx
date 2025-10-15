import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, User, RefreshCw, CheckCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getExecutionRuns, replayExecution, executeWorkflow as executeWorkflowApi, approveWorkflowStep, getRunDetails } from "@/services/workflowApi";
import { ResponseViewer } from "@/components/workflow/ResponseViewer";

interface WorkflowRun {
  runId: string;
  workflowId: string;
  workflowName: string;
  status: "completed" | "waiting_approval" | "failed" | "running";
  timestamp: string;
  response?: any;
  error?: string;
  outputs?: Record<string, any>;
  pendingApprovals?: Array<{
    node_id: string;
    approvalText?: string;
  }>;
}

const Runs = () => {
  const [searchParams] = useSearchParams();
  const executeWorkflowId = searchParams.get("execute");
  
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [expandedRuns, setExpandedRuns] = useState<Record<string, any>>({});
  const [loadingRuns, setLoadingRuns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadRuns();
    if (executeWorkflowId) {
      executeWorkflow(executeWorkflowId);
    }
  }, [executeWorkflowId]);

  const loadRuns = async () => {
    try {
      const data = await getExecutionRuns();
      // Transform API response to match interface
      const transformedRuns = data.map((run: any) => ({
        runId: run.run_id,
        workflowId: run.workflow_id,
        workflowName: run.workflow_name || run.workflow_id,
        status: run.status,
        timestamp: run.createdAt || run.timestamp,
        response: run.response,
        error: run.error,
        outputs: run.outputs,
        pendingApprovals: run.pendingApprovals || run.pending_approvals,
      }));
      setRuns(transformedRuns);
    } catch (error) {
      console.error("Failed to load runs:", error);
      toast.error("Failed to load workflow runs");
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      toast.info("Starting workflow execution...");
      const response = await executeWorkflowApi({ workflowId });
      
      // Refresh runs list
      await loadRuns();
      
      toast.success("Workflow execution started");
    } catch (error) {
      console.error("Failed to execute workflow:", error);
      toast.error("Failed to execute workflow");
    }
  };

  const handleReplay = async (run: WorkflowRun) => {
    try {
      toast.info("Replaying workflow...");
      await replayExecution(run.runId);
      
      // Refresh runs list
      await loadRuns();
      
      toast.success("Workflow replay started");
    } catch (error) {
      console.error("Failed to replay workflow:", error);
      toast.error("Failed to replay workflow");
    }
  };

  const handleApprove = async (runId: string, nodeId: string, approved: boolean) => {
    try {
      toast.info(approved ? "Approving..." : "Rejecting...");
      await approveWorkflowStep(runId, nodeId, approved);
      
      // Refresh runs list
      await loadRuns();
      
      toast.success(approved ? "Workflow approved and resumed" : "Workflow rejected");
    } catch (error) {
      console.error("Failed to approve workflow:", error);
      toast.error("Failed to process approval");
    }
  };

  const fetchRunDetails = async (runId: string) => {
    if (expandedRuns[runId]) {
      return; // Already loaded
    }

    setLoadingRuns(prev => ({ ...prev, [runId]: true }));
    try {
      const details = await getRunDetails(runId);
      setExpandedRuns(prev => ({ ...prev, [runId]: details.state?.output || details }));
    } catch (error) {
      console.error("Failed to fetch run details:", error);
      toast.error("Failed to load run details");
    } finally {
      setLoadingRuns(prev => ({ ...prev, [runId]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "waiting_approval":
        return <User className="h-5 w-5 text-orange-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: "default",
      waiting_approval: "secondary",
      failed: "destructive",
      running: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="h-full bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workflow Runs</h1>
          <p className="text-muted-foreground mt-1">Monitor and replay workflow executions</p>
        </div>

        {runs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">No workflow runs yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <Card key={run.runId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-3">
                        {getStatusIcon(run.status)}
                        {run.workflowName}
                      </CardTitle>
                      <CardDescription>
                        {new Date(run.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(run.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReplay(run)}
                        disabled={run.status === "running"}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Replay
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {run.status === "waiting_approval" && run.pendingApprovals && run.pendingApprovals.length > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Pending Approvals
                      </h4>
                      <div className="space-y-3">
                        {run.pendingApprovals.map((approval) => (
                          <div key={approval.node_id} className="flex items-center justify-between bg-background rounded p-3">
                            <div>
                              <p className="text-sm font-medium">{approval.node_id}</p>
                              {approval.approvalText && (
                                <p className="text-xs text-muted-foreground mt-1">{approval.approvalText}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(run.runId, approval.node_id, true)}
                              >
                                <CheckCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApprove(run.runId, approval.node_id, false)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {run.outputs && Object.keys(run.outputs).length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <span className="font-semibold">View Node Outputs ({Object.keys(run.outputs).length})</span>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="bg-muted/50 rounded-lg p-4 mt-2 space-y-3">
                          {Object.entries(run.outputs).map(([nodeId, output]) => (
                            <div key={nodeId} className="border-l-2 border-primary pl-3">
                              <p className="text-sm font-semibold mb-1">{nodeId}</p>
                              <pre className="text-xs text-muted-foreground overflow-x-auto">
                                {JSON.stringify(output, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  <Collapsible 
                    onOpenChange={(open) => {
                      if (open) fetchRunDetails(run.runId);
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <span className="font-semibold">Response</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="bg-muted/50 rounded-lg p-4 mt-2">
                        {loadingRuns[run.runId] ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading response...</span>
                          </div>
                        ) : (
                          <ResponseViewer data={expandedRuns[run.runId]} />
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {run.error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-destructive mb-2">Error:</h4>
                      <p className="text-sm text-destructive/90">{run.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Runs;
