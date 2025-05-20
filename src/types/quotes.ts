// Base Quote Type
export enum QuoteType {
  FIT = 'FIT',
  GROUP = 'GROUP'
}

// Enhanced tour type for more specific classifications
export enum TourType {
  ACCOMMODATED = 'ACCOMMODATED',
  CAMPING = 'CAMPING',
  COMBINATION = 'COMBINATION', // Mix of accommodated and camping
  SELF_DRIVE = 'SELF_DRIVE'
}

export enum FITTourType {
  SELF_DRIVE = 'SELF_DRIVE',
  PRIVATE_GUIDED = 'PRIVATE_GUIDED',
  SUBCONTRACTED = 'SUBCONTRACTED',
  OUTSOURCED = 'OUTSOURCED'
}

export enum GroupTourType {
  VEHICLE_ONLY = 'VEHICLE_ONLY',
  FULLY_INCLUDED = 'FULLY_INCLUDED'
}

export enum CrewMemberType {
  DRIVER = 'DRIVER',
  GUIDE = 'GUIDE',
  DRIVER_GUIDE = 'DRIVER_GUIDE',
  COOK = 'COOK',
  ASSISTANT = 'ASSISTANT'
}

// Tour Service Level
export type ServiceLevel = 'BUDGET' | 'STANDARD' | 'LUXURY' | 'CUSTOM';

// Accommodation Types
export type AccommodationType = 'HOTEL' | 'LODGE' | 'GUESTHOUSE' | 'CAMPING' | 'MIXED';

// Vehicle Types
export enum VehicleType {
  MINIVAN = 'MINIVAN',
  '4X4' = '4X4',
  LUXURY_VEHICLE = 'LUXURY_VEHICLE',
  MINIBUS = 'MINIBUS', // Up to 22 pax
  COACH = 'COACH', // 23+ pax
  TRUCK = 'TRUCK', // Safari truck
  SPRINTER = 'SPRINTER',
  CUSTOM = 'CUSTOM'
}

export interface VehicleDetails {
  id: string;
  name: string;
  type: VehicleType;
  dailyRate: number;
  fuelConsumption: number; // km per liter
  maxPassengers: number;
  collectionFee?: number;
  deliveryFee?: number;
}

export enum TrailerType {
  LUGGAGE = 'LUGGAGE',
  CAMPING = 'CAMPING',
  KITCHEN = 'KITCHEN',
  CUSTOM = 'CUSTOM'
}

export interface TrailerDetails {
  id: string;
  name: string;
  type: TrailerType;
  dailyRate: number;
  collectionFee?: number;
  deliveryFee?: number;
}

// Meal Plan Types
export type MealPlan = 'RO' | 'BB' | 'HB' | 'FB' | 'AI'; // Room Only, Bed & Breakfast, Half Board, Full Board, All Inclusive

// Client-related types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  type: CrewMemberType;
  dailyWage: number;
  startDay: number; // Day of tour when crew member starts
  endDay: number; // Day of tour when crew member ends
  relocationCost: number; // Cost for crew flights/transport to start/end points
}

// Itinerary-related types
export interface ItineraryItem {
  id: string;
  day: number;
  date: Date | string;
  startLocation: string;
  endLocation: string;
  description: string;
  activity: string;
  accommodation: string;
  accommodationType: AccommodationType;
  distance: number; // Daily distance in km
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  // Daily expenses
  vehicleBorderFees: number;
  tollFees: number;
  crewAccommodationCost: number;
  crewMealBudget: number;

  // Per-person daily costs
  accommodationCostPerPerson: number;
  activityCostPerPerson: number;
  parkFeesPerPerson: number;
  mealsCostPerPerson: number;

  // Crew-specific costs
  crewParkFees: number;
  crewActivityCosts: number;
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

// Base Tour Interface
export interface BaseTourDetails {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  pax: {
    adults: number;
    children: number;
    total: number;
    isGroup: boolean; // true if group (8+ pax)
  };
  serviceLevel: ServiceLevel;
  accommodationType: AccommodationType;
  mealPlan: MealPlan;
  destinations: string[];
  itinerary: ItineraryItem[];
  notes?: string;
}

// FIT Tour Specific Details
export interface FITTourDetails extends BaseTourDetails {
  type: 'FIT';
  fitType: FITTourType;
  vehicleType?: VehicleType;
  crewType?: CrewMemberType;
  isSelfDrive: boolean;
  includesVehicle: boolean;
  includesAccommodation: boolean;
  includesMeals: boolean;
  includesActivities: boolean;
  supplierDetails?: {
    name: string;
    contact: string;
    cost: number;
  };
}

// Group Tour Specific Details
export interface GroupTourDetails extends BaseTourDetails {
  type: 'GROUP';
  groupType: GroupTourType;
  vehicleType: VehicleType;
  crewType: CrewMemberType;
  includesCampingEquipment: boolean;
  includesCookingEquipment: boolean;
  includesParkFees: boolean;
  includesActivities: boolean;
  requiresSingleRooms: boolean;
  requiresDoubleRooms: boolean;
  requiresTwinRooms: boolean;
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
