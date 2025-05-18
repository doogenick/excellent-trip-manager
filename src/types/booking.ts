export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED'
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  dietaryRequirements?: string[];
  specialRequests?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  capacity: number;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  availability: {
    startDate: Date;
    endDate: Date;
    daysOfWeek: number[]; // 0-6 for Sunday-Saturday
  };
}

export interface ActivityBooking {
  activityId: string;
  activityName: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  currency: string;
  bookingDate: Date;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  notes?: string;
}

export interface AccommodationPreferences {
  roomType: string;
  mealBasis: string;
  specialRequests?: string;
}

export interface BookingSource {
  source: string;
  medium: string;
  campaign: string;
  utmParameters: Record<string, string>;
}

export interface Booking {
  id: string;
  bookingDate: Date;
  tourStartDate: Date;
  tourEndDate: Date;
  status: BookingStatus;
  passengers: Passenger[];
  totalCost: number;
  paidAmount: number;
  currency: string;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'REFUNDED';
  paymentMethod?: string;
  bookingReference: string;
  createdAt: Date;
  updatedAt: Date;
  cancellationPolicyAccepted: boolean;
  cancellationPolicy?: {
    before30Days: number; // % refund
    before14Days: number;
    before7Days: number;
    noShow: number;
  };
  notes?: string;
  createdBy: string;
  lastModifiedBy: string;
  activities: ActivityBooking[];
  accommodationPreferences: AccommodationPreferences;
  source: BookingSource;
}

export interface BookingRequest {
  tourId: string;
  passengers: Passenger[];
  tourStartDate: Date;
  tourEndDate: Date;
  requestedActivities: string[];
  accommodationPreferences: {
    roomType: string;
    mealBasis: string;
  };
  specialRequests?: string;
  promoCode?: string;
  currency?: string;
}
