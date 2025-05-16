
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface TourBasicsSectionProps {
  tourDuration: number;
  setTourDuration: (value: number) => void;
  totalDistance: number;
  setTotalDistance: (value: number) => void;
  currentPax: number;
  setCurrentPax: (value: number) => void;
  minPax: number;
  setMinPax: (value: number) => void;
  maxPax: number;
  setMaxPax: (value: number) => void;
}

export function TourBasicsSection({
  tourDuration,
  setTourDuration,
  totalDistance,
  setTotalDistance,
  currentPax,
  setCurrentPax,
  minPax,
  setMinPax,
  maxPax,
  setMaxPax
}: TourBasicsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Tour Basics
        </CardTitle>
        <CardDescription>Set the fundamental parameters of your tour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tour-duration">Tour Duration (days): {tourDuration}</Label>
          <Slider 
            id="tour-duration" 
            min={1} 
            max={30} 
            step={1} 
            value={[tourDuration]} 
            onValueChange={(values) => setTourDuration(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total-distance">Total Distance (km): {totalDistance}</Label>
          <Slider 
            id="total-distance" 
            min={100} 
            max={5000} 
            step={100} 
            value={[totalDistance]} 
            onValueChange={(values) => setTotalDistance(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current-pax">Current Group Size: {currentPax}</Label>
          <Slider 
            id="current-pax" 
            min={minPax} 
            max={maxPax} 
            step={1} 
            value={[currentPax]} 
            onValueChange={(values) => setCurrentPax(values[0])}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min-pax">Min Pax</Label>
            <Input 
              id="min-pax" 
              type="number" 
              min={1} 
              max={maxPax - 1} 
              value={minPax} 
              onChange={(e) => setMinPax(parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <Label htmlFor="max-pax">Max Pax</Label>
            <Input 
              id="max-pax" 
              type="number" 
              min={minPax + 1} 
              max={50} 
              value={maxPax} 
              onChange={(e) => setMaxPax(parseInt(e.target.value) || minPax + 1)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
