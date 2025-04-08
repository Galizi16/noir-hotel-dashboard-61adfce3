
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  DollarSign, 
  CalendarDays, 
  Users, 
  TrendingUp, 
  BellRing, 
  Hotel 
} from "lucide-react";

type ModuleType = "dashboard" | "pricing" | "availability" | "staff" | "competition" | "alerts";

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

const moduleConfig = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: BarChart3,
  },
  {
    id: "pricing",
    label: "Tarifs",
    icon: DollarSign,
  },
  {
    id: "availability",
    label: "Disponibilités",
    icon: CalendarDays,
  },
  {
    id: "staff",
    label: "Personnel",
    icon: Users,
  },
  {
    id: "competition",
    label: "Concurrence",
    icon: TrendingUp,
  },
  {
    id: "alerts",
    label: "Alertes",
    icon: BellRing,
  },
];

const Sidebar = ({ activeModule, setActiveModule }: SidebarProps) => {
  return (
    <div className="w-64 h-screen bg-hotel-900 border-r border-hotel-800 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-hotel-800">
        <Hotel className="h-6 w-6 mr-2 text-white" />
        <h1 className="font-semibold text-lg text-white">Noir Hotel</h1>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {moduleConfig.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id as ModuleType)}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-md text-sm transition-colors",
                activeModule === module.id
                  ? "bg-hotel-800 text-white"
                  : "text-hotel-300 hover:text-white hover:bg-hotel-800/80"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {module.label}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-hotel-800">
        <div className="flex items-center space-x-3 text-xs text-hotel-400">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Système opérationnel</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
