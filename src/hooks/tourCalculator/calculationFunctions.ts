
import { CrewMember } from './types';
import { vehicleTypes } from './tourCalculatorData';

// Helper function to get vehicle by ID
export const getVehicleById = (
  id: string, 
  customVehicleName: string, 
  customDailyRate: number,
  customFuelConsumption: number,
  vehicleNotes: string
) => {
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
export const calculateVehicleCost = (
  selectedVehicle: string,
  tourDuration: number,
  vehicleMarkup: number,
  customVehicleName: string,
  customDailyRate: number,
  customFuelConsumption: number,
  vehicleNotes: string
) => {
  const vehicle = getVehicleById(selectedVehicle, customVehicleName, customDailyRate, customFuelConsumption, vehicleNotes);
  const baseCost = vehicle.dailyRate * tourDuration;
  const markup = baseCost * (vehicleMarkup / 100);
  return baseCost + markup;
};

export const calculateFuelCost = (
  selectedVehicle: string,
  totalDistance: number,
  fuelPrice: number,
  customVehicleName: string,
  customDailyRate: number,
  customFuelConsumption: number,
  vehicleNotes: string
) => {
  const vehicle = getVehicleById(selectedVehicle, customVehicleName, customDailyRate, customFuelConsumption, vehicleNotes);
  const fuelNeeded = totalDistance / vehicle.fuelConsumption;
  return fuelNeeded * fuelPrice;
};

export const calculateAccommodationCost = (
  averageAccommodationCost: number,
  selectedRoomType: string,
  selectedMealBasis: string,
  accommodationMarkup: number,
  tourDuration: number,
  currentPax: number
) => {
  // Room type multipliers
  const roomMultipliers: {[key: string]: number} = {
    "single": 1.5,
    "double": 1.0,
    "triple": 0.85,
    "family": 0.75,
    "dorm": 0.5,
    "camping": 0.3
  };

  // Meal basis cost adders
  const mealMultipliers: {[key: string]: number} = {
    "ro": 0.0,
    "bb": 0.15,
    "hb": 0.35,
    "fb": 0.5,
    "ai": 0.75
  };
  
  // Get room multiplier and meal multiplier
  const roomMultiplier = roomMultipliers[selectedRoomType] || 1.0; 
  const mealMultiplier = mealMultipliers[selectedMealBasis] || 0.0;
  
  // Calculate adjusted cost
  const baseRoomCost = averageAccommodationCost * roomMultiplier;
  const withMeals = baseRoomCost * (1 + mealMultiplier);
  
  // Apply to all pax and days
  const baseCost = withMeals * tourDuration * currentPax;
  const markup = baseCost * (accommodationMarkup / 100);
  return baseCost + markup;
};

export const calculateCrewCost = (
  crew: CrewMember[],
  tourDuration: number
) => {
  return crew.reduce((total, member) => {
    const dailyCost = member.dailyRate * tourDuration;
    const accommodationCost = member.accommodationRate * tourDuration;
    const mealCost = member.mealAllowance * tourDuration;
    return total + dailyCost + accommodationCost + mealCost;
  }, 0);
};

export const calculateActivityCost = (
  averageActivityCost: number,
  includedActivities: number,
  currentPax: number,
  activitiesMarkup: number
) => {
  const baseCost = averageActivityCost * includedActivities * currentPax;
  const markup = baseCost * (activitiesMarkup / 100);
  return baseCost + markup;
};

export const calculateMealCost = (
  preparedMealsCost: number,
  includedMeals: number,
  currentPax: number,
  mealMarkup: number
) => {
  const baseCost = preparedMealsCost * includedMeals * currentPax;
  const markup = baseCost * (mealMarkup / 100);
  return baseCost + markup;
};

export const calculateParkFeesCost = (
  parkFees: number[],
  currentPax: number
) => {
  // Sum all park fees for all passengers
  const totalParkFees = parkFees.reduce((sum, fee) => sum + fee, 0);
  return totalParkFees * currentPax;
};

export const calculatePrePostTourCost = (
  prePostAccommodationCost: number,
  prePostNights: number,
  prePostMarkup: number
) => {
  const baseCost = prePostAccommodationCost * prePostNights;
  const markup = baseCost * (prePostMarkup / 100);
  return baseCost + markup;
};

export const calculateProfit = (
  calculateVehicleCostFn: () => number,
  calculateFuelCostFn: () => number,
  calculateCrewCostFn: () => number,
  calculateTotalTourCostFn: () => number,
  vehicleMarkup: number,
  accommodationMarkup: number,
  activitiesMarkup: number,
  mealMarkup: number,
  averageAccommodationCost: number,
  tourDuration: number,
  currentPax: number,
  averageActivityCost: number,
  includedActivities: number,
  preparedMealsCost: number,
  includedMeals: number
) => {
  const baseFixedCosts = calculateVehicleCostFn() / (1 + (vehicleMarkup / 100)) + 
                       calculateFuelCostFn() + 
                       calculateCrewCostFn();
  
  const baseAccommodationCost = (averageAccommodationCost * tourDuration * currentPax) / (1 + (accommodationMarkup / 100));
  const baseActivityCost = (averageActivityCost * includedActivities * currentPax) / (1 + (activitiesMarkup / 100));
  const baseMealCost = (preparedMealsCost * includedMeals * currentPax) / (1 + (mealMarkup / 100));
  
  const totalBaseCost = baseFixedCosts + baseAccommodationCost + baseActivityCost + baseMealCost;
  const profit = calculateTotalTourCostFn() - totalBaseCost;
  
  return profit;
};
