import { useMemo } from 'react';
import { 
  ExpenseCategory, 
  DayCostBreakdown, 
  ProfitReviewSummary 
} from '@/types';

interface UseProfitReviewProps {
  startDate: Date;
  endDate: Date;
  baseRate: number;
  passengerCount: number;
  // Add other props as needed for your specific calculation
}

export const useProfitReview = ({
  startDate,
  endDate,
  baseRate,
  passengerCount,
}: UseProfitReviewProps) => {
  // Calculate all dates in the trip range
  const tripDates = useMemo(() => {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }, [startDate, endDate]);

  // Calculate expense categories
  const expenseCategories = useMemo<ExpenseCategory[]>(() => {
    // These are example categories - adjust based on your actual expense structure
    return [
      { name: 'Truck Fixed', total: 5000 },
      { name: 'Truck Variable', total: 3000 },
      { name: 'Accommodation', total: 7000 },
      { name: 'Food', total: 4500 },
      { name: 'Park Fees', total: 2500 },
      { name: 'Crew', total: 6000 },
      { name: 'Fuel', total: 3500 },
      { name: 'Other Services', total: 2000 },
    ];
  }, [passengerCount, tripDates.length]);

  // Calculate daily breakdown
  const dailyBreakdown = useMemo<DayCostBreakdown[]>(() => {
    return tripDates.map((date, index) => {
      // Example calculation - replace with your actual logic
      const baseDailyExpense = 1500;
      const dailyExpense = baseDailyExpense * (1 + (index * 0.02)); // Slight increase each day
      const dailyRevenue = baseRate * passengerCount;
      
      return {
        date,
        revenue: dailyRevenue,
        expense: dailyExpense,
        profit: dailyRevenue - dailyExpense,
      };
    });
  }, [tripDates, baseRate, passengerCount]);

  // Calculate totals
  const totals = useMemo(() => {
    return dailyBreakdown.reduce(
      (acc, day) => ({
        revenue: acc.revenue + day.revenue,
        expense: acc.expense + day.expense,
        profit: acc.profit + day.profit,
      }),
      { revenue: 0, expense: 0, profit: 0 }
    );
  }, [dailyBreakdown]);

  // Calculate min profit per day
  const minProfitPerDay = useMemo(() => {
    return Math.min(...dailyBreakdown.map(day => day.profit));
  }, [dailyBreakdown]);

  // Compile the final profit review summary
  const profitReview = useMemo<ProfitReviewSummary>(() => ({
    categories: expenseCategories,
    totalRevenue: totals.revenue,
    totalExpense: totals.expense,
    totalProfit: totals.profit,
    perDay: dailyBreakdown,
    minProfitPerDay,
    dailyFuelIn: 15956, // Example values
    dailyFuelOut: 9372, // Example values
  }), [expenseCategories, totals, dailyBreakdown, minProfitPerDay]);

  return {
    profitReview,
    isLoading: false, // Add loading state if needed
    error: null, // Add error handling if needed
  };
};

export default useProfitReview;
