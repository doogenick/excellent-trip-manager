export interface ActivityAnalytics {
  totalActivities: number;
  totalActivityRevenue: number;
  averageActivityCost: number;
  activitiesByCategory: {
    [category: string]: {
      count: number;
      revenue: number;
      averageCost: number;
    }
  };
  activityPopularity: {
    activityId: string;
    activityName: string;
    bookings: number;
    revenue: number;
    averageCost: number;
    utilizationRate: number;
  }[];
  activityRevenueByMonth: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  activityCapacityUtilization: {
    activityId: string;
    activityName: string;
    totalCapacity: number;
    usedCapacity: number;
    utilizationRate: number;
  }[];
}

import { BookingStatus } from './booking';

export interface BookingAnalytics {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookingsByStatus: {
    [key in BookingStatus]: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  occupancyRates: {
    roomType: string;
    occupancyRate: number;
    totalNights: number;
  }[];
  activityAnalytics: ActivityAnalytics;
}

export interface PerformanceMetrics {
  revenueGrowth: {
    period: string;
    percentage: number;
    current: number;
    previous: number;
  };
  bookingConversionRate: {
    totalInquiries: number;
    totalBookings: number;
    conversionRate: number;
  };
  averageBookingLeadTime: {
    days: number;
    bookings: number;
  };
  cancellationRate: {
    totalBookings: number;
    cancelledBookings: number;
    rate: number;
  };
}

export interface TrendAnalysis {
  revenueTrends: {
    period: string;
    revenue: number;
    growth: number;
  }[];
  seasonalPatterns: {
    month: string;
    bookings: number;
    revenue: number;
    occupancy: number;
  }[];
  customerDemographics: {
    nationality: string;
    bookings: number;
    revenue: number;
  }[];
  bookingSources: {
    source: string;
    medium: string;
    campaign: string;
    bookings: number;
    revenue: number;
    conversionRate: number;
  }[];
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  status?: BookingStatus[];
  roomType?: string[];
  nationality?: string[];
  activity?: string[];
}
