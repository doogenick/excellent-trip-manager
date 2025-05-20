import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleDetails } from "@/types/quotes";

interface TransitDetailsProps {
  startTransitKm: number;
  setStartTransitKm: (km: number) => void;
  endTransitKm: number;
  setEndTransitKm: (km: number) => void;
  fuelPricePerLiter: number;
  setFuelPricePerLiter: (price: number) => void;
  totalDistance: number; // From itinerary
  vehicles: VehicleDetails[];
}

export function TransitDetails({
  startTransitKm,
  setStartTransitKm,
  endTransitKm,
  setEndTransitKm,
  fuelPricePerLiter,
  setFuelPricePerLiter,
  totalDistance,
  vehicles
}: TransitDetailsProps) {
  // Total distance including transit
  const totalDistanceWithTransit = totalDistance + startTransitKm + endTransitKm;

  // Calculate fuel consumption for each vehicle
  const calculateFuelBreakdown = () => {
    return vehicles.map(vehicle => {
      const litersPer100km = 100 / vehicle.fuelConsumption;
      const litersNeeded = (totalDistanceWithTransit / 100) * litersPer100km;
      const fuelCost = litersNeeded * fuelPricePerLiter;
      
      return {
        vehicleName: vehicle.name,
        vehicleType: vehicle.type,
        fuelEfficiency: vehicle.fuelConsumption,
        litersNeeded,
        fuelCost
      };
    });
  };

  const fuelBreakdown = calculateFuelBreakdown();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-4 space-y-4">
          <h3 className="text-md font-medium mb-2">Transit & Fuel Details</h3>
          <p className="text-sm text-muted-foreground">
            Add transit kilometers before and after the tour, and the current fuel price for accurate cost calculations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTransitKm">Transit Kilometers (Start)</Label>
              <Input
                id="startTransitKm"
                type="number"
                min="0"
                value={startTransitKm}
                onChange={(e) => setStartTransitKm(parseInt(e.target.value) || 0)}
                placeholder="Distance to start point"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTransitKm">Transit Kilometers (End)</Label>
              <Input
                id="endTransitKm"
                type="number"
                min="0"
                value={endTransitKm}
                onChange={(e) => setEndTransitKm(parseInt(e.target.value) || 0)}
                placeholder="Distance from end point"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelPrice">Fuel Price per Liter</Label>
              <Input
                id="fuelPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={fuelPricePerLiter}
                onChange={(e) => setFuelPricePerLiter(parseFloat(e.target.value) || 0)}
                placeholder="Current fuel price"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Itinerary Distance:</span>
              <span>{totalDistance} km</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Transit Distance:</span>
              <span>{startTransitKm + endTransitKm} km</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-1 border-t mt-1">
              <span>Total Distance:</span>
              <span>{totalDistanceWithTransit} km</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {vehicles.length > 0 && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <h3 className="text-md font-medium mb-2">Fuel Consumption Breakdown</h3>
            
            <div className="space-y-3">
              {fuelBreakdown.map((item, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.vehicleName}</span>
                    <span className="text-sm text-muted-foreground">{item.vehicleType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fuel Efficiency:</span>
                      <span className="float-right">{item.fuelEfficiency.toFixed(1)} km/L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fuel Required:</span>
                      <span className="float-right">{item.litersNeeded.toFixed(1)} L</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t mt-1">
                      <span className="font-medium">Estimated Fuel Cost:</span>
                      <span className="float-right font-medium">${item.fuelCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total Fuel Cost */}
              <div className="p-3 border rounded-md bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Estimated Fuel Cost:</span>
                  <span className="font-bold">
                    ${fuelBreakdown.reduce((total, item) => total + item.fuelCost, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
