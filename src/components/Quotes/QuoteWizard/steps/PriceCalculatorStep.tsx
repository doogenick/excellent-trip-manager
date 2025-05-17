
import { PriceCalculator } from "@/components/Quotes/PriceCalculator";

interface PriceCalculatorStepProps {
  onPriceChange: (totalPrice: number, perPersonPrice: number) => void;
}

export function PriceCalculatorStep({ onPriceChange }: PriceCalculatorStepProps) {
  return (
    <div className="space-y-6">
      <PriceCalculator 
        baseVehicleCost={3000}
        baseServicesCost={1000}
        minPassengers={2}
        maxPassengers={16}
        initialPassengers={2}
        initialVehicleMarkup={15}
        initialServicesMarkup={20}
        onPriceChange={onPriceChange}
      />
    </div>
  );
}
