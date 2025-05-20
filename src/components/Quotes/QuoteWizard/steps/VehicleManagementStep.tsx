import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleDetails, TrailerDetails } from "@/types/quotes";
import { VehicleForm } from "./VehicleManagement/VehicleForm";
import { TrailerForm } from "./VehicleManagement/TrailerForm";
import { VehicleList } from "./VehicleManagement/VehicleList";
import { TransitDetails } from "./VehicleManagement/TransitDetails";

interface VehicleManagementStepProps {
  vehicles: VehicleDetails[];
  setVehicles: (vehicles: VehicleDetails[]) => void;
  trailers: TrailerDetails[];
  setTrailers: (trailers: TrailerDetails[]) => void;
  startTransitKm: number;
  setStartTransitKm: (km: number) => void;
  endTransitKm: number;
  setEndTransitKm: (km: number) => void;
  fuelPricePerLiter: number;
  setFuelPricePerLiter: (price: number) => void;
  totalDistance: number; // From itinerary
  onValidChange: (valid: boolean) => void;
}

export function VehicleManagementStep({
  vehicles,
  setVehicles,
  trailers,
  setTrailers,
  startTransitKm,
  setStartTransitKm,
  endTransitKm,
  setEndTransitKm,
  fuelPricePerLiter,
  setFuelPricePerLiter,
  totalDistance,
  onValidChange
}: VehicleManagementStepProps) {
  const [activeTab, setActiveTab] = useState("vehicles");

  // Calculate total distance including transit
  const totalDistanceWithTransit = totalDistance + startTransitKm + endTransitKm;

  // Calculate total fuel cost
  const calculateTotalFuelCost = () => {
    return vehicles.reduce((total, vehicle) => {
      if (!vehicle.fuelConsumption) return total;
      const litersPer100km = 100 / vehicle.fuelConsumption;
      const litersNeeded = (totalDistanceWithTransit / 100) * litersPer100km;
      return total + (litersNeeded * fuelPricePerLiter);
    }, 0);
  };

  // Calculate total vehicle costs
  const calculateTotalVehicleCosts = () => {
    // Vehicle daily rates
    const vehicleDailyRates = vehicles.reduce((total, vehicle) => {
      return total + vehicle.dailyRate;
    }, 0);

    // Vehicle fees
    const vehicleFees = vehicles.reduce((total, vehicle) => {
      return total + (vehicle.collectionFee || 0) + (vehicle.deliveryFee || 0);
    }, 0);

    // Trailer costs
    const trailerCosts = trailers.reduce((total, trailer) => {
      return total + trailer.dailyRate + (trailer.collectionFee || 0) + (trailer.deliveryFee || 0);
    }, 0);

    return vehicleDailyRates + vehicleFees + trailerCosts;
  };

  // Validate that we have at least one vehicle
  const validateForm = () => {
    const isValid = vehicles.length > 0;
    onValidChange(isValid);
    return isValid;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Management</CardTitle>
        <CardDescription>Configure vehicles, trailers, and fuel consumption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="trailers">Trailers</TabsTrigger>
            <TabsTrigger value="transit">Fuel & Transit</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-4">
            <VehicleList 
              vehicles={vehicles} 
              setVehicles={setVehicles} 
              onValidChange={validateForm}
            />
            <VehicleForm 
              vehicles={vehicles} 
              setVehicles={setVehicles} 
              onValidChange={validateForm}
            />
          </TabsContent>

          <TabsContent value="trailers" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Trailer Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add trailers that will be used during the tour
              </p>
              <TrailerForm 
                trailers={trailers} 
                setTrailers={setTrailers}
              />
            </Card>
          </TabsContent>

          <TabsContent value="transit" className="space-y-4">
            <TransitDetails
              startTransitKm={startTransitKm}
              setStartTransitKm={setStartTransitKm}
              endTransitKm={endTransitKm}
              setEndTransitKm={setEndTransitKm}
              fuelPricePerLiter={fuelPricePerLiter}
              setFuelPricePerLiter={setFuelPricePerLiter}
              totalDistance={totalDistance}
              vehicles={vehicles}
            />
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <h3 className="text-md font-medium mb-2">Vehicle & Fuel Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Total Distance (incl. transit):</span>
                <span>{totalDistanceWithTransit} km</span>
              </div>
              <div className="flex justify-between">
                <span>Total Vehicle Costs:</span>
                <span className="font-medium">${calculateTotalVehicleCosts().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Fuel Cost:</span>
                <span className="font-medium">${calculateTotalFuelCost().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Total Vehicle & Fuel Costs:</span>
                <span className="font-bold">
                  ${(calculateTotalVehicleCosts() + calculateTotalFuelCost()).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
