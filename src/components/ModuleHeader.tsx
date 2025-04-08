
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ModuleHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  rightContent?: React.ReactNode;
}

const ModuleHeader = ({
  title,
  description,
  icon: Icon,
  className,
  rightContent,
}: ModuleHeaderProps) => {
  return (
    <div className={cn("flex justify-between items-center mb-6", className)}>
      <div className="flex items-center">
        {Icon && (
          <div className="mr-3 p-2 rounded-md bg-hotel-800 text-white">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          {description && <p className="text-hotel-400 mt-1">{description}</p>}
        </div>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default ModuleHeader;
