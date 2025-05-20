import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { VehicleDetails } from "@/types/quotes";
import { VehicleForm } from "./VehicleForm";

interface VehicleListProps {
  vehicles: VehicleDetails[];
  setVehicles: (vehicles: VehicleDetails[]) => void;
  onValidChange: (valid: boolean) => void;
}

export function VehicleList({ vehicles, setVehicles, onValidChange }: VehicleListProps) {
  const [vehicleToEdit, setVehicleToEdit] = useState<VehicleDetails | null>(null);

  // Handle deleting a vehicle
  const handleDeleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
    setVehicles(updatedVehicles);
    onValidChange(updatedVehicles.length > 0);
  };

  // Handle edit button click
  const handleEditVehicle = (vehicle: VehicleDetails) => {
    setVehicleToEdit(vehicle);
  };

  // Calculate total costs for a vehicle
  const calculateVehicleTotalCost = (vehicle: VehicleDetails) => {
    return vehicle.dailyRate + (vehicle.collectionFee || 0) + (vehicle.deliveryFee || 0);
  };

  if (vehicles.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-8 text-muted-foreground">
          No vehicles added yet. Add your first vehicle below.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {vehicleToEdit ? (
        <VehicleForm
          vehicles={vehicles}
          setVehicles={setVehicles}
          vehicleToEdit={vehicleToEdit}
          setVehicleToEdit={setVehicleToEdit}
          onValidChange={onValidChange}
        />
      ) : (
        <Card>
          <CardContent className="pt-4 overflow-x-auto">
            <Table>
              <TableCaption>List of vehicles for this tour</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Fuel (km/L)</TableHead>
                  <TableHead>Max Passengers</TableHead>
                  <TableHead>Collection Fee</TableHead>
                  <TableHead>Delivery Fee</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>${vehicle.dailyRate.toFixed(2)}</TableCell>
                    <TableCell>{vehicle.fuelConsumption.toFixed(1)}</TableCell>
                    <TableCell>{vehicle.maxPassengers}</TableCell>
                    <TableCell>${(vehicle.collectionFee || 0).toFixed(2)}</TableCell>
                    <TableCell>${(vehicle.deliveryFee || 0).toFixed(2)}</TableCell>
                    <TableCell className="font-medium">
                      ${calculateVehicleTotalCost(vehicle).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary Row */}
                <TableRow>
                  <TableCell colSpan={7} className="font-medium">Total</TableCell>
                  <TableCell colSpan={2} className="font-bold">
                    ${vehicles.reduce((total, vehicle) => total + calculateVehicleTotalCost(vehicle), 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
