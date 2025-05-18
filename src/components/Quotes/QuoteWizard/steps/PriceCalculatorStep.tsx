
// DEBUG: changed from alias to relative import
import { PriceCalculator } from "../../PriceCalculator";

interface PriceCalculatorStepProps {
  onPriceChange: (totalPrice: number, perPersonPrice: number) => void;
  adults: string;
  children: string;
  quoteType?: string;
  selectedDestinations: string[];
  startDate?: Date;
  endDate?: Date;
}

export function PriceCalculatorStep({ 
  onPriceChange, 
  adults, 
  children, 
  quoteType, 
  selectedDestinations,
  startDate,
  endDate 
}: PriceCalculatorStepProps) {
  const totalPassengers = parseInt(adults) + parseInt(children);
  const isLuxury = quoteType === 'luxury';
  const isAdventure = quoteType === 'adventure';
  
  // Calculate base costs based on quote type and destinations
  const calculateBaseVehicleCost = () => {
    let base = 2000;
    if (isLuxury) base *= 1.5;
    if (isAdventure) base *= 1.2;
    return base + (selectedDestinations.length * 200);
  };

  const calculateBaseServicesCost = () => {
    let base = 1000;
    if (isLuxury) base *= 2;
    if (isAdventure) base *= 1.3;
    return base + (selectedDestinations.length * 100);
  };

  // Calculate tour duration in days
  const tourDuration = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1
    : 7; // Default to 7 days if dates not set

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Quote Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Passengers</p>
            <p>{adults} Adults, {children} Children</p>
          </div>
          {quoteType && (
            <div>
              <p className="text-muted-foreground">Tour Type</p>
              <p>{quoteType ? quoteType.charAt(0).toUpperCase() + quoteType.slice(1) : ''}</p>
            </div>
          )}
          {selectedDestinations.length > 0 && (
            <div>
              <p className="text-muted-foreground">Destinations</p>
              <p>{selectedDestinations.join(', ')}</p>
            </div>
          )}
          {tourDuration > 0 && (
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p>{tourDuration} days</p>
            </div>
          )}
        </div>
      </div>
      
      <PriceCalculator 
        baseVehicleCost={calculateBaseVehicleCost()}
        baseServicesCost={calculateBaseServicesCost()}
        minPassengers={2}
        maxPassengers={16}
        initialPassengers={Math.max(2, totalPassengers)}
        initialVehicleMarkup={isLuxury ? 25 : isAdventure ? 18 : 15}
        initialServicesMarkup={isLuxury ? 30 : isAdventure ? 22 : 20}
        onPriceChange={onPriceChange}
        tourDuration={tourDuration}
      />
    </div>
  );
}
