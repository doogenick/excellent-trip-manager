
// Quote Types
export type QuoteStatus = 'draft' | 'sent' | 'confirmed' | 'rejected';

export type QuoteType = 
  | 'Truck Rental'
  | 'Transfer Request'
  | 'Private Nomad Schedule Tour'
  | 'Language Guided Tour'
  | 'Tailor-made Tour'
  | 'Bachelor/et Party'
  | 'Southern Africa Tour'
  | 'East Africa Tour'
  | 'FIT Tour';

export interface ClientAgent {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface TravelDate {
  startDate: Date;
  endDate: Date;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
}

export interface Passenger {
  id: string;
  firstName?: string;
  lastName?: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: Date;
  specialRequirements?: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  date: Date;
  description: string;
  accommodation?: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  activities: string[];
  notes?: string;
}

export interface CostItem {
  id: string;
  description: string;
  supplierRate: number;
  margin: number;
  sellingRate: number;
  quantity: number;
  total: number;
  currency: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  createdAt: Date;
  updatedAt: Date;
  status: QuoteStatus;
  type: QuoteType;
  clientAgent: ClientAgent;
  travelDates: TravelDate;
  destinations: Destination[];
  passengers: {
    adults: number;
    children: number;
  };
  passengerDetails: Passenger[];
  itinerary: ItineraryItem[];
  costItems: CostItem[];
  totalCost: number;
  currency: string;
  notes?: string;
  rejectionReason?: string;
  version: number;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  serviceType: string[];
}

export interface SupplierRate {
  id: string;
  supplierId: string;
  serviceName: string;
  serviceType: string;
  rate: number;
  currency: string;
  validFrom: Date;
  validTo: Date;
  seasonType?: 'high' | 'low' | 'standard';
  conditions?: string;
}
