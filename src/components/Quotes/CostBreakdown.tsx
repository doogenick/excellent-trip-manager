
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Car, Users, Hotel, Utensils, Calendar, User, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Vehicle types with their properties
const vehicleTypes = [
  { id: "truck-24", name: "Truck (24 seats)", dailyRate: 350, fuelConsumption: 4 },
  { id: "truck-16", name: "Truck (16 seats)", dailyRate: 250, fuelConsumption: 5 },
  { id: "quantum", name: "Quantum", dailyRate: 150, fuelConsumption: 8 },
  { id: "subcontracted", name: "Subcontracted Vehicle", dailyRate: 200, fuelConsumption: 7 }
];

// Crew types with their properties
const crewRoles = [
  { id: "driver", name: "Driver", dailyRate: 120 },
  { id: "guide", name: "Guide", dailyRate: 150 },
  { id: "assistant", name: "Assistant", dailyRate: 80 }
];

interface CrewMember {
  role: string;
  dailyRate: number;
  accommodationRate: number;
  mealAllowance: number;
}

export function CostBreakdown() {
  // Tour basic settings
  const [tourDuration, setTourDuration] = useState(7);
  const [minPax, setMinPax] = useState(2);
  const [maxPax, setMaxPax] = useState(16);
  const [currentPax, setCurrentPax] = useState(8);
  const [fuelPrice, setFuelPrice] = useState(2.5);
  const [totalDistance, setTotalDistance] = useState(1200);
  
  // Vehicle settings
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0].id);
  const [vehicleMarkup, setVehicleMarkup] = useState(15);
  
  // Accommodation settings
  const [averageAccommodationCost, setAverageAccommodationCost] = useState(120);
  const [accommodationMarkup, setAccommodationMarkup] = useState(10);
  
  // Crew settings
  const [crew, setCrew] = useState<CrewMember[]>([
    { role: "driver", dailyRate: 120, accommodationRate: 60, mealAllowance: 30 },
    { role: "guide", dailyRate: 150, accommodationRate: 60, mealAllowance: 30 }
  ]);
  
  // Activities settings
  const [averageActivityCost, setAverageActivityCost] = useState(50);
  const [activitiesMarkup, setActivitiesMarkup] = useState(20);
  const [includedActivities, setIncludedActivities] = useState(5);
  
  // Meals settings
  const [preparedMealsCost, setPreparedMealsCost] = useState(15);
  const [mealMarkup, setMealMarkup] = useState(15);
  const [includedMeals, setIncludedMeals] = useState(10); // Number of prepared meals included
  
  // Pre/Post tour options
  const [prePostNights, setPrePostNights] = useState(2);
  const [prePostAccommodationCost, setPrePostAccommodationCost] = useState(100);
  const [prePostMarkup, setPrePostMarkup] = useState(10);

  // Helper function to get vehicle by ID
  const getVehicleById = (id: string) => {
    return vehicleTypes.find(v => v.id === id) || vehicleTypes[0];
  };

  // Cost calculation functions
  const calculateVehicleCost = () => {
    const vehicle = getVehicleById(selectedVehicle);
    const baseCost = vehicle.dailyRate * tourDuration;
    const markup = baseCost * (vehicleMarkup / 100);
    return baseCost + markup;
  };

  const calculateFuelCost = () => {
    const vehicle = getVehicleById(selectedVehicle);
    const fuelNeeded = totalDistance / vehicle.fuelConsumption;
    return fuelNeeded * fuelPrice;
  };

  const calculateAccommodationCost = () => {
    const baseCost = averageAccommodationCost * tourDuration * currentPax;
    const markup = baseCost * (accommodationMarkup / 100);
    return baseCost + markup;
  };

  const calculateCrewCost = () => {
    return crew.reduce((total, member) => {
      const dailyCost = member.dailyRate * tourDuration;
      const accommodationCost = member.accommodationRate * tourDuration;
      const mealCost = member.mealAllowance * tourDuration;
      return total + dailyCost + accommodationCost + mealCost;
    }, 0);
  };

  const calculateActivityCost = () => {
    const baseCost = averageActivityCost * includedActivities * currentPax;
    const markup = baseCost * (activitiesMarkup / 100);
    return baseCost + markup;
  };

  const calculateMealCost = () => {
    const baseCost = preparedMealsCost * includedMeals * currentPax;
    const markup = baseCost * (mealMarkup / 100);
    return baseCost + markup;
  };

  const calculatePrePostTourCost = () => {
    const baseCost = prePostAccommodationCost * prePostNights;
    const markup = baseCost * (prePostMarkup / 100);
    return baseCost + markup;
  };

  // Calculate fixed costs that are divided among all passengers
  const calculateFixedCosts = () => {
    return calculateVehicleCost() + calculateFuelCost() + calculateCrewCost();
  };

  // Calculate per-person costs that scale directly with passenger count
  const calculatePerPersonCosts = () => {
    return (calculateAccommodationCost() + calculateActivityCost() + calculateMealCost()) / currentPax;
  };

  // Calculate total tour cost for the group
  const calculateTotalTourCost = () => {
    return calculateFixedCosts() + calculateAccommodationCost() + calculateActivityCost() + calculateMealCost();
  };

  // Calculate cost per person
  const calculateCostPerPerson = () => {
    return calculateTotalTourCost() / currentPax;
  };

  // Calculate daily cost per person
  const calculateDailyCostPerPerson = () => {
    return calculateCostPerPerson() / tourDuration;
  };

  // Calculate per-person costs for different group sizes
  const calculateCostsByGroupSize = () => {
    const costs = [];
    for (let pax = minPax; pax <= maxPax; pax++) {
      const fixedCostsPerPerson = calculateFixedCosts() / pax;
      const variableCosts = (calculateAccommodationCost() / currentPax) + 
                            (calculateActivityCost() / currentPax) + 
                            (calculateMealCost() / currentPax);
      
      costs.push({
        pax,
        totalCost: fixedCostsPerPerson + variableCosts,
        dailyCost: (fixedCostsPerPerson + variableCosts) / tourDuration
      });
    }
    return costs;
  };

  const costsByGroupSize = calculateCostsByGroupSize();
  const maxCost = Math.max(...costsByGroupSize.map(c => c.totalCost));
  const minCost = Math.min(...costsByGroupSize.map(c => c.totalCost));
  const range = maxCost - minCost;

  // Calculate profit
  const calculateProfit = () => {
    const baseFixedCosts = calculateVehicleCost() / (1 + (vehicleMarkup / 100)) + 
                         calculateFuelCost() + 
                         calculateCrewCost();
    
    const baseAccommodationCost = (averageAccommodationCost * tourDuration * currentPax) / (1 + (accommodationMarkup / 100));
    const baseActivityCost = (averageActivityCost * includedActivities * currentPax) / (1 + (activitiesMarkup / 100));
    const baseMealCost = (preparedMealsCost * includedMeals * currentPax) / (1 + (mealMarkup / 100));
    
    const totalBaseCost = baseFixedCosts + baseAccommodationCost + baseActivityCost + baseMealCost;
    const profit = calculateTotalTourCost() - totalBaseCost;
    
    return profit;
  };
  
  const profitPerDay = calculateProfit() / tourDuration;
  const profitPerPerson = calculateProfit() / currentPax;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cost Breakdown Calculator</h1>
          <p className="text-muted-foreground">Analyze tour costs and optimize pricing</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Save Calculation</Button>
          <Button>Export PDF</Button>
        </div>
      </div>

      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="calculator">
            <DollarSign className="h-4 w-4 mr-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <Calendar className="h-4 w-4 mr-2" />
            Daily Breakdown
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Users className="h-4 w-4 mr-2" />
            Group Size Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle & Fuel
                </CardTitle>
                <CardDescription>Configure transportation and fuel details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Vehicle Options</SelectLabel>
                        {vehicleTypes.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} (${vehicle.dailyRate}/day)
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="vehicle-markup">Vehicle Markup: {vehicleMarkup}%</Label>
                    <span className="text-sm font-medium">
                      ${calculateVehicleCost().toLocaleString()}
                    </span>
                  </div>
                  <Slider 
                    id="vehicle-markup" 
                    min={0} 
                    max={50} 
                    step={1} 
                    value={[vehicleMarkup]} 
                    onValueChange={(values) => setVehicleMarkup(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuel-price">Fuel Price ($/liter): {fuelPrice.toFixed(2)}</Label>
                  <Slider 
                    id="fuel-price" 
                    min={1} 
                    max={5} 
                    step={0.1} 
                    value={[fuelPrice]} 
                    onValueChange={(values) => setFuelPrice(values[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Fuel Cost:</span>
                    <span className="font-medium">${calculateFuelCost().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Fuel Cost per Person:</span>
                    <span className="font-medium">${(calculateFuelCost() / currentPax).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Crew
                </CardTitle>
                <CardDescription>Manage crew and related expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {crew.map((member, index) => (
                  <div key={index} className="p-3 border rounded-md space-y-2">
                    <div className="flex justify-between">
                      <Label>Role: {crewRoles.find(r => r.id === member.role)?.name}</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCrew(crew.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`crew-rate-${index}`}>Daily Rate</Label>
                        <Input 
                          id={`crew-rate-${index}`} 
                          type="number" 
                          min={0} 
                          value={member.dailyRate} 
                          onChange={(e) => {
                            const newCrew = [...crew];
                            newCrew[index].dailyRate = parseInt(e.target.value) || 0;
                            setCrew(newCrew);
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`crew-accom-${index}`}>Accom. Rate</Label>
                        <Input 
                          id={`crew-accom-${index}`} 
                          type="number" 
                          min={0} 
                          value={member.accommodationRate} 
                          onChange={(e) => {
                            const newCrew = [...crew];
                            newCrew[index].accommodationRate = parseInt(e.target.value) || 0;
                            setCrew(newCrew);
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`crew-meal-${index}`}>Meal Allowance</Label>
                      <Input 
                        id={`crew-meal-${index}`} 
                        type="number" 
                        min={0} 
                        value={member.mealAllowance} 
                        onChange={(e) => {
                          const newCrew = [...crew];
                          newCrew[index].mealAllowance = parseInt(e.target.value) || 0;
                          setCrew(newCrew);
                        }}
                      />
                    </div>
                  </div>
                ))}
                
                {crew.length < 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setCrew([...crew, { 
                      role: crewRoles.find(r => !crew.some(c => c.role === r.id))?.id || "assistant", 
                      dailyRate: 80, 
                      accommodationRate: 50, 
                      mealAllowance: 25 
                    }])}
                  >
                    Add Crew Member
                  </Button>
                )}
                
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span>Total Crew Cost:</span>
                  <span className="font-medium">${calculateCrewCost().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
          
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>Cost & Profit Summary</CardTitle>
              <CardDescription>
                Breakdown of total costs, per-person costs, and expected profits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Total Costs</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Vehicle Cost:</span>
                      <span className="font-medium">${calculateVehicleCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fuel Cost:</span>
                      <span className="font-medium">${calculateFuelCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Crew Cost:</span>
                      <span className="font-medium">${calculateCrewCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Accommodation Cost:</span>
                      <span className="font-medium">${calculateAccommodationCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Activities Cost:</span>
                      <span className="font-medium">${calculateActivityCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Meals Cost:</span>
                      <span className="font-medium">${calculateMealCost().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="font-medium">Total Tour Cost:</span>
                      <span className="font-bold">${calculateTotalTourCost().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Per Person Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fixed Costs Per Person:</span>
                      <span className="font-medium">${(calculateFixedCosts() / currentPax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Variable Costs Per Person:</span>
                      <span className="font-medium">${calculatePerPersonCosts().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="font-medium">Total Per Person:</span>
                      <span className="font-bold">${calculateCostPerPerson().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Cost Per Person:</span>
                      <span className="font-medium">${calculateDailyCostPerPerson().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm font-medium mb-1">Recommended Selling Price (per person)</p>
                    <p className="text-2xl font-bold">${Math.ceil(calculateCostPerPerson() / 10) * 10}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Profit Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Profit:</span>
                      <span className="font-medium">${calculateProfit().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profit Per Day:</span>
                      <span className="font-medium">${profitPerDay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profit Per Person:</span>
                      <span className="font-medium">${profitPerPerson.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t mt-2">
                      <span className="text-sm">Profit Margin:</span>
                      <span className="font-medium">
                        {((calculateProfit() / calculateTotalTourCost()) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm font-medium mb-1">Breakeven Point</p>
                    <p className="text-xl font-bold">
                      {Math.ceil(calculateFixedCosts() / calculatePerPersonCosts())} passengers
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Daily Cost Breakdown</CardTitle>
              <CardDescription>Day-by-day cost analysis of the tour</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Accommodation</TableHead>
                    <TableHead>Meals</TableHead>
                    <TableHead>Activities</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead className="text-right">Daily Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: tourDuration }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dailyAccom = averageAccommodationCost * (1 + accommodationMarkup / 100);
                    
                    // Simulate varying daily expenses for a more realistic appearance
                    const mealsFactor = 0.8 + Math.random() * 0.4;
                    const activitiesFactor = day % 3 === 0 ? 1.5 : day % 2 === 0 ? 0.7 : 1;
                    
                    const dailyMeals = (preparedMealsCost * (1 + mealMarkup / 100)) * mealsFactor;
                    const dailyActivities = averageActivityCost * activitiesFactor * (1 + activitiesMarkup / 100);
                    const dailyVehicle = calculateVehicleCost() / tourDuration;
                    const dailyCrew = calculateCrewCost() / tourDuration;
                    
                    const dailyTotal = dailyAccom + dailyMeals + dailyActivities + 
                                     (dailyVehicle / currentPax) + (dailyCrew / currentPax);
                    
                    return (
                      <TableRow key={day}>
                        <TableCell>Day {day}</TableCell>
                        <TableCell>${dailyAccom.toFixed(0)}</TableCell>
                        <TableCell>${dailyMeals.toFixed(0)}</TableCell>
                        <TableCell>${dailyActivities.toFixed(0)}</TableCell>
                        <TableCell>${(dailyVehicle / currentPax).toFixed(0)}</TableCell>
                        <TableCell>${(dailyCrew / currentPax).toFixed(0)}</TableCell>
                        <TableCell className="text-right font-medium">${dailyTotal.toFixed(0)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Group Size Cost Comparison</CardTitle>
              <CardDescription>
                How costs per person change with different group sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-64 w-full flex items-end gap-1">
                {costsByGroupSize.map((costData) => {
                  const heightPercent = 100 - ((costData.totalCost - minCost) / range) * 100;
                  const isCurrentSize = costData.pax === currentPax;
                  
                  return (
                    <div 
                      key={costData.pax}
                      className="flex flex-col items-center flex-1"
                    >
                      <div 
                        className={cn(
                          "w-full rounded-t transition-all duration-200",
                          isCurrentSize ? "bg-primary" : "bg-primary/30"
                        )}
                        style={{ 
                          height: `${Math.max(10, heightPercent)}%`
                        }}
                      />
                      <div className={cn(
                        "text-[10px] mt-1",
                        isCurrentSize ? "font-bold" : ""
                      )}>
                        {costData.pax}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Group Size</span>
                <span>Higher bars = lower per-person price</span>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Size</TableHead>
                    <TableHead>Fixed Cost pp</TableHead>
                    <TableHead>Variable Cost pp</TableHead>
                    <TableHead>Total pp</TableHead>
                    <TableHead>Daily Cost pp</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    minPax,
                    Math.round(minPax + (maxPax - minPax) * 0.25),
                    Math.round(minPax + (maxPax - minPax) * 0.5),
                    Math.round(minPax + (maxPax - minPax) * 0.75),
                    maxPax
                  ].map((pax) => {
                    const fixedCostsPerPerson = calculateFixedCosts() / pax;
                    const variableCosts = (calculateAccommodationCost() / currentPax) + 
                                          (calculateActivityCost() / currentPax) + 
                                          (calculateMealCost() / currentPax);
                    
                    const totalPerPerson = fixedCostsPerPerson + variableCosts;
                    const dailyCostPerPerson = totalPerPerson / tourDuration;
                    const totalRevenue = totalPerPerson * pax;
                    
                    const isCurrentSize = pax === currentPax;
                    
                    return (
                      <TableRow key={pax} className={isCurrentSize ? "bg-muted" : ""}>
                        <TableCell className="font-medium">{pax} passengers</TableCell>
                        <TableCell>${Math.round(fixedCostsPerPerson).toLocaleString()}</TableCell>
                        <TableCell>${Math.round(variableCosts).toLocaleString()}</TableCell>
                        <TableCell>${Math.round(totalPerPerson).toLocaleString()}</TableCell>
                        <TableCell>${Math.round(dailyCostPerPerson).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          ${Math.round(totalRevenue).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
