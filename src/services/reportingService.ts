import { Booking, BookingStatus, Activity, ActivityBooking } from '../types/booking';
import { BookingAnalytics, PerformanceMetrics, TrendAnalysis, AnalyticsFilters, ActivityAnalytics } from '../types/reporting';
import { BookingService } from './bookingService';

export class ReportingService {
  private static instance: ReportingService;
  private bookingService: BookingService;

  private constructor() {
    this.bookingService = BookingService.getInstance();
  }

  public static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  // Helper function to filter bookings by date range
  private filterBookingsByDate(
    bookings: Booking[],
    dateRange: { start: Date; end: Date }
  ): Booking[] {
    return bookings.filter(booking => 
      booking.tourStartDate >= dateRange.start && 
      booking.tourStartDate <= dateRange.end
    );
  }

  // Helper function to calculate occupancy rates
  private calculateOccupancyRates(bookings: Booking[]): any[] {
    const roomTypes = new Set(bookings.map(b => b.accommodationPreferences?.roomType).filter(Boolean));
    return Array.from(roomTypes).map(roomType => {
      const bookingsForType = bookings.filter(b => b.accommodationPreferences?.roomType === roomType);
      const totalNights = bookingsForType.reduce((sum, booking) => 
        sum + (booking.tourEndDate.getTime() - booking.tourStartDate.getTime()) / 
        (1000 * 60 * 60 * 24), 0);
      
      const totalPassengers = bookingsForType.reduce((sum, booking) => 
        sum + booking.passengers.length, 0);
      
      return {
        roomType,
        occupancyRate: totalPassengers / totalNights,
        totalNights
      };
    });
  }

  // Helper function to calculate revenue trends
  private calculateRevenueTrends(bookings: Booking[]): any[] {
    const monthlyRevenue: Record<string, { revenue: number; bookings: number }> = {};
    
    bookings.forEach(booking => {
      const month = booking.tourStartDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = { revenue: 0, bookings: 0 };
      }
      monthlyRevenue[month].revenue += booking.totalCost;
      monthlyRevenue[month].bookings++;
    });

    return Object.entries(monthlyRevenue).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      bookings: data.bookings
    }));
  }

  // Helper function to calculate activity analytics
  private calculateActivityAnalytics(bookings: Booking[]): ActivityAnalytics {
    const activities = bookings.flatMap(booking => booking.activities);
    
    const totalActivities = activities.length;
    const totalActivityRevenue = activities.reduce((sum, activity) => sum + activity.totalCost, 0);
    
    // Calculate activities by category
    const activitiesByCategory: Record<string, any> = {};
    activities.forEach(activity => {
      const category = activity.activityName.split(' ').pop() || 'Other'; // Extract category from name
      if (!activitiesByCategory[category]) {
        activitiesByCategory[category] = {
          count: 0,
          revenue: 0,
          averageCost: 0
        };
      }
      activitiesByCategory[category].count++;
      activitiesByCategory[category].revenue += activity.totalCost;
      activitiesByCategory[category].averageCost = 
        activitiesByCategory[category].revenue / activitiesByCategory[category].count;
    });

    // Calculate activity popularity
    const activityPopularity = activities.reduce((acc, activity) => {
      const existing = acc.find(a => a.activityId === activity.activityId);
      if (existing) {
        existing.bookings++;
        existing.revenue += activity.totalCost;
        existing.averageCost = existing.revenue / existing.bookings;
      } else {
        acc.push({
          activityId: activity.activityId,
          activityName: activity.activityName,
          bookings: 1,
          revenue: activity.totalCost,
          averageCost: activity.totalCost,
          utilizationRate: 0 // Will be calculated later
        });
      }
      return acc;
    }, [] as any[]);

    // Calculate utilization rates
    activityPopularity.forEach(activity => {
      const utilizationRate = activity.bookings / 
        (activity.activityName.match(/\d+/)?.[0] || 1); // Assuming capacity is in name
      activity.utilizationRate = utilizationRate * 100;
    });

    // Calculate revenue by month
    const activityRevenueByMonth = activities.reduce((acc, activity) => {
      const month = activity.bookingDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      const existing = acc.find(a => a.month === month);
      if (existing) {
        existing.revenue += activity.totalCost;
        existing.bookings++;
      } else {
        acc.push({
          month,
          revenue: activity.totalCost,
          bookings: 1
        });
      }
      return acc;
    }, [] as any[]);

    // Calculate capacity utilization
    const activityCapacityUtilization = activityPopularity.map(activity => ({
      activityId: activity.activityId,
      activityName: activity.activityName,
      totalCapacity: activity.activityName.match(/\d+/)?.[0] || 1,
      usedCapacity: activity.bookings,
      utilizationRate: activity.utilizationRate
    }));

    return {
      totalActivities,
      totalActivityRevenue,
      averageActivityCost: totalActivities > 0 ? totalActivityRevenue / totalActivities : 0,
      activitiesByCategory,
      activityPopularity,
      activityRevenueByMonth,
      activityCapacityUtilization
    };
  }

  // Get booking analytics
  public async getBookingAnalytics(filters: AnalyticsFilters): Promise<BookingAnalytics> {
    const bookings = this.filterBookingsByDate(this.bookingService.getAllBookings(), filters.dateRange);
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);
    const totalBookings = bookings.length;
    
    const bookingsByStatus = Object.values(BookingStatus).reduce((acc, status) => {
      acc[status] = bookings.filter(b => b.status === status).length;
      return acc;
    }, {} as { [key in BookingStatus]: number });

    return {
      totalBookings,
      totalRevenue,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      bookingsByStatus,
      revenueByMonth: this.calculateRevenueTrends(bookings),
      occupancyRates: this.calculateOccupancyRates(bookings),
      activityAnalytics: this.calculateActivityAnalytics(bookings)
    };
  }

  // Get performance metrics
  public async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const bookings = this.bookingService.getAllBookings();
    const currentPeriod = bookings.filter(b => b.tourStartDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const previousPeriod = bookings.filter(b => 
      b.tourStartDate >= new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) &&
      b.tourStartDate < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    return {
      revenueGrowth: {
        period: 'Monthly',
        current: currentPeriod.reduce((sum, b) => sum + b.totalCost, 0),
        previous: previousPeriod.reduce((sum, b) => sum + b.totalCost, 0),
        percentage: currentPeriod.length > 0 ? 
          ((currentPeriod.reduce((sum, b) => sum + b.totalCost, 0) / 
            previousPeriod.reduce((sum, b) => sum + b.totalCost, 0) - 1) * 100) : 0
      },
      bookingConversionRate: {
        totalInquiries: 0, // TODO: Track inquiries
        totalBookings: bookings.length,
        conversionRate: 0 // Will be calculated when inquiries are tracked
      },
      averageBookingLeadTime: {
        days: bookings.reduce((sum, b) => 
          sum + Math.floor((b.tourStartDate.getTime() - b.bookingDate.getTime()) / 
            (1000 * 60 * 60 * 24)), 0) / bookings.length,
        bookings: bookings.length
      },
      cancellationRate: {
        totalBookings: bookings.length,
        cancelledBookings: bookings.filter(b => b.status === BookingStatus.CANCELLED).length,
        rate: bookings.length > 0 ? 
          (bookings.filter(b => b.status === BookingStatus.CANCELLED).length / bookings.length) * 100 : 0
      }
    };
  }

  // Helper function to calculate booking sources
  private calculateBookingSources(bookings: Booking[]): any[] {
    const sources = bookings.reduce((acc, booking) => {
      const sourceKey = `${booking.source.source}-${booking.source.medium}-${booking.source.campaign}`;
      if (!acc[sourceKey]) {
        acc[sourceKey] = {
          source: booking.source.source,
          medium: booking.source.medium,
          campaign: booking.source.campaign,
          bookings: 0,
          revenue: 0,
          conversionRate: 0
        };
      }
      acc[sourceKey].bookings++;
      acc[sourceKey].revenue += booking.totalCost;
      return acc;
    }, {} as Record<string, any>);

    // Calculate conversion rates
    const totalBookings = bookings.length;
    Object.values(sources).forEach(source => {
      source.conversionRate = totalBookings > 0 ? 
        (source.bookings / totalBookings) * 100 : 0;
    });

    return Object.values(sources);
  }

  // Get trend analysis
  public async getTrendAnalysis(filters: AnalyticsFilters): Promise<TrendAnalysis> {
    const bookings = this.filterBookingsByDate(this.bookingService.getAllBookings(), filters.dateRange);

    const monthlyData = this.calculateRevenueTrends(bookings);

    const seasonalPatterns: any[] = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(filters.dateRange.start);
      date.setMonth(month);
      
      const monthBookings = bookings.filter(b => 
        b.tourStartDate.getMonth() === month && 
        b.tourStartDate.getFullYear() === date.getFullYear()
      );

      seasonalPatterns.push({
        month: date.toLocaleString('default', { month: 'long' }),
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, b) => sum + b.totalCost, 0),
        occupancy: monthBookings.reduce((sum, b) => 
          sum + (b.tourEndDate.getTime() - b.tourStartDate.getTime()) / 
          (1000 * 60 * 60 * 24), 0)
      });
    }

    return {
      revenueTrends: monthlyData.map(data => ({
        period: data.month,
        revenue: data.revenue,
        growth: data.bookings > 0 ? 
          ((data.revenue / (monthlyData[data.bookings - 1]?.revenue || 1) - 1) * 100) : 0
      })),
      seasonalPatterns,
      customerDemographics: [], // TODO: Track customer demographics
      bookingSources: this.calculateBookingSources(bookings)
    };
  }
}
