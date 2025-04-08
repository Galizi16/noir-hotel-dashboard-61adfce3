
import { useEffect, useState } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { Button } from "@/components/ui/button";
import { TrendingUp, RefreshCw, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { loadCSV } from "@/utils/csvUtils";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Label
} from 'recharts';

interface CompetitorData {
  hotelName: string;
  stars: string;
  standardPrice: string;
  deluxePrice: string;
  suitePrice: string;
  familyPrice: string;
  promotion: string;
  website: string;
  lastUpdated: string;
}

const CompetitionModule = () => {
  const [competitorsData, setCompetitorsData] = useState<CompetitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ownPricing, setOwnPricing] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Load competition data
        const competitionData = await loadCSV('/data/competition.csv');
        setCompetitorsData(competitionData as CompetitorData[]);
        
        // Load own pricing data for comparison
        const pricingData = await loadCSV('/data/pricing.csv');
        const basePricing = pricingData.filter((item: any) => item.rate === 'Base');
        
        if (basePricing.length > 0) {
          const ownPrices = {
            hotelName: "Noir Hotel",
            stars: "4",
            standardPrice: basePricing.find((p: any) => p.roomType === 'Standard')?.basePrice || '0',
            deluxePrice: basePricing.find((p: any) => p.roomType === 'Deluxe')?.basePrice || '0',
            suitePrice: basePricing.find((p: any) => p.roomType === 'Suite')?.basePrice || '0',
            familyPrice: basePricing.find((p: any) => p.roomType === 'Family')?.basePrice || '0',
            promotion: "N/A",
            website: "",
            lastUpdated: new Date().toISOString().split('T')[0],
          };
          
          setOwnPricing(ownPrices);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading competition data:", error);
        toast.error("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await loadCSV('/data/competition.csv');
      setCompetitorsData(data as CompetitorData[]);
      setIsLoading(false);
      toast.success("Données actualisées");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erreur lors de l'actualisation");
      setIsLoading(false);
    }
  };

  // Prepare data for the bar chart
  const prepareChartData = () => {
    if (!competitorsData.length || !ownPricing) return [];
    
    const chartData = [
      {
        name: 'Standard',
        "Noir Hotel": parseInt(ownPricing.standardPrice),
        "Concurrence (moy)": Math.round(
          competitorsData.reduce((sum, comp) => sum + parseInt(comp.standardPrice), 0) / competitorsData.length
        ),
      },
      {
        name: 'Deluxe',
        "Noir Hotel": parseInt(ownPricing.deluxePrice),
        "Concurrence (moy)": Math.round(
          competitorsData.reduce((sum, comp) => sum + parseInt(comp.deluxePrice), 0) / competitorsData.length
        ),
      },
      {
        name: 'Suite',
        "Noir Hotel": parseInt(ownPricing.suitePrice),
        "Concurrence (moy)": Math.round(
          competitorsData.reduce((sum, comp) => sum + parseInt(comp.suitePrice), 0) / competitorsData.length
        ),
      },
      {
        name: 'Family',
        "Noir Hotel": parseInt(ownPricing.familyPrice),
        "Concurrence (moy)": Math.round(
          competitorsData.reduce((sum, comp) => sum + parseInt(comp.familyPrice), 0) / competitorsData.length
        ),
      },
    ];
    
    return chartData;
  };

  const chartData = prepareChartData();

  // Calculate price differences for insights
  const calculatePriceDifferences = () => {
    if (!competitorsData.length || !ownPricing) return [];
    
    const avgStandard = Math.round(
      competitorsData.reduce((sum, comp) => sum + parseInt(comp.standardPrice), 0) / competitorsData.length
    );
    const avgDeluxe = Math.round(
      competitorsData.reduce((sum, comp) => sum + parseInt(comp.deluxePrice), 0) / competitorsData.length
    );
    const avgSuite = Math.round(
      competitorsData.reduce((sum, comp) => sum + parseInt(comp.suitePrice), 0) / competitorsData.length
    );
    const avgFamily = Math.round(
      competitorsData.reduce((sum, comp) => sum + parseInt(comp.familyPrice), 0) / competitorsData.length
    );
    
    return [
      {
        type: 'Standard',
        own: parseInt(ownPricing.standardPrice),
        avg: avgStandard,
        diff: parseInt(ownPricing.standardPrice) - avgStandard,
        diffPercent: Math.round(
          ((parseInt(ownPricing.standardPrice) - avgStandard) / avgStandard) * 100
        ),
      },
      {
        type: 'Deluxe',
        own: parseInt(ownPricing.deluxePrice),
        avg: avgDeluxe,
        diff: parseInt(ownPricing.deluxePrice) - avgDeluxe,
        diffPercent: Math.round(
          ((parseInt(ownPricing.deluxePrice) - avgDeluxe) / avgDeluxe) * 100
        ),
      },
      {
        type: 'Suite',
        own: parseInt(ownPricing.suitePrice),
        avg: avgSuite,
        diff: parseInt(ownPricing.suitePrice) - avgSuite,
        diffPercent: Math.round(
          ((parseInt(ownPricing.suitePrice) - avgSuite) / avgSuite) * 100
        ),
      },
      {
        type: 'Family',
        own: parseInt(ownPricing.familyPrice),
        avg: avgFamily,
        diff: parseInt(ownPricing.familyPrice) - avgFamily,
        diffPercent: Math.round(
          ((parseInt(ownPricing.familyPrice) - avgFamily) / avgFamily) * 100
        ),
      },
    ];
  };

  const priceDifferences = calculatePriceDifferences();

  return (
    <div>
      <ModuleHeader
        title="Analyse de la Concurrence"
        description="Comparez vos tarifs avec ceux des concurrents"
        icon={TrendingUp}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-hotel-900 border-hotel-800 lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Comparaison de prix</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="name" stroke="#a3a3a3" />
                  <YAxis stroke="#a3a3a3">
                    <Label
                      value="Prix (€)"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: 'middle', fill: '#a3a3a3' }}
                    />
                  </YAxis>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Legend />
                  <Bar dataKey="Noir Hotel" fill="#9333ea" />
                  <Bar dataKey="Concurrence (moy)" fill="#404040" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-hotel-900 border-hotel-800">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Insights</h3>
            <div className="space-y-4">
              {priceDifferences.map((diff) => (
                <div key={diff.type} className="border-b border-hotel-800 pb-3 last:border-0">
                  <div className="text-sm font-medium text-white mb-1">{diff.type}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-hotel-400">Noir Hotel</span>
                    <span className="text-white">{diff.own} €</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-hotel-400">Moyenne concurrence</span>
                    <span className="text-white">{diff.avg} €</span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-hotel-400">Différence</span>
                    <span className={diff.diff > 0 ? 'text-green-500' : diff.diff < 0 ? 'text-red-500' : 'text-white'}>
                      {diff.diff > 0 ? '+' : ''}{diff.diff} € ({diff.diffPercent > 0 ? '+' : ''}{diff.diffPercent}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-hotel-900 border-hotel-800">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-white mb-4">Détails des Concurrents</h3>
          <Table>
            <TableHeader className="bg-hotel-800">
              <TableRow>
                <TableHead className="text-hotel-300">Hôtel</TableHead>
                <TableHead className="text-hotel-300">Étoiles</TableHead>
                <TableHead className="text-hotel-300">Standard</TableHead>
                <TableHead className="text-hotel-300">Deluxe</TableHead>
                <TableHead className="text-hotel-300">Suite</TableHead>
                <TableHead className="text-hotel-300">Family</TableHead>
                <TableHead className="text-hotel-300">Promotion</TableHead>
                <TableHead className="text-hotel-300">Dernière MAJ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownPricing && (
                <TableRow className="bg-purple-900/20">
                  <TableCell className="font-medium text-white">Noir Hotel</TableCell>
                  <TableCell>{ownPricing.stars}</TableCell>
                  <TableCell>{ownPricing.standardPrice} €</TableCell>
                  <TableCell>{ownPricing.deluxePrice} €</TableCell>
                  <TableCell>{ownPricing.suitePrice} €</TableCell>
                  <TableCell>{ownPricing.familyPrice} €</TableCell>
                  <TableCell>{ownPricing.promotion}</TableCell>
                  <TableCell>{ownPricing.lastUpdated}</TableCell>
                </TableRow>
              )}
              {competitorsData.map((competitor) => (
                <TableRow key={competitor.hotelName}>
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center">
                      {competitor.hotelName}
                      {competitor.website && (
                        <Button variant="ghost" size="icon" className="w-6 h-6 ml-2 text-blue-500">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{competitor.stars}</TableCell>
                  <TableCell>{competitor.standardPrice} €</TableCell>
                  <TableCell>{competitor.deluxePrice} €</TableCell>
                  <TableCell>{competitor.suitePrice} €</TableCell>
                  <TableCell>{competitor.familyPrice} €</TableCell>
                  <TableCell className="text-hotel-400">{competitor.promotion}</TableCell>
                  <TableCell>{competitor.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionModule;
