
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { api } from "../api/client";

export interface ApprovalPayload {
  approved: boolean;
  message?: string;
  [key: string]: any;
}

interface ApprovalVariables {
  run_id: string;
  node_id: string;
  approvalPayload: ApprovalPayload;
}

interface ApprovalResponse {
  message: string;
  status?: string;
}

export function useApproval(): UseMutationResult<
  ApprovalResponse, 
  Error,          
  ApprovalVariables 
> {
  const qc = useQueryClient();

  return useMutation<ApprovalResponse, Error, ApprovalVariables>({
    mutationFn: async ({ run_id, node_id, approvalPayload }) => {
      const res = await api.post(
        `/api/approvals/${encodeURIComponent(run_id)}/${encodeURIComponent(node_id)}/approve`,
        approvalPayload
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables?.run_id) {
        qc.invalidateQueries({ queryKey: ["run", variables.run_id] });
      }
      qc.invalidateQueries({ queryKey: ["runs"] });
    },
    onError: (err) => {
      console.error("Approval failed:", err);
    },
  });
}
