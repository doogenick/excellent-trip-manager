
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { crewRoles } from "@/hooks/tourCalculator/tourCalculatorData";
import type { CrewMember, CrewMealRates } from "@/hooks/tourCalculator/types";
import { Plus, Trash } from "lucide-react";

interface CrewSectionProps {
  crew: CrewMember[];
  setCrew: (crew: CrewMember[]) => void;
  calculateCrewCost: () => number;
  crewMealRates: CrewMealRates;
  setCrewMealRates: (rates: CrewMealRates) => void;
}

export function CrewSection({
  crew,
  setCrew,
  calculateCrewCost,
  crewMealRates,
  setCrewMealRates
}: CrewSectionProps) {
  const addCrewMember = () => {
    setCrew([
      ...crew,
      {
        role: "driver",
        dailyRate: 120,
        accommodationRate: 60,
        mealAllowance: 30
      }
    ]);
  };

  const updateCrewMember = (index: number, field: keyof CrewMember, value: string | number) => {
    const updatedCrew = [...crew];
    updatedCrew[index] = {
      ...updatedCrew[index],
      [field]: typeof value === "string" && field !== "role" ? Number(value) : value
    };
    setCrew(updatedCrew);
  };

  const removeCrewMember = (index: number) => {
    setCrew(crew.filter((_, i) => i !== index));
  };

  const updateMealRate = (field: keyof CrewMealRates, value: number) => {
    setCrewMealRates({
      ...crewMealRates,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crew</CardTitle>
        <CardDescription>Configure tour crew and their costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {crew.map((member, index) => (
          <div key={index} className="p-3 border rounded-md space-y-3">
            <div className="flex justify-between">
              <h4 className="font-medium">Crew Member {index + 1}</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeCrewMember(index)}
                disabled={crew.length <= 1}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={member.role} 
                onValueChange={(value) => updateCrewMember(index, "role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {crewRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Daily Rate ($)</Label>
                <Input 
                  type="number" 
                  min={0}
                  value={member.dailyRate} 
                  onChange={(e) => updateCrewMember(index, "dailyRate", e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Accommodation ($)</Label>
                <Input 
                  type="number" 
                  min={0}
                  value={member.accommodationRate} 
                  onChange={(e) => updateCrewMember(index, "accommodationRate", e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Meal Allowance ($)</Label>
                <Input 
                  type="number" 
                  min={0}
                  value={member.mealAllowance} 
                  onChange={(e) => updateCrewMember(index, "mealAllowance", e.target.value)} 
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" onClick={addCrewMember} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Crew Member
        </Button>
        
        <div className="p-3 bg-muted/50 rounded-md">
          <h4 className="font-medium">Cost Summary</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Total crew cost:</div>
            <div className="font-medium">${calculateCrewCost().toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
