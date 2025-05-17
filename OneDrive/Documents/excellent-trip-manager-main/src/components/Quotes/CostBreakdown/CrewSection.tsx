
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { crewRoles } from "@/hooks/useTourCalculator";

interface CrewMember {
  role: string;
  dailyRate: number;
  accommodationRate: number;
  mealAllowance: number;
}

interface CrewSectionProps {
  crew: CrewMember[];
  setCrew: (crew: CrewMember[]) => void;
  calculateCrewCost: () => number;
}

export function CrewSection({
  crew,
  setCrew,
  calculateCrewCost
}: CrewSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Crew
        </CardTitle>
        <CardDescription>Manage crew and related expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {crew.map((member, index) => (
          <div key={index} className="p-3 border rounded-md space-y-2">
            <div className="flex justify-between">
              <Label>Role: {crewRoles.find(r => r.id === member.role)?.name}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCrew(crew.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`crew-rate-${index}`}>Daily Rate</Label>
                <Input 
                  id={`crew-rate-${index}`} 
                  type="number" 
                  min={0} 
                  value={member.dailyRate} 
                  onChange={(e) => {
                    const newCrew = [...crew];
                    newCrew[index].dailyRate = parseInt(e.target.value) || 0;
                    setCrew(newCrew);
                  }}
                />
              </div>
              <div>
                <Label htmlFor={`crew-accom-${index}`}>Accom. Rate</Label>
                <Input 
                  id={`crew-accom-${index}`} 
                  type="number" 
                  min={0} 
                  value={member.accommodationRate} 
                  onChange={(e) => {
                    const newCrew = [...crew];
                    newCrew[index].accommodationRate = parseInt(e.target.value) || 0;
                    setCrew(newCrew);
                  }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`crew-meal-${index}`}>Meal Allowance</Label>
              <Input 
                id={`crew-meal-${index}`} 
                type="number" 
                min={0} 
                value={member.mealAllowance} 
                onChange={(e) => {
                  const newCrew = [...crew];
                  newCrew[index].mealAllowance = parseInt(e.target.value) || 0;
                  setCrew(newCrew);
                }}
              />
            </div>
          </div>
        ))}
        
        {crew.length < 3 && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setCrew([...crew, { 
              role: crewRoles.find(r => !crew.some(c => c.role === r.id))?.id || "assistant", 
              dailyRate: 80, 
              accommodationRate: 50, 
              mealAllowance: 25 
            }])}
          >
            Add Crew Member
          </Button>
        )}
        
        <div className="flex justify-between text-sm pt-2 border-t">
          <span>Total Crew Cost:</span>
          <span className="font-medium">${calculateCrewCost().toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
