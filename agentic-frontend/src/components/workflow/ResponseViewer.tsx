import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResponseViewerProps {
  data: any;
}

export const ResponseViewer = ({ data }: ResponseViewerProps) => {
  if (!data) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No response data available
      </div>
    );
  }

  const renderValue = (value: any, key?: string): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>;
    }

    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value.toString()}
        </Badge>
      );
    }

    if (typeof value === "number") {
      return <span className="font-mono text-primary">{value}</span>;
    }

    if (typeof value === "string") {
      // Check if it's a URL
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {value}
          </a>
        );
      }
      return <span className="break-words">{value}</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-muted-foreground italic">Empty array</span>;
      }
      return (
        <div className="space-y-2 mt-2">
          {value.map((item, index) => (
            <Card key={index} className="p-3 bg-muted/30">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="shrink-0">
                  {index}
                </Badge>
                <div className="flex-1 min-w-0">{renderValue(item)}</div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span className="text-muted-foreground italic">Empty object</span>;
      }
      return (
        <div className="space-y-2 mt-2">
          {entries.map(([k, v]) => (
            <div key={k} className="border-l-2 border-primary/30 pl-3 py-1">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-sm shrink-0">{k}:</span>
                <div className="flex-1 min-w-0 text-sm">{renderValue(v, k)}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div className="space-y-3">
      {typeof data === "object" && !Array.isArray(data) ? (
        renderValue(data)
      ) : (
        <div className="bg-muted/50 rounded-lg p-4">
          {renderValue(data)}
        </div>
      )}
    </div>
  );
};
