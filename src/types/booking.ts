
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface Booking {
  id: string;
  clientId: string;
  quoteId: string;
  status: BookingStatus;
  bookingDate: Date;
  totalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  depositDueDate?: Date;
  balanceDueDate?: Date;
  notes: string;
  paymentHistory: Array<{
    id: string;
    date: Date;
    amount: number;
    method: string;
    reference: string;
  }>;
}

export interface BookingRequest {
  clientId: string;
  quoteId: string;
  bookingDate: Date;
  depositAmount: number;
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  maximumCapacity: number;
  availabilityCalendar: Record<string, number>;
  isActive: boolean;
}

export interface ActivityBooking {
  id: string;
  activityId: string;
  bookingId: string;
  date: Date;
  participants: number;
  status: BookingStatus;
  specialRequests: string;
}

// Helper function to check if a value is a valid BookingStatus
export function isValidBookingStatus(status: any): status is BookingStatus {
  return Object.values(BookingStatus).includes(status as BookingStatus);
}

// Helper functions to use in services
export const BookingStatusUtils = {
  isPending: (status: BookingStatus) => status === BookingStatus.PENDING,
  isConfirmed: (status: BookingStatus) => status === BookingStatus.CONFIRMED,
  isCompleted: (status: BookingStatus) => status === BookingStatus.COMPLETED,
  isCancelled: (status: BookingStatus) => status === BookingStatus.CANCELLED,
  isRefunded: (status: BookingStatus) => status === BookingStatus.REFUNDED,
  values: () => Object.values(BookingStatus)
};

