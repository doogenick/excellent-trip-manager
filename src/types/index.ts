export interface ExpenseCategory {
  name: string;
  total: number;
}

export interface DayCostBreakdown {
  date: Date | string;
  revenue: number;
  expense: number;
  profit: number;
}

export interface ProfitReviewSummary {
  categories: ExpenseCategory[];
  totalExpense: number;
  totalRevenue: number;
  totalProfit: number;
  perDay: DayCostBreakdown[];
  minProfitPerDay: number;
  dailyFuelIn?: number;
  dailyFuelOut?: number;
}

export interface CostItem {
  name: string;
  cost: number;
}

export type ServiceLevel = "standard" | "luxury" | "adventure" | "custom" | "budget";

export interface SupplierRate {
  id: string;
  supplierId: string;
  serviceId: string;
  cost: number;
  currency: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  seasonType: string; // Added seasonType field
}
