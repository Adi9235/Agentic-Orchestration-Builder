export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://agentic-orchestration-builder.onrender.com";

export const STATUS_COLORS: Record<string, string> = {
  running: "bg-blue-100 text-blue-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
};
