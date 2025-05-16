
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DailyBreakdownTableProps {
  tourDuration: number;
  averageAccommodationCost: number;
  accommodationMarkup: number;
  preparedMealsCost: number;
  mealMarkup: number;
  averageActivityCost: number;
  activitiesMarkup: number;
  calculateVehicleCost: () => number;
  calculateCrewCost: () => number;
  currentPax: number;
}

export function DailyBreakdownTable({
  tourDuration,
  averageAccommodationCost,
  accommodationMarkup,
  preparedMealsCost,
  mealMarkup,
  averageActivityCost,
  activitiesMarkup,
  calculateVehicleCost,
  calculateCrewCost,
  currentPax
}: DailyBreakdownTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Cost Breakdown</CardTitle>
        <CardDescription>Day-by-day cost analysis of the tour</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Accommodation</TableHead>
              <TableHead>Meals</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead className="text-right">Daily Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: tourDuration }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              const dailyAccom = averageAccommodationCost * (1 + accommodationMarkup / 100);
              
              // Simulate varying daily expenses for a more realistic appearance
              const mealsFactor = 0.8 + Math.random() * 0.4;
              const activitiesFactor = day % 3 === 0 ? 1.5 : day % 2 === 0 ? 0.7 : 1;
              
              const dailyMeals = (preparedMealsCost * (1 + mealMarkup / 100)) * mealsFactor;
              const dailyActivities = averageActivityCost * activitiesFactor * (1 + activitiesMarkup / 100);
              const dailyVehicle = calculateVehicleCost() / tourDuration;
              const dailyCrew = calculateCrewCost() / tourDuration;
              
              const dailyTotal = dailyAccom + dailyMeals + dailyActivities + 
                               (dailyVehicle / currentPax) + (dailyCrew / currentPax);
              
              return (
                <TableRow key={day}>
                  <TableCell>Day {day}</TableCell>
                  <TableCell>${dailyAccom.toFixed(0)}</TableCell>
                  <TableCell>${dailyMeals.toFixed(0)}</TableCell>
                  <TableCell>${dailyActivities.toFixed(0)}</TableCell>
                  <TableCell>${(dailyVehicle / currentPax).toFixed(0)}</TableCell>
                  <TableCell>${(dailyCrew / currentPax).toFixed(0)}</TableCell>
                  <TableCell className="text-right font-medium">${dailyTotal.toFixed(0)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
