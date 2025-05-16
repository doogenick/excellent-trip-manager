
import { useState } from "react";

// Vehicle types with their properties
export const vehicleTypes = [
  { id: "truck-24", name: "Truck (24 seats)", dailyRate: 350, fuelConsumption: 4 },
  { id: "truck-16", name: "Truck (16 seats)", dailyRate: 250, fuelConsumption: 5 },
  { id: "quantum", name: "Quantum", dailyRate: 150, fuelConsumption: 8 },
  { id: "subcontracted", name: "Subcontracted Vehicle", dailyRate: 200, fuelConsumption: 7 }
];

// Crew types with their properties
export const crewRoles = [
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
    averageAccommodationCost,
    setAverageAccommodationCost,
    accommodationMarkup,
    setAccommodationMarkup,
    crew,
    setCrew,
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
