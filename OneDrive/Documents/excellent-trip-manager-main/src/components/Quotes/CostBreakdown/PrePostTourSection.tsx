
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Pre/Post Tour Options
        </CardTitle>
        <CardDescription>Configure optional pre/post tour offerings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pre-post-nights">Pre/Post Nights</Label>
            <Input 
              id="pre-post-nights" 
              type="number" 
              min={1} 
              max={10} 
              value={prePostNights} 
              onChange={(e) => setPrePostNights(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pre-post-cost">Cost Per Night</Label>
            <Input 
              id="pre-post-cost" 
              type="number" 
              min={10} 
              value={prePostAccommodationCost} 
              onChange={(e) => setPrePostAccommodationCost(parseInt(e.target.value) || 10)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="pre-post-markup">Pre/Post Tour Markup: {prePostMarkup}%</Label>
          </div>
          <Slider 
            id="pre-post-markup" 
            min={0} 
            max={50} 
            step={1} 
            value={[prePostMarkup]} 
            onValueChange={(values) => setPrePostMarkup(values[0])}
          />
        </div>
        
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">Pre/Post Tour Package (per person)</p>
          <p className="text-xl font-bold">${calculatePrePostTourCost().toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">
            For {prePostNights} {prePostNights === 1 ? 'night' : 'nights'} of additional accommodation
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
