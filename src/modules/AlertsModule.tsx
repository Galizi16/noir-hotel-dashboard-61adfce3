
import { useEffect, useState } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { Button } from "@/components/ui/button";
import { BellRing, RefreshCw, Check, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { loadCSV } from "@/utils/csvUtils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AlertData {
  id: string;
  date: string;
  priority: string;
  module: string;
  message: string;
  status: string;
}

const priorityColors: Record<string, string> = {
  Haute: "bg-red-600",
  Moyenne: "bg-amber-500",
  Basse: "bg-blue-500",
};

const statusColors: Record<string, string> = {
  "Non résolu": "bg-red-500/10 text-red-500 border-red-500/30",
  "En cours": "bg-amber-500/10 text-amber-500 border-amber-500/30",
  "Résolu": "bg-green-500/10 text-green-500 border-green-500/30",
  "Information": "bg-blue-500/10 text-blue-500 border-blue-500/30",
};

const moduleIcons: Record<string, string> = {
  Disponibilités: "🏨",
  Tarifs: "💰",
  Staff: "👥",
  Concurrence: "📊",
};

const AlertsModule = () => {
  const [alertsData, setAlertsData] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await loadCSV('/data/alerts.csv');
        setAlertsData(data as AlertData[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading alerts data:", error);
        toast.error("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await loadCSV('/data/alerts.csv');
      setAlertsData(data as AlertData[]);
      setIsLoading(false);
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erreur lors de l'actualisation");
      setIsLoading(false);
    }
  };

  const markAsResolved = (id: string) => {
    const updatedAlerts = alertsData.map(alert => 
      alert.id === id ? { ...alert, status: "Résolu" } : alert
    );
    setAlertsData(updatedAlerts);
    toast.success("Alerte marquée comme résolue");
  };

  const filteredAlerts = alertsData.filter(alert => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unresolved") return alert.status === "Non résolu" || alert.status === "En cours";
    if (activeFilter === "resolved") return alert.status === "Résolu";
    if (activeFilter === "info") return alert.status === "Information";
    return true;
  });

  // Count alerts by status
  const unresolved = alertsData.filter(a => a.status === "Non résolu").length;
  const inProgress = alertsData.filter(a => a.status === "En cours").length;
  const resolved = alertsData.filter(a => a.status === "Résolu").length;
  const info = alertsData.filter(a => a.status === "Information").length;

  return (
    <div>
      <ModuleHeader
        title="Alertes et Notifications"
        description="Gérez les alertes importantes pour l'hôtel"
        icon={BellRing}
        rightContent={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="border-hotel-700 text-hotel-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle alerte
            </Button>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              className="border-hotel-700 text-hotel-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card 
          className={cn(
            "border-red-500/30 bg-red-500/10 cursor-pointer",
            activeFilter === "unresolved" && "ring-2 ring-red-500"
          )}
          onClick={() => setActiveFilter("unresolved")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-red-400">Non résolues</p>
              <Badge variant="outline" className="bg-red-500 text-white border-0">
                {unresolved}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-white mt-1">{unresolved + inProgress} alertes</p>
          </CardContent>
        </Card>
        
        <Card 
          className={cn(
            "border-green-500/30 bg-green-500/10 cursor-pointer",
            activeFilter === "resolved" && "ring-2 ring-green-500"
          )}
          onClick={() => setActiveFilter("resolved")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-green-400">Résolues</p>
              <Badge variant="outline" className="bg-green-500 text-white border-0">
                {resolved}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-white mt-1">{resolved} alertes</p>
          </CardContent>
        </Card>
        
        <Card 
          className={cn(
            "border-blue-500/30 bg-blue-500/10 cursor-pointer",
            activeFilter === "info" && "ring-2 ring-blue-500"
          )}
          onClick={() => setActiveFilter("info")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-400">Informations</p>
              <Badge variant="outline" className="bg-blue-500 text-white border-0">
                {info}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-white mt-1">{info} notifications</p>
          </CardContent>
        </Card>
        
        <Card 
          className={cn(
            "border-hotel-800 bg-hotel-900 cursor-pointer",
            activeFilter === "all" && "ring-2 ring-white"
          )}
          onClick={() => setActiveFilter("all")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-hotel-400">Toutes</p>
              <Badge variant="outline" className="bg-hotel-800 text-white border-0">
                {alertsData.length}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-white mt-1">Tout afficher</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          // Format the date
          let formattedDate = alert.date;
          try {
            // Attempt to parse the date and format it
            const dateObj = new Date(alert.date);
            formattedDate = format(dateObj, 'dd MMMM yyyy', { locale: fr });
          } catch (error) {
            // If the date can't be parsed, use the original
            console.error("Invalid date format:", alert.date);
          }
          
          return (
            <Card 
              key={alert.id}
              className={cn(
                "border-hotel-800 shadow-md",
                statusColors[alert.status].split(' ')[0],
                statusColors[alert.status].split(' ')[2]
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 mr-2",
                    priorityColors[alert.priority]
                  )} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-medium text-white">{alert.message}</p>
                        <div className="flex space-x-4 text-sm mt-1">
                          <span className="text-hotel-400">{formattedDate}</span>
                          <span>
                            {moduleIcons[alert.module] || "📌"} {alert.module}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={cn(
                          "text-xs",
                          statusColors[alert.status].split(' ')[1]
                        )}>
                          {alert.status}
                        </Badge>
                        <Badge className={priorityColors[alert.priority]}>
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    {(alert.status === "Non résolu" || alert.status === "En cours") && (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-hotel-900 hover:bg-hotel-800 border-hotel-800"
                          onClick={() => markAsResolved(alert.id)}
                        >
                          <Check className="h-3 w-3 mr-2" />
                          Marquer comme résolu
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsModule;
