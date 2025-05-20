
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GroupSizeAnalysisProps {
  minPax: number;
  maxPax: number;
  currentPax: number;
  calculateFixedCosts: () => number;
  calculateAccommodationCost: () => number;
  calculateActivityCost: () => number;
  calculateMealCost: () => number;
  tourDuration: number;
  calculateParkFeesCost: () => number;
}

export function GroupSizeAnalysis({
  minPax,
  maxPax,
  currentPax,
  calculateFixedCosts,
  calculateAccommodationCost,
  calculateActivityCost,
  calculateMealCost,
  tourDuration,
  calculateParkFeesCost
}: GroupSizeAnalysisProps) {
  const fixedCosts = calculateFixedCosts();
  const accommodationCostPerPerson = calculateAccommodationCost() / currentPax;
  const activityCostPerPerson = calculateActivityCost() / currentPax;
  const mealCostPerPerson = calculateMealCost() / currentPax;
  const parkFeesCostPerPerson = calculateParkFeesCost() / currentPax;
  
  const groupSizes = Array.from({ length: maxPax - minPax + 1 }, (_, i) => minPax + i);
  
  const getCostAnalysis = (pax: number) => {
    const fixedCostsPerPerson = fixedCosts / pax;
    const variableCostsPerPerson = accommodationCostPerPerson + activityCostPerPerson + 
                                   mealCostPerPerson + parkFeesCostPerPerson;
    const totalCostPerPerson = fixedCostsPerPerson + variableCostsPerPerson;
    
    return {
      pax,
      fixedCostsPerPerson,
      variableCostsPerPerson,
      totalCostPerPerson,
      dailyCostPerPerson: totalCostPerPerson / tourDuration
    };
  };
  
  const analysis = groupSizes.map(getCostAnalysis);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Size Analysis</CardTitle>
        <CardDescription>
          Compare costs across different group sizes to optimize pricing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Size</TableHead>
                <TableHead className="text-right">Fixed Costs Per Person ($)</TableHead>
                <TableHead className="text-right">Variable Costs Per Person ($)</TableHead>
                <TableHead className="text-right">Total Per Person ($)</TableHead>
                <TableHead className="text-right">Daily Cost Per Person ($)</TableHead>
                <TableHead className="text-right">Optimal Selling Price ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.map(item => {
                const isCurrentPax = item.pax === currentPax;
                // Add 25% markup for optimal selling price
                const optimalSellingPrice = Math.ceil(item.totalCostPerPerson * 1.25);
                
                return (
                  <TableRow 
                    key={item.pax} 
                    className={isCurrentPax ? "bg-primary/10" : undefined}
                  >
                    <TableCell className="font-medium">{item.pax}{isCurrentPax && " (Current)"}</TableCell>
                    <TableCell className="text-right">{item.fixedCostsPerPerson.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.variableCostsPerPerson.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.totalCostPerPerson.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.dailyCostPerPerson.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">{optimalSellingPrice}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
