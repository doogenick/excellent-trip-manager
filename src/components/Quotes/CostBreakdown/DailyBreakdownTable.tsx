
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";

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
  selectedRoomType: string;
  selectedMealBasis: string;
  parkFees: number[];
  setParkFees: (fees: number[]) => void;
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
  currentPax,
  selectedRoomType,
  selectedMealBasis,
  parkFees,
  setParkFees
}: DailyBreakdownTableProps) {
  const [isEditingParkFees, setIsEditingParkFees] = useState(false);
  
  const updateParkFee = (day: number, value: number) => {
    const newFees = [...parkFees];
    newFees[day - 1] = value;
    setParkFees(newFees);
  };

  // Room type multipliers (simplified from AccommodationSection)
  const roomMultipliers = {
    "single": 1.5,
    "double": 1.0,
    "triple": 0.85,
    "family": 0.75,
    "dorm": 0.5,
    "camping": 0.3
  };

  // Meal basis cost adders (simplified from AccommodationSection)
  const mealMultipliers = {
    "ro": 0.0,
    "bb": 0.15,
    "hb": 0.35,
    "fb": 0.5,
    "ai": 0.75
  };

  const roomMultiplier = roomMultipliers[selectedRoomType as keyof typeof roomMultipliers] || 1.0;
  const mealMultiplier = mealMultipliers[selectedMealBasis as keyof typeof mealMultipliers] || 0.0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daily Cost Breakdown</CardTitle>
          <CardDescription>Day-by-day cost analysis of the tour</CardDescription>
        </div>
        <div>
          <button 
            className="text-sm text-primary underline"
            onClick={() => setIsEditingParkFees(!isEditingParkFees)}
          >
            {isEditingParkFees ? "Save Park Fees" : "Edit Park Fees"}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Accommodation</TableHead>
              <TableHead>Meals</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>Park Fees</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead className="text-right">Daily Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: tourDuration }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              
              // Calculate adjusted accommodation cost based on room type and meal basis
              const baseAccomCost = averageAccommodationCost * roomMultiplier;
              const mealAddition = baseAccomCost * mealMultiplier;
              const dailyAccom = (baseAccomCost + mealAddition) * (1 + accommodationMarkup / 100);
              
              // Simulate varying daily expenses for a more realistic appearance
              const mealsFactor = 0.8 + Math.random() * 0.4;
              const activitiesFactor = day % 3 === 0 ? 1.5 : day % 2 === 0 ? 0.7 : 1;
              
              const dailyMeals = (preparedMealsCost * (1 + mealMarkup / 100)) * mealsFactor;
              const dailyActivities = averageActivityCost * activitiesFactor * (1 + activitiesMarkup / 100);
              const dailyParkFees = parkFees[dayIndex] || 0;
              const dailyVehicle = calculateVehicleCost() / tourDuration;
              const dailyCrew = calculateCrewCost() / tourDuration;
              
              const dailyTotal = dailyAccom + dailyMeals + dailyActivities + dailyParkFees + 
                               (dailyVehicle / currentPax) + (dailyCrew / currentPax);
              
              return (
                <TableRow key={day}>
                  <TableCell>Day {day}</TableCell>
                  <TableCell>${dailyAccom.toFixed(0)}</TableCell>
                  <TableCell>${dailyMeals.toFixed(0)}</TableCell>
                  <TableCell>${dailyActivities.toFixed(0)}</TableCell>
                  <TableCell>
                    {isEditingParkFees ? (
                      <Input
                        type="number"
                        min={0}
                        className="w-20 h-7 p-1"
                        value={parkFees[dayIndex] || 0}
                        onChange={e => updateParkFee(day, Number(e.target.value) || 0)}
                      />
                    ) : (
                      `$${dailyParkFees.toFixed(0)}`
                    )}
                  </TableCell>
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
