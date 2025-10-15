import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderOpen, Play } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Agentic Workflow Builder</h1>
          <p className="text-muted-foreground text-lg">
            Create, manage, and execute intelligent workflows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full" onClick={() => navigate("/workflows/editor")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Create Workflow</CardTitle>
              <CardDescription>
                Build a new workflow from scratch using our visual editor
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full" onClick={() => navigate("/workflows/editor")}>
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full" onClick={() => navigate("/workflows")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <FolderOpen className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>View Workflows</CardTitle>
              <CardDescription>
                Browse and manage your saved workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full" onClick={() => navigate("/workflows")}>
                View All
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full" onClick={() => navigate("/runs")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Play className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle>View Runs</CardTitle>
              <CardDescription>
                Monitor workflow executions and replay runs
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button className="w-full" onClick={() => navigate("/runs")}>
                View Runs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
