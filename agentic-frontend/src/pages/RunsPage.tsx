import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import RunRow from "../components/RunRow";
import { useNavigate } from "react-router-dom";

export default function RunsPage() {
  const navigate = useNavigate();
  const { data: runs = [], isLoading } = useQuery({
    queryKey: ["runs"],
    queryFn: async () => (await api.get("/api/runs")).data,
  });

  const handleReplay = async (run_id: string) => {
    try {
      await api.post(`/api/runs/replay/${run_id}`);
      alert("Replay started");
    } catch (err) {
      console.error(err);
      alert("Replay failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Workflow Runs</h2>
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6">Loading runs...</div>
        ) : runs.length === 0 ? (
          <div className="p-6 text-gray-500">No runs yet.</div>
        ) : (
          runs.map((r: any) => (
            <RunRow
              key={r.run_id}
              run={r}
              onView={(id) => navigate(`/runs/${id}`)}
              onReplay={handleReplay}
            />
          ))
        )}
      </div>
    </div>
  );
}
