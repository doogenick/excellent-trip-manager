
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CostSummarySectionProps {
  calculateVehicleCost: () => number;
  calculateFuelCost: () => number;
  calculateCrewCost: () => number;
  calculateAccommodationCost: () => number;
  calculateActivityCost: () => number;
  calculateMealCost: () => number;
  calculateParkFeesCost: () => number;
  calculateTotalTourCost: () => number;
  calculateFixedCosts: () => number;
  calculatePerPersonCosts: () => number;
  calculateCostPerPerson: () => number;
  calculateDailyCostPerPerson: () => number;
  calculateProfit: () => number;
  currentPax: number;
  tourDuration: number;
}

export function CostSummarySection({
  calculateVehicleCost,
  calculateFuelCost,
  calculateCrewCost,
  calculateAccommodationCost,
  calculateActivityCost,
  calculateMealCost,
  calculateParkFeesCost,
  calculateTotalTourCost,
  calculateFixedCosts,
  calculatePerPersonCosts,
  calculateCostPerPerson,
  calculateDailyCostPerPerson,
  calculateProfit,
  currentPax,
  tourDuration
}: CostSummarySectionProps) {
  const profit = calculateProfit();
  const profitPerDay = profit / tourDuration;
  const profitPerPerson = profit / currentPax;

  return (
    <Card className="bg-primary/5">
      <CardHeader>
        <CardTitle>Cost & Profit Summary</CardTitle>
        <CardDescription>
          Breakdown of total costs, per-person costs, and expected profits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Total Costs</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Vehicle Cost:</span>
                <span className="font-medium">${calculateVehicleCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fuel Cost:</span>
                <span className="font-medium">${calculateFuelCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Crew Cost:</span>
                <span className="font-medium">${calculateCrewCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Accommodation Cost:</span>
                <span className="font-medium">${calculateAccommodationCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Activities Cost:</span>
                <span className="font-medium">${calculateActivityCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Meals Cost:</span>
                <span className="font-medium">${calculateMealCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Park Fees Cost:</span>
                <span className="font-medium">${calculateParkFeesCost().toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="font-medium">Total Tour Cost:</span>
                <span className="font-bold">${calculateTotalTourCost().toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Per Person Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Fixed Costs Per Person:</span>
                <span className="font-medium">${(calculateFixedCosts() / currentPax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Variable Costs Per Person:</span>
                <span className="font-medium">${calculatePerPersonCosts().toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="font-medium">Total Per Person:</span>
                <span className="font-bold">${calculateCostPerPerson().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Daily Cost Per Person:</span>
                <span className="font-medium">${calculateDailyCostPerPerson().toLocaleString()}</span>
              </div>
            </div>
            
            <div className="p-3 bg-primary/10 rounded-md">
              <p className="text-sm font-medium mb-1">Recommended Selling Price (per person)</p>
              <p className="text-2xl font-bold">${Math.ceil(calculateCostPerPerson() / 10) * 10}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Profit Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Profit:</span>
                <span className="font-medium">${profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Profit Per Day:</span>
                <span className="font-medium">${profitPerDay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Profit Per Person:</span>
                <span className="font-medium">${profitPerPerson.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="text-sm">Profit Margin:</span>
                <span className="font-medium">
                  {((profit / calculateTotalTourCost()) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-primary/10 rounded-md">
              <p className="text-sm font-medium mb-1">Breakeven Point</p>
              <p className="text-xl font-bold">
                {Math.ceil(calculateFixedCosts() / calculatePerPersonCosts())} passengers
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
