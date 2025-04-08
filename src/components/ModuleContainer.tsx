
import Dashboard from "@/modules/Dashboard";
import PricingModule from "@/modules/PricingModule";
import AvailabilityModule from "@/modules/AvailabilityModule";
import StaffModule from "@/modules/StaffModule";
import CompetitionModule from "@/modules/CompetitionModule";
import AlertsModule from "@/modules/AlertsModule";

type ModuleType = "dashboard" | "pricing" | "availability" | "staff" | "competition" | "alerts";

interface ModuleContainerProps {
  activeModule: ModuleType;
}

const ModuleContainer = ({ activeModule }: ModuleContainerProps) => {
  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "pricing":
        return <PricingModule />;
      case "availability":
        return <AvailabilityModule />;
      case "staff":
        return <StaffModule />;
      case "competition":
        return <CompetitionModule />;
      case "alerts":
        return <AlertsModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-full overflow-y-auto module-scrollbar">
      {renderModule()}
    </div>
  );
};

export default ModuleContainer;
