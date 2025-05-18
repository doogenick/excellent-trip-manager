
import { useTourCalculatorState } from './useTourCalculatorState';
import * as calculations from './calculationFunctions';
import { vehicleTypes, crewRoles, roomTypes, mealBasisOptions } from './tourCalculatorData';
import { getSeasonalMultiplier, getCombinedSeasonalMultiplier } from '../../utils/seasonalPricing';
import { mockCurrencyRates } from '../../data/mockCurrencyRates';
import { optionalItems } from '../../data/optionalItems';
import { promoCodeConfig } from '../../data/promoCodes';
import { useState } from 'react';
export { vehicleTypes, crewRoles, roomTypes, mealBasisOptions } from './tourCalculatorData';
export type { CrewMember, CrewMealRates, VehicleType, CrewRole, RoomType, MealBasisOption } from './types';

export function useTourCalculator() {
  const state = useTourCalculatorState();

  // Add promo code to state with validation
  const [promoCode, setPromoCode] = useState<string>('');

  // Update the state type to include promo code
  type TourCalculatorState = typeof state & {
    promoCode: string;
    updatePromoCode: (code: string) => void;
  };

  const validatePromoCode = (code: string) => {
    if (!code) return false;
    
    // Basic validation
    if (code.length < 3 || code.length > 20) {
      throw new Error('Promo code must be between 3 and 20 characters');
    }
    
    // Check if promo code exists
    if (!promoCodeConfig[code]) {
      throw new Error('Invalid promo code');
    }
    
    return true;
  };

  // Update promo code with validation
  const updatePromoCode = (newCode: string) => {
    try {
      validatePromoCode(newCode);
      setPromoCode(newCode);
    } catch (error) {
      console.error('Invalid promo code:', error);
      setPromoCode('');
    }
  };

  // Helper function to calculate optional item costs
  const calculateOptionalItemsCost = (
    selectedOptionalItems: Array<{ id: string; quantity: number }>,
    currentPax: number,
    seasonalAdjustments?: any[]
  ) => {
    return selectedOptionalItems.reduce((total, item) => {
      const optionalItem = optionalItems.find(opt => opt.id === item.id);
      if (!optionalItem) return total;

      // Apply seasonal adjustments if any
      const seasonalMultiplier = getCombinedSeasonalMultiplier(
        state.travelStartDate,
        seasonalAdjustments || optionalItem.seasonalAdjustments || []
      );

      // Calculate cost for this item
      const itemCost = optionalItem.cost * seasonalMultiplier;
      const totalItemCost = itemCost * item.quantity * currentPax;

      return total + totalItemCost;
    }, 0);
  };

  // Helper function to apply promotional discounts
  const applyPromotionalDiscounts = (
    baseCost: number,
    bookingDetails: {
      bookingDate: Date;
      tourStartDate: Date;
      promoCode?: string;
    },
    promoCodeConfig: Record<string, any>
  ): number => {
    let cost = baseCost;
    let discounts = [];
    const now = new Date();

    // Validate dates
    if (!bookingDetails.bookingDate || !bookingDetails.tourStartDate) {
      throw new Error('Booking and tour start dates are required');
    }

    // Calculate early booking discount with timezone handling
    const daysUntilTour = Math.floor(
      (bookingDetails.tourStartDate.getTime() - bookingDetails.bookingDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (daysUntilTour >= 90) {
      const earlyBookingDiscount = Math.min(cost * 0.03, 100); // Cap early booking discount at $100
      cost -= earlyBookingDiscount;
      discounts.push({ type: 'earlyBooking', amount: earlyBookingDiscount });
    }

    // Apply promo code discount if provided
    if (bookingDetails.promoCode && promoCodeConfig[bookingDetails.promoCode]) {
      const promo = promoCodeConfig[bookingDetails.promoCode];
      
      // Validate promo code format
      if (typeof bookingDetails.promoCode !== 'string' || bookingDetails.promoCode.length < 3) {
        throw new Error('Invalid promo code format');
      }

      // Validate promo dates
      if (promo.startDate && promo.endDate) {
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error('Invalid promo code date format');
        }
      }

      // Check promo validity
      const isValidPromo = (
        (!promo.startDate || new Date(promo.startDate) <= now) &&
        (!promo.endDate || new Date(promo.endDate) >= now) &&
        (!promo.minimumSpend || cost >= promo.minimumSpend)
      );

      if (isValidPromo) {
        if (promo.type === 'percentage') {
          const maxDiscount = 500; // Maximum $500 discount
          const promoDiscount = Math.min(cost * (promo.value / 100), maxDiscount);
          cost -= promoDiscount;
          discounts.push({ type: 'promoCode', amount: promoDiscount, code: bookingDetails.promoCode });
        } else if (promo.type === 'fixedAmount') {
          const maxFixedDiscount = 300; // Maximum $300 fixed discount
          const fixedDiscount = Math.min(promo.value, maxFixedDiscount);
          cost = Math.max(0, cost - fixedDiscount);
          discounts.push({ type: 'promoCode', amount: fixedDiscount, code: bookingDetails.promoCode });
        }
      }
    }

    return cost;
  };

  // Helper function for currency conversion
  const convertCurrency = (
    amount: number,
    targetCurrency?: string,
    exchangeRates?: Record<string, number>
  ): number => {
    if (!targetCurrency || !exchangeRates || !exchangeRates[targetCurrency]) {
      return amount;
    }
    return amount * exchangeRates[targetCurrency];
  };

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
    const roomType = roomTypes.find(rt => rt.id === state.selectedRoomType);
    const mealBasis = mealBasisOptions.find(mb => mb.id === state.selectedMealBasis);
    
    const seasonalMultiplier = getCombinedSeasonalMultiplier(state.travelStartDate, [
      ...(roomType?.seasonalAdjustments || []),
      ...(mealBasis?.seasonalAdjustments || [])
    ]);

    return calculations.calculateAccommodationCost(
      state.averageAccommodationCost * seasonalMultiplier,
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
    const seasonalMultiplier = getCombinedSeasonalMultiplier(
      state.travelStartDate,
      state.activitiesSeasonalAdjustments || []
    );

    return calculations.calculateActivityCost(
      state.averageActivityCost * seasonalMultiplier,
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
  const calculateTotalTourCost = (
    selectedOptionalItems: Array<{ id: string; quantity: number }> = [],
    targetCurrency?: string,
    exchangeRates?: Record<string, number>
  ) => {
    const baseTotal = calculateFixedCosts() + calculateAccommodationCost() + calculateMealCost() + calculateParkFeesCost();
    
    // Add optional items cost
    const optionalItemsCost = calculateOptionalItemsCost(
      selectedOptionalItems,
      state.currentPax,
      state.activitiesSeasonalAdjustments
    );
    
    // Apply tiered group discounts
    let discount = 0;
    if (state.currentPax >= 6 && state.currentPax <= 9) {
      discount = 5; // 5% discount for groups of 6-9
    } else if (state.currentPax >= 10) {
      discount = 10; // 10% discount for groups of 10+
    }

    const discountAmount = baseTotal * (discount / 100);
    const totalWithDiscount = baseTotal - discountAmount;
    
    // Apply promotional discounts
    const bookingDetails = {
      bookingDate: new Date(), // Default to current date if not provided
      tourStartDate: state.travelStartDate,
      promoCode: state.promoCode
    };
    const costWithPromotions = applyPromotionalDiscounts(totalWithDiscount, bookingDetails, promoCodeConfig);

    // Convert to target currency if specified
    return convertCurrency(costWithPromotions, targetCurrency, exchangeRates || mockCurrencyRates.rates);
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
  const calculateCostsByGroupSize = (selectedOptionalItems: Array<{ id: string; quantity: number }> = []) => {
    const costs = [];
    for (let pax = state.minPax; pax <= state.maxPax; pax++) {
      const fixedCostsPerPerson = calculateFixedCosts() / pax;
      const variableCosts = (calculateAccommodationCost() / state.currentPax) + 
                          (calculateMealCost() / state.currentPax);
      
      // Calculate optional items cost for this group size
      const optionalItemsCost = calculateOptionalItemsCost(
        selectedOptionalItems,
        pax,
        state.activitiesSeasonalAdjustments
      );
      
      costs.push({
        pax,
        totalCost: fixedCostsPerPerson + variableCosts + optionalItemsCost,
        dailyCost: (fixedCostsPerPerson + variableCosts + optionalItemsCost) / state.tourDuration
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
    promoCode,
    updatePromoCode,
    
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
