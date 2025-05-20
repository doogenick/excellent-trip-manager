
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MealsActivitiesSectionProps {
  includedMeals: number;
  setIncludedMeals: (value: number) => void;
  preparedMealsCost: number;
  setPreparedMealsCost: (value: number) => void;
  mealMarkup: number;
  setMealMarkup: (value: number) => void;
  includedActivities: number;
  setIncludedActivities: (value: number) => void;
  averageActivityCost: number;
  setAverageActivityCost: (value: number) => void;
  activitiesMarkup: number;
  setActivitiesMarkup: (value: number) => void;
  tourDuration: number;
  currentPax: number;
}

export function MealsActivitiesSection({
  includedMeals,
  setIncludedMeals,
  preparedMealsCost,
  setPreparedMealsCost,
  mealMarkup,
  setMealMarkup,
  includedActivities,
  setIncludedActivities,
  averageActivityCost,
  setAverageActivityCost,
  activitiesMarkup,
  setActivitiesMarkup,
  tourDuration,
  currentPax,
}: MealsActivitiesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meals & Activities</CardTitle>
        <CardDescription>Configure meals and activities for the tour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Included Meals</Label>
          <div className="flex items-center gap-2">
            <Slider 
              value={[includedMeals]} 
              onValueChange={(value) => setIncludedMeals(value[0])}
              min={0} 
              max={tourDuration * 3} 
              step={1}
              className="flex-1" 
            />
            <span className="w-10 text-center">{includedMeals}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum: {tourDuration * 3} meals ({tourDuration} days × 3 meals/day)
          </p>
        </div>
          
        <div className="space-y-2">
          <Label htmlFor="preparedMealsCost">Average Cost per Prepared Meal ($)</Label>
          <Input
            id="preparedMealsCost"
            type="number"
            min={1}
            value={preparedMealsCost}
            onChange={(e) => setPreparedMealsCost(Number(e.target.value))}
          />
        </div>
          
        <div className="space-y-2">
          <Label htmlFor="mealMarkup">Meal Markup (%)</Label>
          <Input
            id="mealMarkup"
            type="number"
            min={0}
            max={100}
            value={mealMarkup}
            onChange={(e) => setMealMarkup(Number(e.target.value))}
          />
        </div>
          
        <div className="border-t pt-4">
          <div className="space-y-2">
            <Label>Number of Included Activities</Label>
            <div className="flex items-center gap-2">
              <Slider 
                value={[includedActivities]} 
                onValueChange={(value) => setIncludedActivities(value[0])}
                min={0} 
                max={tourDuration * 2} 
                step={1}
                className="flex-1" 
              />
              <span className="w-10 text-center">{includedActivities}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Suggested max: {tourDuration * 2} activities ({tourDuration} days × 2 activities/day)
            </p>
          </div>
            
          <div className="space-y-2 mt-4">
            <Label htmlFor="averageActivityCost">Average Cost per Activity ($)</Label>
            <Input
              id="averageActivityCost"
              type="number"
              min={1}
              value={averageActivityCost}
              onChange={(e) => setAverageActivityCost(Number(e.target.value))}
            />
          </div>
            
          <div className="space-y-2">
            <Label htmlFor="activitiesMarkup">Activities Markup (%)</Label>
            <Input
              id="activitiesMarkup"
              type="number"
              min={0}
              max={100}
              value={activitiesMarkup}
              onChange={(e) => setActivitiesMarkup(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <h4 className="font-medium">Summary</h4>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Total meals cost:</div>
            <div className="font-medium">
              ${((preparedMealsCost * includedMeals * currentPax) * (1 + mealMarkup / 100)).toFixed(2)}
            </div>
            
            <div>Total activities cost:</div>
            <div className="font-medium">
              ${((averageActivityCost * includedActivities * currentPax) * (1 + activitiesMarkup / 100)).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
