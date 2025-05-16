
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";

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
  tourDuration
}: MealsActivitiesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Meals & Activities
        </CardTitle>
        <CardDescription>Configure included meals and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="included-meals">Included Meals</Label>
            <Input 
              id="included-meals" 
              type="number" 
              min={0} 
              max={tourDuration * 3} 
              value={includedMeals} 
              onChange={(e) => setIncludedMeals(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meal-cost">Cost Per Meal</Label>
            <Input 
              id="meal-cost" 
              type="number" 
              min={1} 
              value={preparedMealsCost} 
              onChange={(e) => setPreparedMealsCost(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="meal-markup">Meal Markup: {mealMarkup}%</Label>
          </div>
          <Slider 
            id="meal-markup" 
            min={0} 
            max={50} 
            step={1} 
            value={[mealMarkup]} 
            onValueChange={(values) => setMealMarkup(values[0])}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="included-activities">Included Activities</Label>
            <Input 
              id="included-activities" 
              type="number" 
              min={0} 
              value={includedActivities} 
              onChange={(e) => setIncludedActivities(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-cost">Avg Activity Cost</Label>
            <Input 
              id="activity-cost" 
              type="number" 
              min={1} 
              value={averageActivityCost} 
              onChange={(e) => setAverageActivityCost(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="activity-markup">Activity Markup: {activitiesMarkup}%</Label>
          </div>
          <Slider 
            id="activity-markup" 
            min={0} 
            max={50} 
            step={1} 
            value={[activitiesMarkup]} 
            onValueChange={(values) => setActivitiesMarkup(values[0])}
          />
        </div>
      </CardContent>
    </Card>
  );
}
