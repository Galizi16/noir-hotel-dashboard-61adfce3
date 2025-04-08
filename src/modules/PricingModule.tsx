
import { useEffect, useState } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, Upload, Plus, RefreshCw } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { loadCSV, saveCSV } from "@/utils/csvUtils";

interface PricingData {
  roomType: string;
  rate: string;
  basePrice: string;
  weekend: string;
  seasonal: string;
  description: string;
}

const PricingModule = () => {
  const [pricingData, setPricingData] = useState<PricingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<PricingData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await loadCSV('/data/pricing.csv');
        setPricingData(data as PricingData[]);
        setEditedData(data as PricingData[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading pricing data:", error);
        toast.error("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await loadCSV('/data/pricing.csv');
      setPricingData(data as PricingData[]);
      setEditedData(data as PricingData[]);
      setIsLoading(false);
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erreur lors de l'actualisation");
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    saveCSV(pricingData, 'pricing_export.csv');
    toast.success("Données exportées avec succès");
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedData([...pricingData]);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData([...pricingData]);
  };

  const handleSave = () => {
    setPricingData(editedData);
    setEditMode(false);
    toast.success("Modifications enregistrées");
    // In a real app, we would save to the server/file here
  };

  const handleInputChange = (rowIndex: number, field: keyof PricingData, value: string) => {
    const updated = [...editedData];
    updated[rowIndex][field] = value;
    setEditedData(updated);
  };

  const roomTypes = Array.from(new Set(pricingData.map(item => item.roomType)));

  return (
    <div>
      <ModuleHeader
        title="Gestion des Tarifs"
        description="Gérez et modifiez les tarifs des différentes catégories de chambres"
        icon={DollarSign}
        rightContent={
          <div className="flex space-x-2">
            {editMode ? (
              <>
                <Button 
                  onClick={handleSave} 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Enregistrer
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  className="border-hotel-700 text-hotel-300"
                >
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleEdit} 
                  variant="outline"
                  className="border-hotel-700 text-hotel-300"
                >
                  Modifier
                </Button>
                <Button 
                  onClick={handleExport} 
                  variant="outline"
                  className="border-hotel-700 text-hotel-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button 
                  onClick={handleRefresh} 
                  variant="outline"
                  className="border-hotel-700 text-hotel-300"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        }
      />
      
      <div className="space-y-4">
        {roomTypes.map((roomType) => (
          <Card key={roomType} className="bg-hotel-900 border-hotel-800 shadow-md p-4">
            <h3 className="text-lg font-medium text-white mb-3">{roomType}</h3>
            <Table>
              <TableHeader className="bg-hotel-800">
                <TableRow>
                  <TableHead className="text-hotel-300">Catégorie</TableHead>
                  <TableHead className="text-hotel-300">Tarif de base (€)</TableHead>
                  <TableHead className="text-hotel-300">Week-end (€)</TableHead>
                  <TableHead className="text-hotel-300">Haute saison (€)</TableHead>
                  <TableHead className="text-hotel-300">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData
                  .filter(item => item.roomType === roomType)
                  .map((row, index) => {
                    // Find the actual index in the full array
                    const fullIndex = pricingData.findIndex(
                      item => item.roomType === row.roomType && item.rate === row.rate
                    );
                    
                    return (
                      <TableRow key={`${row.roomType}-${row.rate}`}>
                        <TableCell className="font-medium text-white">{row.rate}</TableCell>
                        <TableCell>
                          {editMode ? (
                            <input
                              type="number"
                              value={editedData[fullIndex].basePrice}
                              onChange={(e) => handleInputChange(fullIndex, 'basePrice', e.target.value)}
                              className="w-full bg-hotel-800 border border-hotel-700 rounded px-2 py-1 text-white"
                            />
                          ) : (
                            row.basePrice
                          )}
                        </TableCell>
                        <TableCell>
                          {editMode ? (
                            <input
                              type="number"
                              value={editedData[fullIndex].weekend}
                              onChange={(e) => handleInputChange(fullIndex, 'weekend', e.target.value)}
                              className="w-full bg-hotel-800 border border-hotel-700 rounded px-2 py-1 text-white"
                            />
                          ) : (
                            row.weekend
                          )}
                        </TableCell>
                        <TableCell>
                          {editMode ? (
                            <input
                              type="number"
                              value={editedData[fullIndex].seasonal}
                              onChange={(e) => handleInputChange(fullIndex, 'seasonal', e.target.value)}
                              className="w-full bg-hotel-800 border border-hotel-700 rounded px-2 py-1 text-white"
                            />
                          ) : (
                            row.seasonal
                          )}
                        </TableCell>
                        <TableCell className="text-hotel-400">
                          {editMode ? (
                            <input
                              type="text"
                              value={editedData[fullIndex].description}
                              onChange={(e) => handleInputChange(fullIndex, 'description', e.target.value)}
                              className="w-full bg-hotel-800 border border-hotel-700 rounded px-2 py-1 text-white"
                            />
                          ) : (
                            row.description
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingModule;
