import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export const CustomNode = memo(({ data }: any) => {
  return (
    <div
      className="px-4 py-3 rounded-lg border-2 shadow-md min-w-[180px] bg-card hover:shadow-lg transition-shadow cursor-pointer"
      style={{ borderColor: data.color || "#3b82f6" }}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3" />
      
      <div className="flex items-center gap-2">
        {data.icon && (
          <div
            className="text-xl w-8 h-8 flex items-center justify-center rounded"
            style={{ backgroundColor: `${data.color}20` }}
          >
            {data.icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{data.label}</p>
          {data.config && Object.keys(data.config).length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Configured
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3" />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
