
import { useEffect, useState } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { loadCSV } from "@/utils/csvUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  shift: string;
  phone: string;
  email: string;
  notes: string;
}

const shiftColors: Record<string, string> = {
  Jour: "bg-indigo-500",
  Matin: "bg-blue-500",
  Soir: "bg-purple-500",
  Nuit: "bg-slate-600",
};

const departmentIcons: Record<string, string> = {
  Direction: "👑",
  Réception: "🔑",
  Conciergerie: "🧳",
  Entretien: "🧹",
  Restauration: "🍽️",
};

const StaffModule = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [shiftFilter, setShiftFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await loadCSV('/data/staff.csv');
        setStaffData(data as StaffMember[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading staff data:", error);
        toast.error("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await loadCSV('/data/staff.csv');
      setStaffData(data as StaffMember[]);
      setIsLoading(false);
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erreur lors de l'actualisation");
      setIsLoading(false);
    }
  };

  const filteredStaff = staffData.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || member.department === departmentFilter;
    const matchesShift = !shiftFilter || member.shift === shiftFilter;
    
    return matchesSearch && matchesDepartment && matchesShift;
  });

  const departments = Array.from(new Set(staffData.map(member => member.department)));
  const shifts = Array.from(new Set(staffData.map(member => member.shift)));
  
  // Count staff by department for the summary
  const departmentCounts = departments.map(department => ({
    name: department,
    count: staffData.filter(member => member.department === department).length,
  }));

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  return (
    <div>
      <ModuleHeader
        title="Gestion du Personnel"
        description="Visualisez et gérez les informations de l'équipe"
        icon={Users}
        rightContent={
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            className="border-hotel-700 text-hotel-300"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="grid grid-cols-5 gap-4 mb-6">
        {departmentCounts.map(dept => (
          <Card key={dept.name} className="bg-hotel-900 border-hotel-800 p-4">
            <div className="text-xl mb-2">
              {departmentIcons[dept.name] || "👤"}
            </div>
            <p className="text-xs text-hotel-400">{dept.name}</p>
            <p className="text-xl font-bold text-white">{dept.count}</p>
          </Card>
        ))}
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-hotel-500" />
          <Input
            placeholder="Rechercher par nom ou poste..."
            className="pl-8 bg-hotel-900 border-hotel-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-48 bg-hotel-900 border-hotel-800 text-white">
            <SelectValue placeholder="Tous les services" />
          </SelectTrigger>
          <SelectContent className="bg-hotel-900 border-hotel-800 text-white">
            <SelectItem value="">Tous les services</SelectItem>
            {departments.map(department => (
              <SelectItem key={department} value={department}>{department}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-48 bg-hotel-900 border-hotel-800 text-white">
            <SelectValue placeholder="Tous les shifts" />
          </SelectTrigger>
          <SelectContent className="bg-hotel-900 border-hotel-800 text-white">
            <SelectItem value="">Tous les shifts</SelectItem>
            {shifts.map(shift => (
              <SelectItem key={shift} value={shift}>{shift}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => (
          <Card 
            key={member.id} 
            className="bg-hotel-900 border-hotel-800 shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-hotel-700">
                <AvatarFallback className="text-white">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-lg font-semibold text-white">
                  {member.name}
                </div>
                <div className="text-sm text-hotel-400">
                  {member.position}
                </div>
              </div>
              <Badge className={`${shiftColors[member.shift]} text-white`}>
                {member.shift}
              </Badge>
            </div>
            
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex">
                <span className="text-hotel-400 w-32">Département:</span>
                <span className="text-white">{member.department}</span>
              </div>
              <div className="flex">
                <span className="text-hotel-400 w-32">Téléphone:</span>
                <span className="text-white">{member.phone}</span>
              </div>
              <div className="flex">
                <span className="text-hotel-400 w-32">Email:</span>
                <span className="text-white">{member.email}</span>
              </div>
              {member.notes && (
                <div className="mt-2 bg-hotel-800 p-2 rounded text-hotel-300 text-xs">
                  {member.notes}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffModule;
