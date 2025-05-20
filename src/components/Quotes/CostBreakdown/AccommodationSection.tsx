
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roomTypes, mealBasisOptions } from "@/hooks/tourCalculator/tourCalculatorData";

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
  const accommodationCost = calculateAccommodationCost();
  const perPersonCost = accommodationCost / currentPax;
  const perDayCost = perPersonCost / tourDuration;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accommodation</CardTitle>
        <CardDescription>Configure accommodation options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomType">Room Type</Label>
          <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
            <SelectTrigger id="roomType">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mealBasis">Meal Basis</Label>
          <Select value={selectedMealBasis} onValueChange={setSelectedMealBasis}>
            <SelectTrigger id="mealBasis">
              <SelectValue placeholder="Select meal basis" />
            </SelectTrigger>
            <SelectContent>
              {mealBasisOptions.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name} ({option.display})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="averageAccommodationCost">Average Daily Cost per Person ($)</Label>
          <Input
            id="averageAccommodationCost"
            type="number"
            min={0}
            value={averageAccommodationCost}
            onChange={(e) => setAverageAccommodationCost(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accommodationMarkup">Accommodation Markup (%)</Label>
          <Input
            id="accommodationMarkup"
            type="number"
            min={0}
            max={100}
            value={accommodationMarkup}
            onChange={(e) => setAccommodationMarkup(Number(e.target.value))}
          />
        </div>
        
        <div className="p-3 bg-muted/50 rounded-md">
          <h4 className="font-medium">Cost Summary</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Total accommodation cost:</div>
            <div className="font-medium">${accommodationCost.toFixed(2)}</div>
            
            <div>Cost per person:</div>
            <div className="font-medium">${perPersonCost.toFixed(2)}</div>
            
            <div>Daily cost per person:</div>
            <div className="font-medium">${perDayCost.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
