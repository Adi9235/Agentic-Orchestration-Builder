import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const res = await api.get("/api/workflows");
      return res.data;
    },
  });
}

export function useCreateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/workflows", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workflows"] }),
  });
}
