
import { useState } from "react";

// Vehicle types with their properties
export const vehicleTypes = [
  { id: "truck-24", name: "Truck (24 seats)", dailyRate: 350, fuelConsumption: 4, notes: "" },
  { id: "truck-16", name: "Truck (16 seats)", dailyRate: 250, fuelConsumption: 5, notes: "" },
  { id: "quantum", name: "Quantum", dailyRate: 150, fuelConsumption: 8, notes: "" },
  { id: "subcontracted", name: "Subcontracted Vehicle", dailyRate: 200, fuelConsumption: 7, notes: "" },
  { id: "custom", name: "Custom Vehicle", dailyRate: 175, fuelConsumption: 6, notes: "" }
];

// Crew types with their properties
export const crewRoles = [
  { id: "driver", name: "Driver", dailyRate: 120 },
  { id: "guide", name: "Guide", dailyRate: 150 },
  { id: "assistant", name: "Assistant", dailyRate: 80 }
];

// Room types with their properties
export const roomTypes = [
  { id: "single", name: "Single Room", baseMultiplier: 1.5 },
  { id: "double", name: "Double/Twin Room", baseMultiplier: 1.0 },
  { id: "triple", name: "Triple Room", baseMultiplier: 0.85 },
  { id: "family", name: "Family Room", baseMultiplier: 0.75 },
  { id: "dorm", name: "Dormitory", baseMultiplier: 0.5 },
  { id: "camping", name: "Camping", baseMultiplier: 0.3 }
];

// Meal basis options
export const mealBasisOptions = [
  { id: "ro", name: "Room Only", costMultiplier: 0.0, display: "RO" },
  { id: "bb", name: "Bed & Breakfast", costMultiplier: 0.15, display: "B&B" },
  { id: "hb", name: "Half Board", costMultiplier: 0.35, display: "HB" },
  { id: "fb", name: "Full Board", costMultiplier: 0.5, display: "FB" },
  { id: "ai", name: "All Inclusive", costMultiplier: 0.75, display: "AI" }
];

interface CrewMember {
  role: string;
  dailyRate: number;
  accommodationRate: number;
  mealAllowance: number;
}

interface CrewMealRates {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export function useTourCalculator() {
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
  const [customVehicleName, setCustomVehicleName] = useState("Custom Vehicle");
  const [customDailyRate, setCustomDailyRate] = useState(175);
  const [customFuelConsumption, setCustomFuelConsumption] = useState(6);
  const [vehicleNotes, setVehicleNotes] = useState("");
  
  // Accommodation settings
  const [averageAccommodationCost, setAverageAccommodationCost] = useState(120);
  const [accommodationMarkup, setAccommodationMarkup] = useState(10);
  const [selectedRoomType, setSelectedRoomType] = useState("double");
  const [selectedMealBasis, setSelectedMealBasis] = useState("bb");
  
  // Park fees
  const [parkFees, setParkFees] = useState<number[]>(Array(tourDuration).fill(0));
  
  // Crew settings
  const [crew, setCrew] = useState<CrewMember[]>([
    { role: "driver", dailyRate: 120, accommodationRate: 60, mealAllowance: 30 },
    { role: "guide", dailyRate: 150, accommodationRate: 60, mealAllowance: 30 }
  ]);
  
  const [crewMealRates, setCrewMealRates] = useState<CrewMealRates>({
    breakfast: 10,
    lunch: 15,
    dinner: 20
  });
  
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
    if (id === "custom") {
      return {
        id: "custom",
        name: customVehicleName,
        dailyRate: customDailyRate,
        fuelConsumption: customFuelConsumption,
        notes: vehicleNotes
      };
    }
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
    // Get room multiplier and meal multiplier
    const roomType = roomTypes.find(r => r.id === selectedRoomType) || roomTypes[1]; // Default to double
    const mealBasis = mealBasisOptions.find(m => m.id === selectedMealBasis) || mealBasisOptions[0]; // Default to RO
    
    // Calculate adjusted cost
    const baseRoomCost = averageAccommodationCost * roomType.baseMultiplier;
    const withMeals = baseRoomCost * (1 + mealBasis.costMultiplier);
    
    // Apply to all pax and days
    const baseCost = withMeals * tourDuration * currentPax;
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

  const calculateParkFeesCost = () => {
    // Sum all park fees for all passengers
    const totalParkFees = parkFees.reduce((sum, fee) => sum + fee, 0);
    return totalParkFees * currentPax;
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
    return (calculateAccommodationCost() + calculateActivityCost() + calculateMealCost() + calculateParkFeesCost()) / currentPax;
  };

  // Calculate total tour cost for the group
  const calculateTotalTourCost = () => {
    return calculateFixedCosts() + calculateAccommodationCost() + calculateActivityCost() + calculateMealCost() + calculateParkFeesCost();
  };

  // Calculate cost per person
  const calculateCostPerPerson = () => {
    return calculateTotalTourCost() / currentPax;
  };

  // Calculate daily cost per person
  const calculateDailyCostPerPerson = () => {
    return calculateCostPerPerson() / tourDuration;
  };

  // Calculate costs by group size
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

  return {
    // State values
    tourDuration,
    setTourDuration,
    minPax,
    setMinPax,
    maxPax,
    setMaxPax,
    currentPax,
    setCurrentPax,
    fuelPrice,
    setFuelPrice,
    totalDistance,
    setTotalDistance,
    selectedVehicle,
    setSelectedVehicle,
    vehicleMarkup,
    setVehicleMarkup,
    customVehicleName,
    setCustomVehicleName,
    customDailyRate,
    setCustomDailyRate,
    customFuelConsumption,
    setCustomFuelConsumption,
    vehicleNotes,
    setVehicleNotes,
    averageAccommodationCost,
    setAverageAccommodationCost,
    accommodationMarkup,
    setAccommodationMarkup,
    selectedRoomType,
    setSelectedRoomType,
    selectedMealBasis,
    setSelectedMealBasis,
    parkFees,
    setParkFees,
    crew,
    setCrew,
    crewMealRates,
    setCrewMealRates,
    averageActivityCost,
    setAverageActivityCost,
    activitiesMarkup,
    setActivitiesMarkup,
    includedActivities,
    setIncludedActivities,
    preparedMealsCost,
    setPreparedMealsCost,
    mealMarkup,
    setMealMarkup,
    includedMeals,
    setIncludedMeals,
    prePostNights,
    setPrePostNights,
    prePostAccommodationCost,
    setPrePostAccommodationCost,
    prePostMarkup,
    setPrePostMarkup,
    
    // Calculation functions
    getVehicleById,
    calculateVehicleCost,
    calculateFuelCost,
    calculateAccommodationCost,
    calculateCrewCost,
    calculateActivityCost,
    calculateMealCost,
    calculateParkFeesCost,
    calculatePrePostTourCost,
    calculateFixedCosts,
    calculatePerPersonCosts,
    calculateTotalTourCost,
    calculateCostPerPerson,
    calculateDailyCostPerPerson,
    calculateCostsByGroupSize,
    calculateProfit
  };
}
