import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NODE_TEMPLATES } from "@/types/nodeTemplates";

interface NodeConfigPanelProps {
  node: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, config: Record<string, any>) => void;
}

export const NodeConfigPanel = ({
  node,
  isOpen,
  onClose,
  onSave,
}: NodeConfigPanelProps) => {
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (node) {
      setConfig(node.data?.config || {});
    }
  }, [node]);

  if (!node) return null;

  const template = Object.values(NODE_TEMPLATES).find(
    (t) => t.type === node.type
  );

  if (!template) return null;

  const handleSave = () => {
    onSave(node.id, config);
    onClose();
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const renderConfigFields = () => {
    switch (template.type) {
      case "start":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is the starting node of your workflow. No configuration needed.
            </p>
          </div>
        );

      case "agent":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Agent Prompt</Label>
              <Textarea
                id="prompt"
                value={config.prompt || ""}
                onChange={(e) => updateConfig("prompt", e.target.value)}
                placeholder="Enter the prompt for the agent"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="model">Model (Optional)</Label>
              <Input
                id="model"
                value={config.model || ""}
                onChange={(e) => updateConfig("model", e.target.value)}
                placeholder="e.g., gpt-4"
              />
            </div>
          </div>
        );

      case "http":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={config.method || "GET"}
                onValueChange={(value) => updateConfig("method", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={config.url || ""}
                onChange={(e) => updateConfig("url", e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <Label htmlFor="body">Request Body (JSON)</Label>
              <Textarea
                id="body"
                value={
                  typeof config.body === "string"
                    ? config.body
                    : JSON.stringify(config.body || {}, null, 2)
                }
                onChange={(e) => {
                  try {
                    updateConfig("body", JSON.parse(e.target.value));
                  } catch {
                    updateConfig("body", e.target.value);
                  }
                }}
                placeholder='{"key": "value"}'
                rows={4}
              />
            </div>
          </div>
        );

      case "plugin":
        const pluginType = config.pluginType || template.defaultConfig.pluginType;
        
        if (pluginType === "slack") {
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="text">Slack Message</Label>
                <Textarea
                  id="text"
                  value={config.text || ""}
                  onChange={(e) => updateConfig("text", e.target.value)}
                  placeholder="Message to send to Slack"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="channel">Channel (Optional)</Label>
                <Input
                  id="channel"
                  value={config.channel || ""}
                  onChange={(e) => updateConfig("channel", e.target.value)}
                  placeholder="#general"
                />
              </div>
            </div>
          );
        }
        
        if (pluginType === "email") {
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="to">To Email</Label>
                <Input
                  id="to"
                  value={config.to || ""}
                  onChange={(e) => updateConfig("to", e.target.value)}
                  placeholder="recipient@example.com"
                  type="email"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={config.subject || ""}
                  onChange={(e) => updateConfig("subject", e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              <div>
                <Label htmlFor="text">Email Body</Label>
                <Textarea
                  id="text"
                  value={config.text || ""}
                  onChange={(e) => updateConfig("text", e.target.value)}
                  placeholder="Email message content"
                  rows={4}
                />
              </div>
            </div>
          );
        }
        return null;

      case "human":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="approvalText">Approval Message</Label>
              <Textarea
                id="approvalText"
                value={config.approvalText || ""}
                onChange={(e) => updateConfig("approvalText", e.target.value)}
                placeholder="Message to display for human approval"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="timeout">Timeout (seconds, optional)</Label>
              <Input
                id="timeout"
                type="number"
                value={config.timeout || ""}
                onChange={(e) => updateConfig("timeout", parseInt(e.target.value))}
                placeholder="3600"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-sm text-muted-foreground">
              No configuration available for this node type.
            </p>
          </div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-2xl">{template.icon}</span>
            {template.label}
          </SheetTitle>
          <SheetDescription>
            Configure the properties for this node
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <Label>Node ID</Label>
            <Input value={node.id} disabled className="mt-1" />
          </div>

          <div>
            <Label htmlFor="label">Node Label</Label>
            <Input
              id="label"
              value={config.label || node.data?.label || template.label}
              onChange={(e) => updateConfig("label", e.target.value)}
              placeholder="Enter node label"
            />
          </div>

          {renderConfigFields()}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Configuration
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
