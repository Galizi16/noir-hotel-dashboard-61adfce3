
import { useEffect, useState } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { Button } from "@/components/ui/button";
import { CalendarDays, RefreshCw, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { loadCSV } from "@/utils/csvUtils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomData {
  roomNumber: string;
  roomType: string;
  status: string;
  occupancy: string;
  checkIn: string;
  checkOut: string;
  guest: string;
  remarks: string;
}

const statusColors: Record<string, string> = {
  Available: "bg-green-500",
  Occupied: "bg-red-500",
  Reserved: "bg-blue-500",
  Maintenance: "bg-yellow-500",
};

const AvailabilityModule = () => {
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await loadCSV('/data/availability.csv');
        setRoomsData(data as RoomData[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading availability data:", error);
        toast.error("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await loadCSV('/data/availability.csv');
      setRoomsData(data as RoomData[]);
      setIsLoading(false);
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erreur lors de l'actualisation");
      setIsLoading(false);
    }
  };

  const filteredRooms = roomsData.filter(room => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.guest.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || room.status === statusFilter;
    const matchesType = !typeFilter || room.roomType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const availableCount = roomsData.filter(room => room.status === "Available").length;
  const occupiedCount = roomsData.filter(room => room.status === "Occupied").length;
  const reservedCount = roomsData.filter(room => room.status === "Reserved").length;
  const maintenanceCount = roomsData.filter(room => room.status === "Maintenance").length;

  const roomTypes = Array.from(new Set(roomsData.map(room => room.roomType)));
  const statuses = Array.from(new Set(roomsData.map(room => room.status)));

  return (
    <div>
      <ModuleHeader
        title="Disponibilité des Chambres"
        description="Visualisez et gérez l'état des chambres"
        icon={CalendarDays}
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
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-500/20 border-green-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-green-400 mb-1">Disponibles</p>
            <p className="text-2xl font-bold text-white">{availableCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/20 border-red-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-red-400 mb-1">Occupées</p>
            <p className="text-2xl font-bold text-white">{occupiedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/20 border-blue-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-blue-400 mb-1">Réservées</p>
            <p className="text-2xl font-bold text-white">{reservedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/20 border-yellow-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-yellow-400 mb-1">Maintenance</p>
            <p className="text-2xl font-bold text-white">{maintenanceCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-hotel-500" />
          <Input
            placeholder="Rechercher par numéro ou client..."
            className="pl-8 bg-hotel-900 border-hotel-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-hotel-900 border-hotel-800 text-white">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent className="bg-hotel-900 border-hotel-800 text-white">
            <SelectItem value="">Tous les statuts</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-hotel-900 border-hotel-800 text-white">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent className="bg-hotel-900 border-hotel-800 text-white">
            <SelectItem value="">Tous les types</SelectItem>
            {roomTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => (
          <Card 
            key={room.roomNumber} 
            className="bg-hotel-900 border-hotel-800 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-lg font-semibold text-white">
                    Chambre {room.roomNumber}
                  </div>
                  <div className="text-sm text-hotel-400">{room.roomType}</div>
                </div>
                <Badge className={`${statusColors[room.status]} text-white`}>
                  {room.status}
                </Badge>
              </div>
              
              {room.status !== "Available" && (
                <>
                  <div className="text-sm mb-1">
                    <span className="text-hotel-400">Client:</span>{" "}
                    <span className="text-white">{room.guest || "-"}</span>
                  </div>
                  
                  {room.status !== "Maintenance" && (
                    <div className="flex space-x-4 text-xs mb-2">
                      <div>
                        <span className="text-hotel-400">Arrivée:</span>{" "}
                        <span className="text-white">{room.checkIn || "-"}</span>
                      </div>
                      <div>
                        <span className="text-hotel-400">Départ:</span>{" "}
                        <span className="text-white">{room.checkOut || "-"}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {room.remarks && (
                <div className="text-xs bg-hotel-800 p-2 rounded mt-2">
                  <span className="text-hotel-400">Remarques:</span>{" "}
                  <span className="text-hotel-300">{room.remarks}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityModule;
