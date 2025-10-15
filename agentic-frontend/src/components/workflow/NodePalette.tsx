import { Card } from "@/components/ui/card";
import { NODE_TEMPLATES } from "@/types/nodeTemplates";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NodePalette = () => {
  const onDragStart = (event: React.DragEvent, nodeKey: string) => {
    event.dataTransfer.setData("application/reactflow", nodeKey);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-foreground">Node Palette</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag nodes onto the canvas
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {Object.entries(NODE_TEMPLATES).map(([key, template]) => (
            <Card
              key={key}
              className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
              draggable
              onDragStart={(e) => onDragStart(e, key)}
              style={{
                borderLeft: `4px solid ${template.color}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="text-2xl w-10 h-10 flex items-center justify-center rounded"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  {template.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{template.label}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {template.type} node
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
