
import { BookingStatus } from './booking';

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  destinations?: string[];
  tourTypes?: string[];
  minValue?: number;
  maxValue?: number;
  status?: string;
}

export interface ReportOptions {
  groupBy?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  currency?: string;
}

export interface ReportData {
  title: string;
  description?: string;
  generated: Date;
  filters?: ReportFilters;
  options?: ReportOptions;
  data: any;
  summary?: Record<string, any>;
}

export interface SalesPerformance {
  period: string;
  revenue: number;
  bookings: number;
  inquiries: number;
  conversionRate: number;
}

export interface StatusDistribution {
  [key: string]: number;
  [key: BookingStatus]: number; // This will be fixed by our BookingStatus enum
}

export enum ReportType {
  SALES = 'sales',
  BOOKINGS = 'bookings',
  DESTINATIONS = 'destinations',
  REVENUE = 'revenue',
  PERFORMANCE = 'performance',
  CONVERSION = 'conversion'
}

