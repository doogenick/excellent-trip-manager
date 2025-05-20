
import { QuoteType } from ".";

// Client-related types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}

// Itinerary-related types
export interface ItineraryItem {
  id: string;
  day: number;
  date: Date | string;
  startLocation: string;
  endLocation: string;
  activity: string;
  accommodation: string;
  accommodationType: string;
  distance?: string;
  duration?: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
}

// Inclusion and exclusion items
export interface InclusionItem {
  id: string;
  text: string;
}

// Pricing-related types
export interface PriceTier {
  id: string;
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  singleSupplement: number;
}

export interface CostItem {
  id: string;
  category: string;
  description: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
  markup: number;
  sellingPrice: number;
  notes?: string;
}

// Quote-related types
export interface QuoteContact {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface QuoteDocument {
  id: string;
  type: 'pdf' | 'word' | 'excel' | 'other';
  name: string;
  url: string;
  createdAt: Date;
  createdBy: string;
}

export interface QuoteApproval {
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
}

export interface EnhancedQuote {
  id: string;
  quoteNumber: string;
  status: 'draft' | 'sent' | 'confirmed' | 'rejected' | 'expired';
  type: QuoteType;
  client: Client;
  contact: QuoteContact;
  issueDate: Date;
  expiry?: Date;
  validityPeriod?: string; // e.g., "Valid for travel in 2023"
  
  // Trip details
  title?: string;
  destinations: string[];
  startDate?: Date;
  endDate?: Date;
  
  // Passenger information
  adults: number;
  children: number;
  passengerNotes?: string;
  
  // Itinerary
  itinerary: ItineraryItem[];
  
  // Inclusions & Exclusions
  inclusions: InclusionItem[];
  exclusions: InclusionItem[];
  
  // Pricing
  currency: string;
  baseCostPerPerson: number;
  baseTotal: number;
  priceTiers: PriceTier[];
  selectedTier?: string; // ID of the selected price tier
  costItems: CostItem[];
  markup: number;
  discount?: number;
  tax?: number;
  
  // Internal details
  internalNotes?: string;
  approval?: QuoteApproval;
  referenceNumber?: string;
  tourCode?: string;
  documents?: QuoteDocument[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  
  // Banking details
  bankingDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode?: string;
    swift?: string;
    iban?: string;
    reference?: string;
  };
}
