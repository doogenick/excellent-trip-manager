
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const dailyVehicleCost = calculateVehicleCost() / tourDuration;
  const dailyCrewCost = calculateCrewCost() / tourDuration;
  
  const updateParkFee = (day: number, fee: number) => {
    const newParkFees = [...parkFees];
    newParkFees[day] = fee;
    setParkFees(newParkFees);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Cost Breakdown</CardTitle>
        <CardDescription>View and adjust costs on a day-by-day basis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Day</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Vehicle ($)</TableHead>
                <TableHead className="text-right">Crew ($)</TableHead>
                <TableHead className="text-right">Accommodation ($)</TableHead>
                <TableHead className="text-right">Park Fees ($)</TableHead>
                <TableHead className="text-right">Daily Total ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: tourDuration }).map((_, dayIndex) => {
                const day = dayIndex + 1;
                const date = new Date();
                date.setDate(date.getDate() + dayIndex);
                const dateFormatted = date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
                
                const accommodationCost = averageAccommodationCost * (1 + accommodationMarkup / 100);
                const parkFee = parkFees[dayIndex] || 0;
                const dailyTotal = dailyVehicleCost + dailyCrewCost + accommodationCost + parkFee;
                
                return (
                  <TableRow key={dayIndex}>
                    <TableCell className="font-medium">{day}</TableCell>
                    <TableCell>{dateFormatted}</TableCell>
                    <TableCell className="text-right">{dailyVehicleCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{dailyCrewCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{accommodationCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min={0}
                        value={parkFees[dayIndex] || 0} 
                        onChange={(e) => updateParkFee(dayIndex, Number(e.target.value))}
                        className="w-full text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">{dailyTotal.toFixed(2)}</TableCell>
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
