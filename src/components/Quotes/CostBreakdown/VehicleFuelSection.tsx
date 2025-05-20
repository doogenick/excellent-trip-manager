
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { vehicleTypes } from "@/hooks/tourCalculator/tourCalculatorData";

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
  customVehicleName: string;
  setCustomVehicleName: (value: string) => void;
  customDailyRate: number;
  setCustomDailyRate: (value: number) => void;
  customFuelConsumption: number;
  setCustomFuelConsumption: (value: number) => void;
  vehicleNotes: string;
  setVehicleNotes: (value: string) => void;
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
  currentPax,
  customVehicleName,
  setCustomVehicleName,
  customDailyRate,
  setCustomDailyRate,
  customFuelConsumption,
  setCustomFuelConsumption,
  vehicleNotes,
  setVehicleNotes
}: VehicleFuelSectionProps) {
  const isCustomVehicle = selectedVehicle === "custom";
  const vehicleCost = calculateVehicleCost();
  const fuelCost = calculateFuelCost();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle & Fuel</CardTitle>
        <CardDescription>Configure vehicle and fuel parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger id="vehicleType">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isCustomVehicle && (
          <>
            <div className="space-y-2">
              <Label htmlFor="customVehicleName">Custom Vehicle Name</Label>
              <Input
                id="customVehicleName"
                value={customVehicleName}
                onChange={(e) => setCustomVehicleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customDailyRate">Daily Rate ($)</Label>
              <Input
                id="customDailyRate"
                type="number"
                min={0}
                value={customDailyRate}
                onChange={(e) => setCustomDailyRate(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customFuelConsumption">Fuel Consumption (km/L)</Label>
              <Input
                id="customFuelConsumption"
                type="number"
                min={0.1}
                step={0.1}
                value={customFuelConsumption}
                onChange={(e) => setCustomFuelConsumption(Number(e.target.value))}
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="vehicleMarkup">Vehicle Markup (%)</Label>
          <Input
            id="vehicleMarkup"
            type="number"
            min={0}
            max={100}
            value={vehicleMarkup}
            onChange={(e) => setVehicleMarkup(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelPrice">Fuel Price ($/L)</Label>
          <Input
            id="fuelPrice"
            type="number"
            min={0.1}
            step={0.1}
            value={fuelPrice}
            onChange={(e) => setFuelPrice(Number(e.target.value))}
          />
        </div>
        
        <div className="p-3 bg-muted/50 rounded-md">
          <h4 className="font-medium">Cost Summary</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Vehicle cost:</div>
            <div className="font-medium">${vehicleCost.toFixed(2)}</div>
            
            <div>Fuel cost:</div>
            <div className="font-medium">${fuelCost.toFixed(2)}</div>
            
            <div>Cost per passenger:</div>
            <div className="font-medium">${((vehicleCost + fuelCost) / currentPax).toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
