
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChartLine } from "lucide-react";

interface PriceCalculatorProps {
  baseVehicleCost: number;
  baseServicesCost: number;
  minPassengers: number;
  maxPassengers: number;
  initialPassengers: number;
  initialVehicleMarkup: number;
  initialServicesMarkup: number;
  onPriceChange?: (totalPrice: number, perPersonPrice: number) => void;
}

export function PriceCalculator({
  baseVehicleCost = 2000,
  baseServicesCost = 3000,
  minPassengers = 2,
  maxPassengers = 16,
  initialPassengers = 4,
  initialVehicleMarkup = 15,
  initialServicesMarkup = 20,
  onPriceChange
}: PriceCalculatorProps) {
  const [vehicleMarkup, setVehicleMarkup] = useState(initialVehicleMarkup);
  const [servicesMarkup, setServicesMarkup] = useState(initialServicesMarkup);
  const [passengers, setPassengers] = useState(initialPassengers);

  const calculateVehicleCost = () => {
    return baseVehicleCost * (1 + vehicleMarkup / 100);
  };

  const calculateServicesCost = () => {
    return baseServicesCost * (1 + servicesMarkup / 100);
  };

  const calculateTotalCost = () => {
    return calculateVehicleCost() + calculateServicesCost() * passengers;
  };

  const calculatePerPersonCost = () => {
    const totalCost = calculateTotalCost();
    return totalCost / passengers;
  };

  // Generate data points for price calculation across different group sizes
  const generatePricePoints = () => {
    const points = [];
    for (let i = minPassengers; i <= maxPassengers; i++) {
      const vehicleCost = calculateVehicleCost();
      const servicesCost = calculateServicesCost() * i;
      const totalCost = vehicleCost + servicesCost;
      const perPersonCost = totalCost / i;
      
      points.push({
        passengers: i,
        perPersonCost: Math.round(perPersonCost)
      });
    }
    return points;
  };

  const pricePoints = generatePricePoints();
  const maxPrice = Math.max(...pricePoints.map(p => p.perPersonCost));
  const minPrice = Math.min(...pricePoints.map(p => p.perPersonCost));
  const range = maxPrice - minPrice;

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(calculateTotalCost(), calculatePerPersonCost());
    }
  }, [vehicleMarkup, servicesMarkup, passengers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-5 w-5" />
          Price Calculator
        </CardTitle>
        <CardDescription>
          Adjust markup percentages and group size to see price implications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
                onValueChange={(value) => setVehicleMarkup(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="services-markup">Services Markup: {servicesMarkup}%</Label>
                <span className="text-sm font-medium">
                  ${calculateServicesCost().toLocaleString()} per person
                </span>
              </div>
              <Slider
                id="services-markup"
                min={0}
                max={50}
                step={1}
                value={[servicesMarkup]}
                onValueChange={(value) => setServicesMarkup(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <span className="text-sm font-medium">{passengers}</span>
              </div>
              <Slider
                id="passengers"
                min={minPassengers}
                max={maxPassengers}
                step={1}
                value={[passengers]}
                onValueChange={(value) => setPassengers(value[0])}
              />
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Price Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Vehicle Total:</span>
                <span className="font-medium">${calculateVehicleCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Services Total:</span>
                <span className="font-medium">${(calculateServicesCost() * passengers).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-medium">Total Cost:</span>
                <span className="font-bold">${calculateTotalCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-medium">Per Person:</span>
                <span className="font-bold text-primary">${calculatePerPersonCost().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-3">Per Person Price by Group Size</h4>
          <div className="h-24 w-full flex items-end gap-1">
            {pricePoints.map((point) => {
              const heightPercent = 100 - ((point.perPersonCost - minPrice) / range) * 100;
              const isCurrentSize = point.passengers === passengers;
              
              return (
                <div 
                  key={point.passengers}
                  className="flex flex-col items-center flex-1"
                >
                  <div 
                    className={cn(
                      "w-full rounded-t transition-all duration-200",
                      isCurrentSize ? "bg-primary" : "bg-primary/30"
                    )}
                    style={{ 
                      height: `${heightPercent}%`,
                      minHeight: '10%'
                    }}
                  />
                  <div className={cn(
                    "text-[10px] mt-1",
                    isCurrentSize ? "font-bold" : ""
                  )}>
                    {point.passengers}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex justify-between">
            <span>Passengers</span>
            <span>Lower bars = higher per-person price</span>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Size</TableHead>
              <TableHead className="text-right">Per Person</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              minPassengers,
              Math.round(minPassengers + (maxPassengers - minPassengers) * 0.25),
              Math.round(minPassengers + (maxPassengers - minPassengers) * 0.5),
              Math.round(minPassengers + (maxPassengers - minPassengers) * 0.75),
              maxPassengers
            ].map((size) => {
              const vehicleCost = calculateVehicleCost();
              const servicesCost = calculateServicesCost() * size;
              const totalCost = vehicleCost + servicesCost;
              const perPersonCost = totalCost / size;
              
              const isCurrentSize = size === passengers;
              
              return (
                <TableRow key={size} className={isCurrentSize ? "bg-muted" : ""}>
                  <TableCell className="font-medium">{size} passengers</TableCell>
                  <TableCell className="text-right">
                    ${Math.round(perPersonCost).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Math.round(totalCost).toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
