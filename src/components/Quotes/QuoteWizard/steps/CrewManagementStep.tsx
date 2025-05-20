import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Edit } from "lucide-react";
import { CrewMember, CrewMemberType } from "@/types/quotes";

interface CrewManagementStepProps {
  crewMembers: CrewMember[];
  setCrewMembers: (crewMembers: CrewMember[]) => void;
  totalDays: number;
  onValidChange: (valid: boolean) => void;
}

export function CrewManagementStep({
  crewMembers,
  setCrewMembers,
  totalDays,
  onValidChange
}: CrewManagementStepProps) {
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
  const [newCrew, setNewCrew] = useState<Partial<CrewMember>>({
    id: "",
    name: "",
    type: CrewMemberType.DRIVER_GUIDE,
    dailyWage: 0,
    startDay: 1,
    endDay: totalDays,
    relocationCost: 0
  });

  // Generate a unique ID for new crew members
  const generateId = () => {
    return `crew-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Handle adding a new crew member
  const handleAddCrew = () => {
    if (editingCrew) {
      // Update existing crew member
      setCrewMembers(
        crewMembers.map(crew => 
          crew.id === editingCrew.id ? { ...newCrew, id: editingCrew.id } as CrewMember : crew
        )
      );
      setEditingCrew(null);
    } else {
      // Add new crew member
      const crewMember: CrewMember = {
        ...newCrew,
        id: generateId()
      } as CrewMember;
      
      setCrewMembers([...crewMembers, crewMember]);
    }

    // Reset form
    setNewCrew({
      id: "",
      name: "",
      type: CrewMemberType.DRIVER_GUIDE,
      dailyWage: 0,
      startDay: 1,
      endDay: totalDays,
      relocationCost: 0
    });
    
    // The step is valid if we have at least one crew member
    onValidChange(crewMembers.length > 0);
  };

  // Handle editing a crew member
  const handleEditCrew = (crew: CrewMember) => {
    setEditingCrew(crew);
    setNewCrew({
      ...crew
    });
  };

  // Handle removing a crew member
  const handleRemoveCrew = (id: string) => {
    setCrewMembers(crewMembers.filter(crew => crew.id !== id));
    onValidChange(crewMembers.length > 1); // Still valid if we have at least one crew member after removal
  };

  // Calculate total crew costs
  const calculateTotalWages = () => {
    return crewMembers.reduce((total, crew) => {
      const daysWorked = crew.endDay - crew.startDay + 1;
      return total + (crew.dailyWage * daysWorked);
    }, 0);
  };

  const calculateTotalRelocationCosts = () => {
    return crewMembers.reduce((total, crew) => total + crew.relocationCost, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crew Management</CardTitle>
        <CardDescription>Add and manage crew members for this tour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Crew Members Table */}
        {crewMembers.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <TableCaption>List of crew members and their costs</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Daily Wage</TableHead>
                  <TableHead>Days on Tour</TableHead>
                  <TableHead>Total Wage</TableHead>
                  <TableHead>Relocation Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crewMembers.map((crew) => {
                  const daysWorked = crew.endDay - crew.startDay + 1;
                  const totalWage = crew.dailyWage * daysWorked;
                  
                  return (
                    <TableRow key={crew.id}>
                      <TableCell>{crew.name}</TableCell>
                      <TableCell>{crew.type}</TableCell>
                      <TableCell>${crew.dailyWage.toFixed(2)}</TableCell>
                      <TableCell>
                        {daysWorked} ({crew.startDay}-{crew.endDay})
                      </TableCell>
                      <TableCell>${totalWage.toFixed(2)}</TableCell>
                      <TableCell>${crew.relocationCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditCrew(crew)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveCrew(crew.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Summary Row */}
                <TableRow>
                  <TableCell colSpan={4} className="font-medium">Total</TableCell>
                  <TableCell className="font-medium">${calculateTotalWages().toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${calculateTotalRelocationCosts().toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No crew members yet. Add your first crew member below.
          </div>
        )}

        {/* Add/Edit Crew Form */}
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-md font-medium mb-2">
            {editingCrew ? 'Edit Crew Member' : 'Add New Crew Member'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crewName">Name</Label>
              <Input
                id="crewName"
                value={newCrew.name}
                onChange={(e) => setNewCrew({ ...newCrew, name: e.target.value })}
                placeholder="Enter crew member's name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="crewType">Crew Type</Label>
              <Select
                value={newCrew.type}
                onValueChange={(value) => 
                  setNewCrew({ ...newCrew, type: value as CrewMemberType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select crew type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CrewMemberType.DRIVER}>Driver</SelectItem>
                  <SelectItem value={CrewMemberType.GUIDE}>Guide</SelectItem>
                  <SelectItem value={CrewMemberType.DRIVER_GUIDE}>Driver/Guide</SelectItem>
                  <SelectItem value={CrewMemberType.COOK}>Cook</SelectItem>
                  <SelectItem value={CrewMemberType.ASSISTANT}>Assistant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyWage">Daily Wage</Label>
              <Input
                id="dailyWage"
                type="number"
                min="0"
                step="0.01"
                value={newCrew.dailyWage}
                onChange={(e) => 
                  setNewCrew({ ...newCrew, dailyWage: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDay">Start Day</Label>
              <Input
                id="startDay"
                type="number"
                min="1"
                max={totalDays}
                value={newCrew.startDay}
                onChange={(e) => {
                  const startDay = parseInt(e.target.value) || 1;
                  setNewCrew({ 
                    ...newCrew, 
                    startDay,
                    // Ensure end day is not before start day
                    endDay: newCrew.endDay && newCrew.endDay < startDay ? startDay : newCrew.endDay
                  });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDay">End Day</Label>
              <Input
                id="endDay"
                type="number"
                min={newCrew.startDay || 1}
                max={totalDays}
                value={newCrew.endDay}
                onChange={(e) => 
                  setNewCrew({ ...newCrew, endDay: parseInt(e.target.value) || totalDays })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relocationCost">Relocation Cost</Label>
            <Input
              id="relocationCost"
              type="number"
              min="0"
              step="0.01"
              value={newCrew.relocationCost}
              onChange={(e) => 
                setNewCrew({ ...newCrew, relocationCost: parseFloat(e.target.value) || 0 })
              }
              placeholder="Enter cost for crew flights/travel"
            />
          </div>

          <div className="mt-4 flex justify-end">
            {editingCrew && (
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => {
                  setEditingCrew(null);
                  setNewCrew({
                    id: "",
                    name: "",
                    type: CrewMemberType.DRIVER_GUIDE,
                    dailyWage: 0,
                    startDay: 1,
                    endDay: totalDays,
                    relocationCost: 0
                  });
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleAddCrew}
              disabled={!newCrew.name || newCrew.dailyWage <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingCrew ? 'Update Crew Member' : 'Add Crew Member'}
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <h3 className="text-md font-medium mb-2">Crew Cost Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Total Wages:</span>
                <span className="font-medium">${calculateTotalWages().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Relocation Costs:</span>
                <span className="font-medium">${calculateTotalRelocationCosts().toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Total Crew Costs:</span>
                <span className="font-bold">
                  ${(calculateTotalWages() + calculateTotalRelocationCosts()).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
