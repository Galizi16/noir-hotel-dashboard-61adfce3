
import { useEffect, useState } from "react";
import ModuleCard from "@/components/ModuleCard";
import { 
  DollarSign, 
  CalendarDays, 
  Users, 
  TrendingUp, 
  BellRing,
  Hotel,
  Wallet,
  Percent,
  UserCheck 
} from "lucide-react";
import DataCard from "@/components/DataCard";
import { loadCSV } from "@/utils/csvUtils";

type ModuleType = "dashboard" | "pricing" | "availability" | "staff" | "competition" | "alerts";

interface DashboardProps {
  setActiveModule?: (module: ModuleType) => void;
}

const Dashboard = ({ setActiveModule }: DashboardProps) => {
  const [alertsCount, setAlertsCount] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [avgDailyRate, setAvgDailyRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load alerts data
        const alertsData = await loadCSV('/data/alerts.csv');
        const unresolvedAlerts = alertsData.filter(alert => 
          alert.status === 'Non résolu' || alert.status === 'En cours'
        );
        setAlertsCount(unresolvedAlerts.length);
        
        // Load availability data
        const availabilityData = await loadCSV('/data/availability.csv');
        const available = availabilityData.filter(room => room.status === 'Available').length;
        setAvailableRooms(available);
        
        // Calculate occupancy rate
        const totalRooms = availabilityData.length;
        const occupied = availabilityData.filter(room => 
          room.status === 'Occupied' || room.status === 'Reserved'
        ).length;
        setOccupancyRate(Math.round((occupied / totalRooms) * 100));
        
        // Calculate average daily rate from pricing data
        const pricingData = await loadCSV('/data/pricing.csv');
        const basePrices = pricingData
          .filter(price => price.rate === 'Base')
          .map(price => parseInt(price.basePrice));
        const avgRate = basePrices.reduce((sum, price) => sum + price, 0) / basePrices.length;
        setAvgDailyRate(Math.round(avgRate));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    
    fetchData();
  }, []);

  const handleModuleClick = (module: ModuleType) => {
    if (setActiveModule) {
      setActiveModule(module);
    }
  };

  return (
    <div className="p-6 bg-hotel-950 min-h-screen">
      <div className="flex items-center mb-8">
        <Hotel className="h-8 w-8 mr-3 text-white" />
        <h1 className="text-3xl font-bold text-white">Noir Hotel Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DataCard 
          title="Taux d'occupation" 
          value={`${occupancyRate}%`} 
          icon={Percent}
          trend={{ value: 3.2, isPositive: true }}
        />
        <DataCard 
          title="Chambres disponibles" 
          value={availableRooms} 
          icon={Hotel}
          trend={{ value: 1.5, isPositive: false }}
        />
        <DataCard 
          title="Tarif journalier moyen" 
          value={`${avgDailyRate} €`} 
          icon={Wallet}
          trend={{ value: 5.8, isPositive: true }}
        />
        <DataCard 
          title="Personnel présent" 
          value="12/15" 
          icon={UserCheck}
          trend={{ value: 0, isPositive: true }}
        />
      </div>
      
      <h2 className="text-xl font-semibold text-white mb-6">Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard
          title="Tarifs"
          description="Gestion des prix et catégories de chambres"
          icon={DollarSign}
          onClick={() => handleModuleClick("pricing")}
        />
        <ModuleCard
          title="Disponibilités"
          description="État et réservation des chambres"
          icon={CalendarDays}
          onClick={() => handleModuleClick("availability")}
        />
        <ModuleCard
          title="Personnel"
          description="Plannings et information du staff"
          icon={Users}
          onClick={() => handleModuleClick("staff")}
        />
        <ModuleCard
          title="Concurrence"
          description="Analyse des hôtels concurrents"
          icon={TrendingUp}
          onClick={() => handleModuleClick("competition")}
        />
        <ModuleCard
          title="Alertes"
          description="Notifications et messages importants"
          icon={BellRing}
          badgeCount={alertsCount}
          onClick={() => handleModuleClick("alerts")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
