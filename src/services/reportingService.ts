
import { Booking, BookingStatus, Activity, ActivityBooking } from "../types/booking";
import { generateReport } from "../utils/reportGenerator";

// Mock data for demonstration purposes
const mockBookings: Booking[] = [];

// Generate some sample data for the last 12 months
const generateMockData = () => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setFullYear(now.getFullYear() - 1);
  
  const destinations = ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia", "Malawi", "Tanzania", "Kenya"];
  const tourTypes = ["standard", "luxury", "adventure", "custom", "budget"];
  
  // Generate a random date between start and end
  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  // Generate bookings data
  for (let i = 0; i < 100; i++) {
    const bookingDate = randomDate(startDate, now);
    const status = Object.values(BookingStatus)[Math.floor(Math.random() * Object.values(BookingStatus).length)];
    
    mockBookings.push({
      id: `booking-${i}`,
      clientId: `client-${Math.floor(Math.random() * 20)}`,
      quoteId: `quote-${i}`,
      status,
      bookingDate,
      totalAmount: 1000 + Math.random() * 4000,
      depositAmount: 500 + Math.random() * 1000,
      depositPaid: Math.random() > 0.3,
      depositDueDate: new Date(bookingDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      balanceDueDate: new Date(bookingDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      notes: "",
      paymentHistory: []
    });
  }
};

// Generate mock data on module load
generateMockData();

// Sales Reports
export const getSalesReportByPeriod = async (startDate: Date, endDate: Date): Promise<any> => {
  return generateReport({
    title: "Sales Report",
    description: `Sales from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    data: mockBookings.filter(booking => 
      booking.bookingDate >= startDate && 
      booking.bookingDate <= endDate
    ),
    summary: {
      totalSales: mockBookings
        .filter(booking => booking.bookingDate >= startDate && booking.bookingDate <= endDate)
        .reduce((sum, booking) => sum + booking.totalAmount, 0),
      totalBookings: mockBookings.filter(booking => 
        booking.bookingDate >= startDate && 
        booking.bookingDate <= endDate
      ).length,
    }
  });
};

export const getBookingsByStatus = async (status: BookingStatus, startDate?: Date, endDate?: Date): Promise<any> => {
  let filteredBookings = mockBookings.filter(booking => booking.status === status);
  
  if (startDate && endDate) {
    filteredBookings = filteredBookings.filter(booking => 
      booking.bookingDate >= startDate && 
      booking.bookingDate <= endDate
    );
  }
  
  return generateReport({
    title: `${status} Bookings Report`,
    description: startDate && endDate ? 
      `${status} bookings from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}` : 
      `All ${status} bookings`,
    data: filteredBookings,
    summary: {
      totalBookings: filteredBookings.length,
      totalValue: filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    }
  });
};

export const getRevenueByPeriod = async (
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly", 
  startDate: Date, 
  endDate: Date
): Promise<any> => {
  // Filter bookings within the date range
  const filteredBookings = mockBookings.filter(booking => 
    booking.bookingDate >= startDate && 
    booking.bookingDate <= endDate
  );
  
  // Group by period
  const groupedData: Record<string, number> = {};
  
  filteredBookings.forEach(booking => {
    let key: string;
    const date = new Date(booking.bookingDate);
    
    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const week = Math.floor(date.getDate() / 7) + 1;
        key = `${date.getFullYear()}-W${week}`;
        break;
      case "monthly":
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      case "quarterly":
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      case "yearly":
        key = date.getFullYear().toString();
        break;
    }
    
    if (!groupedData[key]) {
      groupedData[key] = 0;
    }
    
    groupedData[key] += booking.totalAmount;
  });
  
  // Convert to array of period and amount
  const data = Object.entries(groupedData).map(([period, amount]) => ({
    period,
    amount
  }));
  
  return generateReport({
    title: `Revenue by ${period.charAt(0).toUpperCase() + period.slice(1)} Report`,
    description: `Revenue from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} grouped by ${period}`,
    data,
    summary: {
      totalRevenue: filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
      periodCount: data.length,
      averagePerPeriod: data.length > 0 ? 
        filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0) / data.length : 0
    }
  });
};

// Cancellation Reports
export const getCancellationRate = async (startDate: Date, endDate: Date): Promise<any> => {
  const bookingsInPeriod = mockBookings.filter(booking => 
    booking.bookingDate >= startDate && 
    booking.bookingDate <= endDate
  );
  
  const cancelledBookings = bookingsInPeriod.filter(booking => 
    booking.status === BookingStatus.CANCELLED
  );
  
  const cancellationRate = bookingsInPeriod.length > 0 ? 
    (cancelledBookings.length / bookingsInPeriod.length) * 100 : 0;
  
  return generateReport({
    title: "Cancellation Rate Report",
    description: `Cancellation rate from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    data: {
      totalBookings: bookingsInPeriod.length,
      cancelledBookings: cancelledBookings.length,
      cancellationRate: cancellationRate.toFixed(2) + "%"
    },
    summary: {
      cancellationRate: cancellationRate.toFixed(2) + "%"
    }
  });
};

// Currency Conversion Report
export const getRevenueByDestination = async (
  startDate: Date, 
  endDate: Date, 
  groupBy: "country" | "region" | "tour", 
  currency: string = "USD"
): Promise<any> => {
  try {
    // In a real implementation, we would get currency rates
    // and destinations data from the database or an API
    const mockCurrencyData: Record<string, any> = {
      rates: {
        USD: 1.0,
        EUR: 0.85,
        GBP: 0.73,
        ZAR: 15.5,
        NAD: 15.5,
        BWP: 11.2
      },
      destinations: {
        "South Africa": { 
          region: "Southern Africa", 
          tours: ["Cape Town Explorer", "Garden Route", "Kruger Safari"],
          currency: "ZAR",
          conversionRate: 15.5,
          bookings: [] // Will be filled with filtered bookings
        },
        "Namibia": { 
          region: "Southern Africa", 
          tours: ["Namibia Desert Explorer", "Fish River Canyon"],
          currency: "NAD",
          conversionRate: 15.5,
          bookings: []
        },
        "Botswana": { 
          region: "Southern Africa", 
          tours: ["Okavango Delta", "Chobe Safari"],
          currency: "BWP",
          conversionRate: 11.2,
          bookings: []
        }
      }
    };
    
    // Aggregate data based on the groupBy parameter
    let groupedData: Record<string, any> = {};
    
    // In a real implementation, we would connect bookings to destinations and tours
    // For now, we'll randomly assign destinations and tours to our mock bookings
    
    const destinations = Object.keys(mockCurrencyData.destinations);
    
    // Randomly assign destinations and tours to bookings for demonstration
    const filteredBookings = mockBookings.filter(booking => 
      booking.bookingDate >= startDate && 
      booking.bookingDate <= endDate
    );
    
    filteredBookings.forEach(booking => {
      const destination = destinations[Math.floor(Math.random() * destinations.length)];
      const destinationData = mockCurrencyData.destinations[destination];
      const tour = destinationData.tours[Math.floor(Math.random() * destinationData.tours.length)];
      
      destinationData.bookings.push({
        ...booking,
        destination,
        tour
      });
    });
    
    // Group data based on groupBy parameter
    if (groupBy === "country") {
      Object.entries(mockCurrencyData.destinations).forEach(([country, data]: [string, any]) => {
        const totalAmount = data.bookings.reduce(
          (sum: number, booking: any) => sum + booking.totalAmount / data.conversionRate, 0
        );
        
        groupedData[country] = {
          totalAmount: totalAmount * mockCurrencyData.rates[currency],
          bookingCount: data.bookings.length
        };
      });
    } else if (groupBy === "region") {
      const regions: Record<string, { totalAmount: number, bookingCount: number }> = {};
      
      Object.entries(mockCurrencyData.destinations).forEach(([country, data]: [string, any]) => {
        const region = data.region;
        if (!regions[region]) {
          regions[region] = { totalAmount: 0, bookingCount: 0 };
        }
        
        regions[region].totalAmount += data.bookings.reduce(
          (sum: number, booking: any) => sum + booking.totalAmount / data.conversionRate, 0
        );
        regions[region].bookingCount += data.bookings.length;
      });
      
      // Convert to desired currency
      Object.entries(regions).forEach(([region, data]) => {
        groupedData[region] = {
          totalAmount: data.totalAmount * mockCurrencyData.rates[currency],
          bookingCount: data.bookingCount
        };
      });
    }
    
    return generateReport({
      title: `Revenue by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)} Report`,
      description: `Revenue from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} grouped by ${groupBy}`,
      data: Object.entries(groupedData).map(([key, value]: [string, any]) => ({
        name: key,
        revenue: value.totalAmount.toFixed(2),
        bookings: value.bookingCount,
        currency
      })),
      summary: {
        totalRevenue: Object.values(groupedData).reduce(
          (sum: number, value: any) => sum + value.totalAmount, 0
        ).toFixed(2) + ` ${currency}`,
        totalBookings: filteredBookings.length
      }
    });
  } catch (error) {
    console.error('Error generating revenue by destination report:', error);
    throw error;
  }
};

// Performance Reports
export const getQuoteConversionRate = async (startDate: Date, endDate: Date): Promise<any> => {
  // This is a mock implementation. In a real-world scenario,
  // you would need to relate quotes to bookings in the database.
  
  // Assume 70% of bookings came from quotes for demonstration
  const bookingsInPeriod = mockBookings.filter(booking => 
    booking.bookingDate >= startDate && 
    booking.bookingDate <= endDate
  );
  
  const quotesInPeriod = Math.floor(bookingsInPeriod.length / 0.7);
  const conversionRate = (bookingsInPeriod.length / quotesInPeriod) * 100;
  
  return generateReport({
    title: "Quote Conversion Rate Report",
    description: `Quote conversion rate from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    data: {
      totalQuotes: quotesInPeriod,
      convertedQuotes: bookingsInPeriod.length,
      conversionRate: conversionRate.toFixed(2) + "%"
    },
    summary: {
      conversionRate: conversionRate.toFixed(2) + "%"
    }
  });
};

