import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
  // Ensure the value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={cn(
        "w-full h-1.5 bg-muted rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
};
