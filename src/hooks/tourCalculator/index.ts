
import { useTourCalculatorState } from './useTourCalculatorState';
import * as calculations from './calculationFunctions';
import { vehicleTypes, crewRoles, roomTypes, mealBasisOptions } from './tourCalculatorData';
export { vehicleTypes, crewRoles, roomTypes, mealBasisOptions } from './tourCalculatorData';
export type { CrewMember, CrewMealRates, VehicleType, CrewRole, RoomType, MealBasisOption } from './types';

export function useTourCalculator() {
  const state = useTourCalculatorState();

  const getVehicleById = (id: string) => {
    return calculations.getVehicleById(
      id,
      state.customVehicleName,
      state.customDailyRate,
      state.customFuelConsumption,
      state.vehicleNotes
    );
  };

  const calculateVehicleCost = () => {
    return calculations.calculateVehicleCost(
      state.selectedVehicle,
      state.tourDuration,
      state.vehicleMarkup,
      state.customVehicleName,
      state.customDailyRate,
      state.customFuelConsumption,
      state.vehicleNotes
    );
  };

  const calculateFuelCost = () => {
    return calculations.calculateFuelCost(
      state.selectedVehicle,
      state.totalDistance,
      state.fuelPrice,
      state.customVehicleName,
      state.customDailyRate,
      state.customFuelConsumption,
      state.vehicleNotes
    );
  };

  const calculateAccommodationCost = () => {
    return calculations.calculateAccommodationCost(
      state.averageAccommodationCost,
      state.selectedRoomType,
      state.selectedMealBasis,
      state.accommodationMarkup,
      state.tourDuration,
      state.currentPax
    );
  };

  const calculateCrewCost = () => {
    return calculations.calculateCrewCost(state.crew, state.tourDuration);
  };

  const calculateActivityCost = () => {
    return calculations.calculateActivityCost(
      state.averageActivityCost,
      state.includedActivities,
      state.currentPax,
      state.activitiesMarkup
    );
  };

  const calculateMealCost = () => {
    return calculations.calculateMealCost(
      state.preparedMealsCost,
      state.includedMeals,
      state.currentPax,
      state.mealMarkup
    );
  };

  const calculateParkFeesCost = () => {
    return calculations.calculateParkFeesCost(state.parkFees, state.currentPax);
  };

  const calculatePrePostTourCost = () => {
    return calculations.calculatePrePostTourCost(
      state.prePostAccommodationCost,
      state.prePostNights,
      state.prePostMarkup
    );
  };

  // Calculate fixed costs that are divided among all passengers
  const calculateFixedCosts = () => {
    return calculateVehicleCost() + calculateFuelCost() + calculateCrewCost();
  };

  // Calculate per-person costs that scale directly with passenger count
  const calculatePerPersonCosts = () => {
    return (calculateAccommodationCost() + calculateActivityCost() + calculateMealCost() + calculateParkFeesCost()) / state.currentPax;
  };

  // Calculate total tour cost for the group
  const calculateTotalTourCost = () => {
    return calculateFixedCosts() + calculateAccommodationCost() + calculateActivityCost() + calculateMealCost() + calculateParkFeesCost();
  };

  // Calculate cost per person
  const calculateCostPerPerson = () => {
    return calculateTotalTourCost() / state.currentPax;
  };

  // Calculate daily cost per person
  const calculateDailyCostPerPerson = () => {
    return calculateCostPerPerson() / state.tourDuration;
  };

  // Calculate costs by group size
  const calculateCostsByGroupSize = () => {
    const costs = [];
    for (let pax = state.minPax; pax <= state.maxPax; pax++) {
      const fixedCostsPerPerson = calculateFixedCosts() / pax;
      const variableCosts = (calculateAccommodationCost() / state.currentPax) + 
                          (calculateActivityCost() / state.currentPax) + 
                          (calculateMealCost() / state.currentPax);
      
      costs.push({
        pax,
        totalCost: fixedCostsPerPerson + variableCosts,
        dailyCost: (fixedCostsPerPerson + variableCosts) / state.tourDuration
      });
    }
    return costs;
  };

  // Calculate profit
  const calculateProfit = () => {
    return calculations.calculateProfit(
      calculateVehicleCost,
      calculateFuelCost,
      calculateCrewCost,
      calculateTotalTourCost,
      state.vehicleMarkup,
      state.accommodationMarkup,
      state.activitiesMarkup,
      state.mealMarkup,
      state.averageAccommodationCost,
      state.tourDuration,
      state.currentPax,
      state.averageActivityCost,
      state.includedActivities,
      state.preparedMealsCost,
      state.includedMeals
    );
  };

  return {
    // Re-export all state
    ...state,
    
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
