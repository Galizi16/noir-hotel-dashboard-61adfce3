
import { useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import ModuleContainer from "./ModuleContainer";
import { Toaster } from "@/components/ui/sonner";

type ModuleType = "dashboard" | "pricing" | "availability" | "staff" | "competition" | "alerts";

const MainLayout = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className={cn("flex-1 overflow-hidden", activeModule !== "dashboard" && "p-6")}>
        <ModuleContainer activeModule={activeModule} />
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
