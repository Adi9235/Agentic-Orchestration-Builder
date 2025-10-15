import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useRuns() {
  return useQuery({
    queryKey: ["runs"],
    queryFn: async () => {
      const res = await api.get("/api/runs");
      return res.data;
    },
  });
}

export function useRun(run_id: string) {
  return useQuery({
    queryKey: ["run", run_id],
    queryFn: async () => {
      const res = await api.get(`/api/runs/${run_id}`);
      return res.data;
    },
    enabled: !!run_id,
  });
}

export function useStartRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/runs", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["runs"] }),
  });
}
