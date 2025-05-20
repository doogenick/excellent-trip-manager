
// Type definitions for Booking-related components

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
  dateOfBirth?: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface AccommodationPreference {
  roomType: string;
  mealBasis: string;
}

export interface BookingFormData {
  passengers: Passenger[];
  leadPassenger: Passenger;
  emergencyContact: EmergencyContact;
  accommodation: AccommodationPreference;
  specialRequirements?: string;
  paymentMethod?: string;
  termsAccepted: boolean;
}

export interface BookingStatus {
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'completed';
  statusDate: Date;
  statusNote?: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  date: Date;
  reference?: string;
}

export interface BookingSummary {
  id: string;
  quoteId: string;
  reference: string;
  status: BookingStatus;
  bookingDate: Date;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  travelInfo: {
    startDate: Date;
    endDate: Date;
    totalPassengers: number;
    destinations: string[];
  };
  financials: {
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    currency: string;
    paymentStatus: 'not_paid' | 'deposit_paid' | 'fully_paid' | 'refunded';
  };
}

export const defaultEmptyPassenger: Passenger = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
};

export const createEmptyPassenger = (): Passenger => ({
  id: `passenger-${Date.now()}`,
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
});

export const defaultAccommodationPreference: AccommodationPreference = {
  roomType: "double",
  mealBasis: "half-board"
};
