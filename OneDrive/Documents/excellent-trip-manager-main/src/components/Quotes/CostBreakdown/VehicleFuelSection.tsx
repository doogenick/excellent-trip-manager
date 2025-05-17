
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";
import { vehicleTypes } from "@/hooks/useTourCalculator";

interface VehicleFuelSectionProps {
  selectedVehicle: string;
  setSelectedVehicle: (value: string) => void;
  vehicleMarkup: number;
  setVehicleMarkup: (value: number) => void;
  fuelPrice: number;
  setFuelPrice: (value: number) => void;
  calculateVehicleCost: () => number;
  calculateFuelCost: () => number;
  currentPax: number;
}

export function VehicleFuelSection({
  selectedVehicle,
  setSelectedVehicle,
  vehicleMarkup,
  setVehicleMarkup,
  fuelPrice,
  setFuelPrice,
  calculateVehicleCost,
  calculateFuelCost,
  currentPax
}: VehicleFuelSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle & Fuel
        </CardTitle>
        <CardDescription>Configure transportation and fuel details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vehicle-type">Vehicle Type</Label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Vehicle Options</SelectLabel>
                {vehicleTypes.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} (${vehicle.dailyRate}/day)
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="vehicle-markup">Vehicle Markup: {vehicleMarkup}%</Label>
            <span className="text-sm font-medium">
              ${calculateVehicleCost().toLocaleString()}
            </span>
          </div>
          <Slider 
            id="vehicle-markup" 
            min={0} 
            max={50} 
            step={1} 
            value={[vehicleMarkup]} 
            onValueChange={(values) => setVehicleMarkup(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuel-price">Fuel Price ($/liter): {fuelPrice.toFixed(2)}</Label>
          <Slider 
            id="fuel-price" 
            min={1} 
            max={5} 
            step={0.1} 
            value={[fuelPrice]} 
            onValueChange={(values) => setFuelPrice(values[0])}
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm">
            <span>Estimated Fuel Cost:</span>
            <span className="font-medium">${calculateFuelCost().toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Fuel Cost per Person:</span>
            <span className="font-medium">${(calculateFuelCost() / currentPax).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
