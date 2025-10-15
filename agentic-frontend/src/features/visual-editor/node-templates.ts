export type NodeTemplate = {
  type: string; 
  label: string; 
  icon?: string; 
  defaultConfig: Record<string, any>; 
  color: string;
};

export const NODE_TEMPLATES: Record<string, NodeTemplate> = {
  start: {
    type: "start",
    label: "Start Node",
    icon: "🚀",
    defaultConfig: {},
    color: "#22c55e",
  },
  agent: {
    type: "agent",
    label: "Agent Node",
    icon: "🤖",
    defaultConfig: {
      prompt: "Say hello and continue.",
    },
    color: "#3b82f6",
  },
  http: {
    type: "http",
    label: "HTTP Node",
    icon: "🌐",
    defaultConfig: {
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      body: {},
    },
    color: "#eab308",
  },
  plugin_slack: {
    type: "plugin",
    label: "Slack Plugin",
    icon: "💬",
    defaultConfig: {
      pluginType: "slack",
      text: "Workflow executed successfully!",
    },
    color: "#8b5cf6",
  },
  plugin_email: {
    type: "plugin",
    label: "Email Plugin",
    icon: "📧",
    defaultConfig: {
      pluginType: "email",
      to: "aditya.tomar2118@gmail.com",
      subject: "Agentic Workflow Notification",
      text: "Your workflow executed successfully!",
    },
    color: "#0ea5e9",
  },
  human: {
    type: "human",
    label: "Human Approval",
    icon: "🧍‍♂️",
    defaultConfig: {
      approvalText: "Approve this task?",
    },
    color: "#f97316",
  },
};