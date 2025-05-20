
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

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
        <CardTitle>Tour Basics</CardTitle>
        <CardDescription>Configure basic tour parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tourDuration">Tour Duration (days)</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[tourDuration]}
              onValueChange={(value) => setTourDuration(value[0])}
              min={1}
              max={30}
              step={1}
              className="flex-1"
            />
            <span className="w-10 text-center">{tourDuration}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalDistance">Total Distance (km)</Label>
          <Input
            id="totalDistance"
            type="number"
            min={0}
            value={totalDistance}
            onChange={(e) => setTotalDistance(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-1">
          <Label>Group Size</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="minPax" className="text-xs">Minimum</Label>
              <Input
                id="minPax"
                type="number"
                min={1}
                max={maxPax}
                value={minPax}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMinPax(value);
                  if (value > currentPax) setCurrentPax(value);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="currentPax" className="text-xs">Current</Label>
              <Input
                id="currentPax"
                type="number"
                min={minPax}
                max={maxPax}
                value={currentPax}
                onChange={(e) => setCurrentPax(Number(e.target.value))}
                className="border-primary"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxPax" className="text-xs">Maximum</Label>
              <Input
                id="maxPax"
                type="number"
                min={minPax}
                value={maxPax}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMaxPax(value);
                  if (value < currentPax) setCurrentPax(value);
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-md mt-3">
          <h4 className="font-medium">Tour Overview</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Duration:</div>
            <div className="font-medium">{tourDuration} days</div>
            
            <div>Distance:</div>
            <div className="font-medium">{totalDistance} km</div>
            
            <div>Group size:</div>
            <div className="font-medium">{currentPax} passengers</div>
            
            <div>Daily average:</div>
            <div className="font-medium">{Math.round(totalDistance / tourDuration)} km/day</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
