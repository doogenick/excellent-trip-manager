
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface GroupSizeAnalysisProps {
  minPax: number;
  maxPax: number;
  currentPax: number;
  calculateFixedCosts: () => number;
  calculateAccommodationCost: () => number;
  calculateActivityCost: () => number;
  calculateMealCost: () => number;
  tourDuration: number;
}

export function GroupSizeAnalysis({
  minPax,
  maxPax,
  currentPax,
  calculateFixedCosts,
  calculateAccommodationCost,
  calculateActivityCost,
  calculateMealCost,
  tourDuration
}: GroupSizeAnalysisProps) {
  const calculateCostsByGroupSize = () => {
    const costs = [];
    for (let pax = minPax; pax <= maxPax; pax++) {
      const fixedCostsPerPerson = calculateFixedCosts() / pax;
      const variableCosts = (calculateAccommodationCost() / currentPax) + 
                          (calculateActivityCost() / currentPax) + 
                          (calculateMealCost() / currentPax);
      
      costs.push({
        pax,
        totalCost: fixedCostsPerPerson + variableCosts,
        dailyCost: (fixedCostsPerPerson + variableCosts) / tourDuration
      });
    }
    return costs;
  };

  const costsByGroupSize = calculateCostsByGroupSize();
  const maxCost = Math.max(...costsByGroupSize.map(c => c.totalCost));
  const minCost = Math.min(...costsByGroupSize.map(c => c.totalCost));
  const range = maxCost - minCost;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Size Cost Comparison</CardTitle>
        <CardDescription>
          How costs per person change with different group sizes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 w-full flex items-end gap-1">
          {costsByGroupSize.map((costData) => {
            const heightPercent = 100 - ((costData.totalCost - minCost) / range) * 100;
            const isCurrentSize = costData.pax === currentPax;
            
            return (
              <div 
                key={costData.pax}
                className="flex flex-col items-center flex-1"
              >
                <div 
                  className={cn(
                    "w-full rounded-t transition-all duration-200",
                    isCurrentSize ? "bg-primary" : "bg-primary/30"
                  )}
                  style={{ 
                    height: `${Math.max(10, heightPercent)}%`
                  }}
                />
                <div className={cn(
                  "text-[10px] mt-1",
                  isCurrentSize ? "font-bold" : ""
                )}>
                  {costData.pax}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>Group Size</span>
          <span>Higher bars = lower per-person price</span>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Size</TableHead>
              <TableHead>Fixed Cost pp</TableHead>
              <TableHead>Variable Cost pp</TableHead>
              <TableHead>Total pp</TableHead>
              <TableHead>Daily Cost pp</TableHead>
              <TableHead className="text-right">Total Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              minPax,
              Math.round(minPax + (maxPax - minPax) * 0.25),
              Math.round(minPax + (maxPax - minPax) * 0.5),
              Math.round(minPax + (maxPax - minPax) * 0.75),
              maxPax
            ].map((pax) => {
              const fixedCostsPerPerson = calculateFixedCosts() / pax;
              const variableCosts = (calculateAccommodationCost() / currentPax) + 
                                    (calculateActivityCost() / currentPax) + 
                                    (calculateMealCost() / currentPax);
              
              const totalPerPerson = fixedCostsPerPerson + variableCosts;
              const dailyCostPerPerson = totalPerPerson / tourDuration;
              const totalRevenue = totalPerPerson * pax;
              
              const isCurrentSize = pax === currentPax;
              
              return (
                <TableRow key={pax} className={isCurrentSize ? "bg-muted" : ""}>
                  <TableCell className="font-medium">{pax} passengers</TableCell>
                  <TableCell>${Math.round(fixedCostsPerPerson).toLocaleString()}</TableCell>
                  <TableCell>${Math.round(variableCosts).toLocaleString()}</TableCell>
                  <TableCell>${Math.round(totalPerPerson).toLocaleString()}</TableCell>
                  <TableCell>${Math.round(dailyCostPerPerson).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    ${Math.round(totalRevenue).toLocaleString()}
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
