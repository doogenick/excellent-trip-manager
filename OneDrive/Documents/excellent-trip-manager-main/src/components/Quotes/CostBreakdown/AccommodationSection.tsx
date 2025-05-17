
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Bed } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Define room types
const roomTypes = [
  { id: "single", name: "Single Room", baseMultiplier: 1.5 },
  { id: "double", name: "Double/Twin Room", baseMultiplier: 1.0 },
  { id: "triple", name: "Triple Room", baseMultiplier: 0.85 },
  { id: "family", name: "Family Room", baseMultiplier: 0.75 },
  { id: "dorm", name: "Dormitory", baseMultiplier: 0.5 },
  { id: "camping", name: "Camping", baseMultiplier: 0.3 }
];

// Define meal basis options
const mealBasisOptions = [
  { id: "ro", name: "Room Only", costMultiplier: 0.0, display: "RO" },
  { id: "bb", name: "Bed & Breakfast", costMultiplier: 0.15, display: "B&B" },
  { id: "hb", name: "Half Board", costMultiplier: 0.35, display: "HB" },
  { id: "fb", name: "Full Board", costMultiplier: 0.5, display: "FB" },
  { id: "ai", name: "All Inclusive", costMultiplier: 0.75, display: "AI" }
];

interface AccommodationSectionProps {
  averageAccommodationCost: number;
  setAverageAccommodationCost: (value: number) => void;
  accommodationMarkup: number;
  setAccommodationMarkup: (value: number) => void;
  calculateAccommodationCost: () => number;
  currentPax: number;
  tourDuration: number;
  selectedRoomType: string;
  setSelectedRoomType: (value: string) => void;
  selectedMealBasis: string;
  setSelectedMealBasis: (value: string) => void;
}

export function AccommodationSection({
  averageAccommodationCost,
  setAverageAccommodationCost,
  accommodationMarkup,
  setAccommodationMarkup,
  calculateAccommodationCost,
  currentPax,
  tourDuration,
  selectedRoomType,
  setSelectedRoomType,
  selectedMealBasis,
  setSelectedMealBasis
}: AccommodationSectionProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const selectedRoom = roomTypes.find(room => room.id === selectedRoomType) || roomTypes[1]; // Default to double
  const selectedMeal = mealBasisOptions.find(meal => meal.id === selectedMealBasis) || mealBasisOptions[0]; // Default to RO

  // Calculate adjusted cost based on room type and meal basis
  const calculateAdjustedCost = () => {
    const roomMultiplier = selectedRoom.baseMultiplier;
    const mealMultiplier = selectedMeal.costMultiplier;
    
    // Base cost with room type adjustment
    const baseWithRoom = averageAccommodationCost * roomMultiplier;
    
    // Add meal basis cost
    const withMeals = baseWithRoom * (1 + mealMultiplier);
    
    return withMeals;
  };

  const adjustedCost = calculateAdjustedCost();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Accommodation
        </CardTitle>
        <CardDescription>Configure accommodation costs and markup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="average-accom-cost">Average Accommodation Cost ($/person/night)</Label>
          <Input 
            id="average-accom-cost" 
            type="number" 
            min={10} 
            value={averageAccommodationCost} 
            onChange={(e) => setAverageAccommodationCost(parseInt(e.target.value) || 10)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="room-type">Room Type</Label>
            <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
              <SelectTrigger id="room-type">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="meal-basis">Meal Basis</Label>
            <Select value={selectedMealBasis} onValueChange={setSelectedMealBasis}>
              <SelectTrigger id="meal-basis">
                <SelectValue placeholder="Select meal basis" />
              </SelectTrigger>
              <SelectContent>
                {mealBasisOptions.map((meal) => (
                  <SelectItem key={meal.id} value={meal.id}>
                    {meal.name} ({meal.display})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="accom-markup">Accommodation Markup: {accommodationMarkup}%</Label>
          </div>
          <Slider 
            id="accom-markup" 
            min={0} 
            max={50} 
            step={1} 
            value={[accommodationMarkup]} 
            onValueChange={(values) => setAccommodationMarkup(values[0])}
          />
        </div>

        <div className="p-3 bg-muted rounded-md">
          <div className="flex justify-between text-sm">
            <span>Base Cost:</span>
            <span>${averageAccommodationCost}/night</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Adjusted for {selectedRoom.name} with {selectedMeal.name}:</span>
            <span>${adjustedCost.toFixed(2)}/night</span>
          </div>
        </div>
        
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-sm">
            <span>Total Accommodation Cost:</span>
            <span className="font-medium">${calculateAccommodationCost().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Per Person:</span>
            <span className="font-medium">${(calculateAccommodationCost() / currentPax).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Per Person Per Night:</span>
            <span className="font-medium">${((calculateAccommodationCost() / currentPax) / tourDuration).toFixed(2)}</span>
          </div>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="pt-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {isAdvancedOpen ? "Hide" : "Show"} Daily Customization
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-3 border p-3 rounded-md">
              <h4 className="font-medium flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Daily Accommodation Settings
              </h4>
              <p className="text-sm text-muted-foreground">
                Note: Daily customization will be available in the Daily Breakdown tab
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
