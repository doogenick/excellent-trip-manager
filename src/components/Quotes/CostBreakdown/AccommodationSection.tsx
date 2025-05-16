
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "lucide-react";

interface AccommodationSectionProps {
  averageAccommodationCost: number;
  setAverageAccommodationCost: (value: number) => void;
  accommodationMarkup: number;
  setAccommodationMarkup: (value: number) => void;
  calculateAccommodationCost: () => number;
  currentPax: number;
  tourDuration: number;
}

export function AccommodationSection({
  averageAccommodationCost,
  setAverageAccommodationCost,
  accommodationMarkup,
  setAccommodationMarkup,
  calculateAccommodationCost,
  currentPax,
  tourDuration
}: AccommodationSectionProps) {
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
      </CardContent>
    </Card>
  );
}
