import { useMemo } from 'react';
import { 
  ExpenseCategory, 
  DayCostBreakdown, 
  ProfitReviewSummary,
  ItineraryItem,
  CostItem
} from '@/types';

// Helper interfaces for calculation context
interface CalculationOptions {
  minProfitPerDay?: number;
  fuelInTotal?: number;
  fuelOutTotal?: number;
  currencyRate?: number;
  pax: number;
}

// Helper function to calculate truck fixed costs
const calculateTruckFixed = (itinerary: ItineraryItem[]): number => {
  // Base cost per day
  const baseCostPerDay = 250;
  // Additional cost for off-road days
  const offRoadMultiplier = 1.3;
  
  return itinerary.reduce((total, day) => {
    const isOffRoad = day.activities.some(activity => 
      activity.toLowerCase().includes('off-road') || 
      activity.toLowerCase().includes('4x4')
    );
    return total + (isOffRoad ? baseCostPerDay * offRoadMultiplier : baseCostPerDay);
  }, 0);
};

// Helper function to calculate other transport costs
const calculateOtherTransport = (itinerary: ItineraryItem[]): number => {
  // Base transport cost per day
  const baseCost = 100;
  // Additional costs for specific activities
  const activityCosts: Record<string, number> = {
    'flight': 500,
    'boat': 200,
    'train': 150,
  };
  
  return itinerary.reduce((total, day) => {
    let dayCost = baseCost;
    // Add costs for specific transport activities
    Object.entries(activityCosts).forEach(([activity, cost]) => {
      if (day.activities.some(a => a.toLowerCase().includes(activity))) {
        dayCost += cost;
      }
    });
    return total + dayCost;
  }, 0);
};

// Helper function to calculate accommodation costs
const calculateAccommodation = (itinerary: ItineraryItem[], pax: number): number => {
  // Base accommodation cost per person per night
  const baseCostPerPerson = 50;
  // Premium accommodation multiplier
  const premiumMultiplier = 2.5;
  
  return itinerary.reduce((total, day) => {
    const isPremium = day.accommodation?.toLowerCase().includes('luxury') || 
                     day.accommodation?.toLowerCase().includes('premium');
    const baseCost = isPremium ? 
      baseCostPerPerson * premiumMultiplier : 
      baseCostPerPerson;
    return total + (baseCost * pax);
  }, 0);
};

// Helper function to calculate food costs
const calculateFood = (itinerary: ItineraryItem[], pax: number): number => {
  // Base food cost per person per day
  const baseCostPerPerson = 40;
  
  return itinerary.reduce((total, day) => {
    let dayCost = baseCostPerPerson;
    // Adjust for included meals
    if (day.meals.breakfast) dayCost += 5;
    if (day.meals.lunch) dayCost += 10;
    if (day.meals.dinner) dayCost += 15;
    
    return total + (dayCost * pax);
  }, 0);
};

// Helper function to calculate service costs
const calculateServices = (itinerary: ItineraryItem[]): number => {
  // Base service cost per day
  const baseCost = 100;
  // Additional costs for specific services
  const serviceCosts: Record<string, number> = {
    'guide': 200,
    'safari': 150,
    'tour': 100,
  };
  
  return itinerary.reduce((total, day) => {
    let dayCost = baseCost;
    // Add costs for specific services
    Object.entries(serviceCosts).forEach(([service, cost]) => {
      if (day.activities.some(a => a.toLowerCase().includes(service))) {
        dayCost += cost;
      }
    });
    return total + dayCost;
  }, 0);
};

// Helper function to calculate crew costs
const calculateCrewCosts = (itinerary: ItineraryItem[]): number => {
  // Base crew cost per day
  const baseCrewCost = 300;
  // Additional guide cost for specific activities
  const guideRequired = itinerary.some(day => 
    day.activities.some(activity => 
      ['safari', 'hiking', 'trekking'].some(keyword => 
        activity.toLowerCase().includes(keyword)
      )
    )
  );
  
  const guideCost = guideRequired ? 200 * itinerary.length : 0;
  return (baseCrewCost * itinerary.length) + guideCost;
};

// Helper function to calculate park fees
const calculateParkFees = (itinerary: ItineraryItem[], pax: number): number => {
  // Park fee per person per day
  const parkFeePerPerson = 70;
  // Check if any days include park visits
  const parkDays = itinerary.filter(day => 
    day.activities.some(activity => 
      activity.toLowerCase().includes('park') || 
      activity.toLowerCase().includes('reserve')
    )
  ).length;
  
  return parkDays > 0 ? parkFeePerPerson * pax * parkDays : 0;
};

// Helper function to calculate inflation adjustment
const calculateInflation = (itinerary: ItineraryItem[]): number => {
  // Base inflation rate (3% per year)
  const annualInflationRate = 0.03;
  // Base cost to apply inflation to
  const baseCost = 1000;
  // Number of years to project
  const years = 1;
  
  return baseCost * Math.pow(1 + annualInflationRate, years) - baseCost;
};

// Helper function to calculate total revenue
const calculateTotalRevenue = (
  itinerary: ItineraryItem[], 
  pax: number, 
  currencyRate: number,
  baseRate: number
): number => {
  const baseRevenue = baseRate * pax * itinerary.length;
  // Apply currency conversion
  return baseRevenue * currencyRate;
};

// Helper function to calculate daily revenue
const calculateDailyRevenue = (
  day: ItineraryItem, 
  pax: number, 
  baseRate: number
): number => {
  let dailyRate = baseRate;
  // Adjust rate for premium activities
  if (day.activities.some(a => a.toLowerCase().includes('private'))) {
    dailyRate *= 1.5;
  }
  return dailyRate * pax;
};

// Helper function to calculate daily expense
const calculateDailyExpense = (day: ItineraryItem, pax: number): number => {
  // Base daily expense
  let dailyExpense = 100;
  
  // Accommodation (simplified)
  const isPremium = day.accommodation?.toLowerCase().includes('luxury') || 
                   day.accommodation?.toLowerCase().includes('premium');
  dailyExpense += isPremium ? 150 : 50;
  
  // Meals
  if (day.meals.breakfast) dailyExpense += 10;
  if (day.meals.lunch) dailyExpense += 15;
  if (day.meals.dinner) dailyExpense += 20;
  
  // Activities
  if (day.activities.some(a => a.toLowerCase().includes('safari'))) {
    dailyExpense += 100;
  }
  if (day.activities.some(a => a.toLowerCase().includes('guide'))) {
    dailyExpense += 50;
  }
  
  return dailyExpense * pax;
};

export const useTourCalculator = (
  itinerary: ItineraryItem[],
  pax: number,
  baseRate: number,
  options: CalculationOptions = { pax: 1 }
): { profitReview: ProfitReviewSummary } => {
  const {
    minProfitPerDay = 1200,
    fuelInTotal,
    fuelOutTotal,
    currencyRate = 1,
  } = options;

  return useMemo(() => {
    // --- 1. Calculate raw costs per category ---
    const truckFixed = calculateTruckFixed(itinerary);
    const otherTransport = calculateOtherTransport(itinerary);
    const accommodation = calculateAccommodation(itinerary, pax);
    const food = calculateFood(itinerary, pax);
    const services = calculateServices(itinerary);
    const crew = calculateCrewCosts(itinerary);
    const parkFees = calculateParkFees(itinerary, pax);
    const inflation = calculateInflation(itinerary);
    
    // Apply currency conversion
    const categories: ExpenseCategory[] = [
      { name: 'Truck Fixed', total: truckFixed * currencyRate },
      { name: 'Other Transport', total: otherTransport * currencyRate },
      { name: 'Accommodation', total: accommodation * currencyRate },
      { name: 'Food', total: food * currencyRate },
      { name: 'Services', total: services * currencyRate },
      { name: 'Crew Salaries', total: crew * currencyRate },
      { name: 'Park Fees', total: parkFees * currencyRate },
      { name: 'Inflation', total: inflation * currencyRate },
    ];

    // --- 2. Calculate grand totals ---
    const totalExpense = categories.reduce((sum, c) => sum + c.total, 0);
    const totalRevenue = calculateTotalRevenue(itinerary, pax, currencyRate, baseRate);
    const totalProfit = totalRevenue - totalExpense;

    // --- 3. Build per-day breakdown ---
    const perDay: DayCostBreakdown[] = itinerary.map((dayItem) => {
      const dayRevenue = calculateDailyRevenue(dayItem, pax, baseRate) * currencyRate;
      const dayExpense = calculateDailyExpense(dayItem, pax) * currencyRate;
      return {
        date: dayItem.date,
        revenue: dayRevenue,
        expense: dayExpense,
        profit: dayRevenue - dayExpense,
      };
    });

    // --- 4. Additional checks ---
    const days = itinerary.length;
    const dailyFuelIn = fuelInTotal != null ? fuelInTotal / days : undefined;
    const dailyFuelOut = fuelOutTotal != null ? fuelOutTotal / days : undefined;

    return {
      profitReview: {
        categories,
        totalExpense,
        totalRevenue,
        totalProfit,
        perDay,
        minProfitPerDay,
        dailyFuelIn,
        dailyFuelOut,
      },
    };
  }, [itinerary, pax, baseRate, minProfitPerDay, fuelInTotal, fuelOutTotal, currencyRate]);
};

export default useTourCalculator;
