import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleDetails, VehicleType } from "@/types/quotes";
import { Plus } from "lucide-react";

// Default fuel consumption values per vehicle type (km/L)
const defaultFuelConsumption = {
  [VehicleType.MINIVAN]: 10.5,
  [VehicleType["4X4"]]: 8.2,
  [VehicleType.LUXURY_VEHICLE]: 9.5,
  [VehicleType.MINIBUS]: 7.0,
  [VehicleType.COACH]: 4.5,
  [VehicleType.TRUCK]: 5.0,
  [VehicleType.SPRINTER]: 8.5,
  [VehicleType.CUSTOM]: 8.0,
};

// Default daily rates per vehicle type
const defaultDailyRates = {
  [VehicleType.MINIVAN]: 85,
  [VehicleType["4X4"]]: 120,
  [VehicleType.LUXURY_VEHICLE]: 180,
  [VehicleType.MINIBUS]: 220,
  [VehicleType.COACH]: 450,
  [VehicleType.TRUCK]: 300,
  [VehicleType.SPRINTER]: 190,
  [VehicleType.CUSTOM]: 150,
};

// Default max passengers per vehicle type
const defaultMaxPassengers = {
  [VehicleType.MINIVAN]: 7,
  [VehicleType["4X4"]]: 4,
  [VehicleType.LUXURY_VEHICLE]: 3,
  [VehicleType.MINIBUS]: 22,
  [VehicleType.COACH]: 45,
  [VehicleType.TRUCK]: 16,
  [VehicleType.SPRINTER]: 14,
  [VehicleType.CUSTOM]: 10,
};

interface VehicleFormProps {
  vehicles: VehicleDetails[];
  setVehicles: (vehicles: VehicleDetails[]) => void;
  vehicleToEdit?: VehicleDetails | null;
  setVehicleToEdit?: (vehicle: VehicleDetails | null) => void;
  onValidChange: (valid: boolean) => void;
}

export function VehicleForm({
  vehicles,
  setVehicles,
  vehicleToEdit = null,
  setVehicleToEdit,
  onValidChange
}: VehicleFormProps) {
  const [vehicle, setVehicle] = useState<Partial<VehicleDetails>>(vehicleToEdit || {
    id: "",
    name: "",
    type: VehicleType.MINIBUS,
    dailyRate: defaultDailyRates[VehicleType.MINIBUS],
    fuelConsumption: defaultFuelConsumption[VehicleType.MINIBUS],
    maxPassengers: defaultMaxPassengers[VehicleType.MINIBUS],
    collectionFee: 0,
    deliveryFee: 0
  });

  // Generate a unique ID for new vehicles
  const generateId = () => {
    return `vehicle-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Handle vehicle type change
  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicle({
      ...vehicle,
      type,
      dailyRate: defaultDailyRates[type],
      fuelConsumption: defaultFuelConsumption[type],
      maxPassengers: defaultMaxPassengers[type]
    });
  };

  // Handle adding or updating a vehicle
  const handleSaveVehicle = () => {
    if (vehicleToEdit && setVehicleToEdit) {
      // Update existing vehicle
      setVehicles(vehicles.map(v => (v.id === vehicleToEdit.id ? { ...vehicle, id: vehicleToEdit.id } as VehicleDetails : v)));
      setVehicleToEdit(null);
    } else {
      // Add new vehicle
      const newVehicle: VehicleDetails = {
        ...vehicle,
        id: generateId()
      } as VehicleDetails;
      
      setVehicles([...vehicles, newVehicle]);
    }

    // Reset form
    setVehicle({
      id: "",
      name: "",
      type: VehicleType.MINIBUS,
      dailyRate: defaultDailyRates[VehicleType.MINIBUS],
      fuelConsumption: defaultFuelConsumption[VehicleType.MINIBUS],
      maxPassengers: defaultMaxPassengers[VehicleType.MINIBUS],
      collectionFee: 0,
      deliveryFee: 0
    });
    
    // Validate the form
    onValidChange(true);
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <h3 className="text-md font-medium mb-2">
          {vehicleToEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleName">Vehicle Name</Label>
            <Input
              id="vehicleName"
              value={vehicle.name}
              onChange={(e) => setVehicle({ ...vehicle, name: e.target.value })}
              placeholder="Enter a descriptive name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={vehicle.type}
              onValueChange={(value) => handleVehicleTypeChange(value as VehicleType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VehicleType.MINIVAN}>Minivan (up to 7 pax)</SelectItem>
                <SelectItem value={VehicleType["4X4"]}>4x4 Vehicle</SelectItem>
                <SelectItem value={VehicleType.LUXURY_VEHICLE}>Luxury Vehicle</SelectItem>
                <SelectItem value={VehicleType.MINIBUS}>Minibus (up to 22 pax)</SelectItem>
                <SelectItem value={VehicleType.COACH}>Coach (23+ pax)</SelectItem>
                <SelectItem value={VehicleType.TRUCK}>Safari Truck</SelectItem>
                <SelectItem value={VehicleType.SPRINTER}>Sprinter</SelectItem>
                <SelectItem value={VehicleType.CUSTOM}>Custom Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dailyRate">Daily Rate</Label>
            <Input
              id="dailyRate"
              type="number"
              min="0"
              step="0.01"
              value={vehicle.dailyRate}
              onChange={(e) => setVehicle({ ...vehicle, dailyRate: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelConsumption">Fuel Consumption (km/L)</Label>
            <Input
              id="fuelConsumption"
              type="number"
              min="0.1"
              step="0.1"
              value={vehicle.fuelConsumption}
              onChange={(e) => setVehicle({ ...vehicle, fuelConsumption: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPassengers">Maximum Passengers</Label>
            <Input
              id="maxPassengers"
              type="number"
              min="1"
              value={vehicle.maxPassengers}
              onChange={(e) => setVehicle({ ...vehicle, maxPassengers: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="collectionFee">Collection Fee</Label>
            <Input
              id="collectionFee"
              type="number"
              min="0"
              step="0.01"
              value={vehicle.collectionFee}
              onChange={(e) => setVehicle({ ...vehicle, collectionFee: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryFee">Delivery Fee</Label>
            <Input
              id="deliveryFee"
              type="number"
              min="0"
              step="0.01"
              value={vehicle.deliveryFee}
              onChange={(e) => setVehicle({ ...vehicle, deliveryFee: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-end">
          {vehicleToEdit && setVehicleToEdit && (
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setVehicleToEdit(null)}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSaveVehicle}
            disabled={!vehicle.name || !vehicle.dailyRate || !vehicle.fuelConsumption}
          >
            <Plus className="h-4 w-4 mr-2" />
            {vehicleToEdit ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
