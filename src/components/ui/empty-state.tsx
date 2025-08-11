import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  isLoading?: boolean;
  isError?: boolean;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  isLoading = false,
  isError = false,
}: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
        <div className="rounded-full bg-muted p-3">
          {isError ? (
            <ExclamationTriangleIcon className="h-6 w-6 text-destructive" />
          ) : icon ? (
            icon
          ) : (
            <div className="h-6 w-6" />
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground max-w-xs">
          {description}
        </p>
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            disabled={isLoading}
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
