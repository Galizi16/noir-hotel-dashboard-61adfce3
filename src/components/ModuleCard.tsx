
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  badgeCount?: number;
  className?: string;
}

const ModuleCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  badgeCount,
  className,
}: ModuleCardProps) => {
  return (
    <Card
      className={cn(
        "bg-hotel-900 border-hotel-800 cursor-pointer transition-all hoverable-card",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 relative">
        <div className="absolute right-6 top-6">
          <Icon className="h-7 w-7 text-hotel-400" />
        </div>
        {badgeCount !== undefined && badgeCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badgeCount}
          </div>
        )}
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-hotel-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-1 w-full bg-hotel-800 rounded-full">
          <div className="bg-hotel-600 h-1 rounded-full w-3/4"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
