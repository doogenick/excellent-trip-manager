
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface PrePostTourSectionProps {
  prePostNights: number;
  setPrePostNights: (value: number) => void;
  prePostAccommodationCost: number;
  setPrePostAccommodationCost: (value: number) => void;
  prePostMarkup: number;
  setPrePostMarkup: (value: number) => void;
  calculatePrePostTourCost: () => number;
}

export function PrePostTourSection({
  prePostNights,
  setPrePostNights,
  prePostAccommodationCost,
  setPrePostAccommodationCost,
  prePostMarkup,
  setPrePostMarkup,
  calculatePrePostTourCost
}: PrePostTourSectionProps) {
  const prePostCost = calculatePrePostTourCost();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre/Post Tour</CardTitle>
        <CardDescription>Configure pre/post tour options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Additional Nights</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[prePostNights]}
              onValueChange={(value) => setPrePostNights(value[0])}
              min={0}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="w-10 text-center">{prePostNights}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prePostAccommodationCost">Cost per Night ($)</Label>
          <Input
            id="prePostAccommodationCost"
            type="number"
            min={0}
            value={prePostAccommodationCost}
            onChange={(e) => setPrePostAccommodationCost(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prePostMarkup">Markup (%)</Label>
          <Input
            id="prePostMarkup"
            type="number"
            min={0}
            max={100}
            value={prePostMarkup}
            onChange={(e) => setPrePostMarkup(Number(e.target.value))}
          />
        </div>
        
        <div className="p-3 bg-muted/50 rounded-md">
          <h4 className="font-medium">Cost Summary</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Total pre/post tour cost:</div>
            <div className="font-medium">${prePostCost.toFixed(2)}</div>
            
            <div>Cost per night:</div>
            <div className="font-medium">
              ${prePostNights ? (prePostCost / prePostNights).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
