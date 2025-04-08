
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

const DataCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  onClick,
}: DataCardProps) => {
  return (
    <Card 
      className={cn(
        "bg-hotel-900 border-hotel-800 shadow-md",
        onClick && "cursor-pointer hoverable-card",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-hotel-300">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-hotel-400" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
            <span className="text-hotel-400">vs mois dernier</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
