
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash } from "lucide-react";
import { VehicleType } from "@/types/quotes";
import { ItineraryManager } from "../../ItineraryManager/ItineraryManager";
import { vehicleTypes } from "@/hooks/tourCalculator/tourCalculatorData";

export interface ItineraryItem {
  id: string;
  day: number;
  date: Date | string;
  startLocation: string;
  endLocation: string;
  activity: string;
  accommodation: string;
  accommodationType: string;
  distance: number; // Changed to number for calculations
  duration?: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  notes?: string;
}

// Vehicle interface
export interface VehicleDetails {
  selectedVehicle: string;
  customVehicleName: string;
  customDailyRate: number;
  customFuelConsumption: number; // KM per liter
  fuelPrice: number; // Price per liter
  vehicleCollectionFee: number;
  vehicleDeliveryFee: number;
}

interface ItineraryStepProps {
  itinerary: ItineraryItem[];
  setItinerary: (itinerary: ItineraryItem[]) => void;
  vehicleDetails: VehicleDetails;
  setVehicleDetails: (details: VehicleDetails) => void;
  startDate?: Date;
  onValidChange?: (isValid: boolean) => void;
}

export function ItineraryStep({ 
  itinerary, 
  setItinerary,
  vehicleDetails,
  setVehicleDetails,
  startDate, 
  onValidChange
}: ItineraryStepProps) {
  // Local state for new itinerary item
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    day: itinerary.length + 1,
    startLocation: itinerary.length ? itinerary[itinerary.length - 1].endLocation : '',
    endLocation: '',
    activity: '',
    accommodation: '',
    accommodationType: 'hotel',
    distance: 0,
    meals: { breakfast: true, lunch: true, dinner: true }
  });
  
  // Calculate total kilometers
  const totalKilometers = itinerary.reduce((sum, day) => sum + day.distance, 0);
  
  // Calculate estimated fuel consumption
  const calculateFuelConsumption = () => {
    const { customFuelConsumption, fuelPrice } = vehicleDetails;
    if (!customFuelConsumption || !totalKilometers) return 0;
    
    const litersNeeded = totalKilometers / customFuelConsumption;
    return litersNeeded * fuelPrice;
  };

  // Automatically set validity based on whether there's at least one itinerary item
  useEffect(() => {
    if (onValidChange) {
      onValidChange(itinerary.length > 0);
    }
  }, [itinerary, onValidChange]);

  // Handle adding a new itinerary item
  const handleAddItem = () => {
    if (!newItem.startLocation || !newItem.endLocation) return;
    
    const item: ItineraryItem = {
      id: `day-${newItem.day}-${Date.now()}`,
      day: newItem.day || itinerary.length + 1,
      date: startDate ? new Date(startDate.getTime() + ((newItem.day || 1) - 1) * 24 * 60 * 60 * 1000) : new Date(),
      startLocation: newItem.startLocation || '',
      endLocation: newItem.endLocation || '',
      activity: newItem.activity || '',
      accommodation: newItem.accommodation || '',
      accommodationType: newItem.accommodationType || 'hotel',
      distance: newItem.distance || 0,
      meals: newItem.meals || { breakfast: true, lunch: true, dinner: true }
    };
    
    setItinerary([...itinerary, item]);
    
    // Reset form for next item
    setNewItem({
      day: itinerary.length + 2,
      startLocation: newItem.endLocation,
      endLocation: '',
      activity: '',
      accommodation: '',
      accommodationType: 'hotel',
      distance: 0,
      meals: { breakfast: true, lunch: true, dinner: true }
    });
  };

  // Handle removing an itinerary item
  const handleRemoveItem = (index: number) => {
    const updated = [...itinerary];
    updated.splice(index, 1);
    // Re-number days
    updated.forEach((item, i) => {
      item.day = i + 1;
    });
    setItinerary(updated);
  };

  // Handle updating distance for an itinerary item
  const handleDistanceChange = (index: number, distance: number) => {
    const updated = [...itinerary];
    updated[index].distance = distance;
    setItinerary(updated);
  };

  // Handle vehicle selection
  const handleVehicleChange = (vehicleId: string) => {
    // Find selected vehicle from predefined types
    const selectedVehicle = vehicleTypes.find(v => v.id === vehicleId);
    
    if (selectedVehicle) {
      setVehicleDetails({
        ...vehicleDetails,
        selectedVehicle: vehicleId,
        customFuelConsumption: selectedVehicle.fuelConsumption,
        customDailyRate: selectedVehicle.dailyRate
      });
    } else {
      setVehicleDetails({
        ...vehicleDetails,
        selectedVehicle: vehicleId
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="itinerary">Itinerary & Distance</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle & Fuel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="space-y-4">
          {/* Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tour Distance Summary</CardTitle>
              <CardDescription>Track the daily distances for your tour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Total: {totalKilometers} km</div>
              <div className="text-sm text-muted-foreground">
                Estimated Fuel: {calculateFuelConsumption().toFixed(2)} {vehicleDetails.fuelPrice ? `(at $${vehicleDetails.fuelPrice}/L)` : ''}
              </div>
            </CardContent>
          </Card>
          
          {/* Itinerary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              {itinerary.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Distance (km)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.day}</TableCell>
                        <TableCell>{item.startLocation}</TableCell>
                        <TableCell>{item.endLocation}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.distance}
                            onChange={(e) => handleDistanceChange(index, Number(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No itinerary items yet. Add your first day below.
                </div>
              )}

              {/* Add new itinerary item */}
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Add Day to Itinerary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day</Label>
                    <Input
                      id="day"
                      type="number"
                      min="1"
                      value={newItem.day}
                      onChange={(e) => setNewItem({ ...newItem, day: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      min="0"
                      value={newItem.distance}
                      onChange={(e) => setNewItem({ ...newItem, distance: Number(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLocation">From</Label>
                    <Input
                      id="startLocation"
                      value={newItem.startLocation}
                      onChange={(e) => setNewItem({ ...newItem, startLocation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endLocation">To</Label>
                    <Input
                      id="endLocation"
                      value={newItem.endLocation}
                      onChange={(e) => setNewItem({ ...newItem, endLocation: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleAddItem} disabled={!newItem.startLocation || !newItem.endLocation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Selection</CardTitle>
              <CardDescription>Select a vehicle and configure fuel consumption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={vehicleDetails.selectedVehicle}
                  onValueChange={handleVehicleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.fuelConsumption} km/L)
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {vehicleDetails.selectedVehicle === 'custom' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customName">Custom Vehicle Name</Label>
                    <Input
                      id="customName"
                      value={vehicleDetails.customVehicleName}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, customVehicleName: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customRate">Daily Rate</Label>
                      <Input
                        id="customRate"
                        type="number"
                        min="0"
                        value={vehicleDetails.customDailyRate}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, customDailyRate: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customConsumption">Fuel Consumption (km/L)</Label>
                      <Input
                        id="customConsumption"
                        type="number"
                        min="0"
                        step="0.1"
                        value={vehicleDetails.customFuelConsumption}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, customFuelConsumption: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelPrice">Fuel Price per Liter</Label>
                  <Input
                    id="fuelPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={vehicleDetails.fuelPrice}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, fuelPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="collectionFee">Vehicle Collection Fee</Label>
                  <Input
                    id="collectionFee"
                    type="number"
                    min="0"
                    value={vehicleDetails.vehicleCollectionFee}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, vehicleCollectionFee: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Vehicle Delivery Fee</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    min="0"
                    value={vehicleDetails.vehicleDeliveryFee}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, vehicleDeliveryFee: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              {/* Fuel calculation summary */}
              <Card className="bg-muted/30 mt-4">
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-2">Fuel Cost Calculation</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Distance:</span>
                      <span>{totalKilometers} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Consumption:</span>
                      <span>{vehicleDetails.customFuelConsumption} km/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Price:</span>
                      <span>${vehicleDetails.fuelPrice}/L</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2">
                      <span>Estimated Fuel Cost:</span>
                      <span>${calculateFuelConsumption().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
