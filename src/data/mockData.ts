
import { Quote, QuoteType, QuoteStatus, Supplier, SupplierRate } from "@/types";

// Mock client/agents
export const mockClientAgents = [
  { 
    id: "ca1", 
    name: "Sarah Johnson", 
    company: "Adventure Seekers Travel", 
    email: "sarah@adventureseekers.com", 
    phone: "+1 555-123-4567" 
  },
  { 
    id: "ca2", 
    name: "Michael Chen", 
    company: "Nomad Ventures", 
    email: "mchen@nomadventures.com", 
    phone: "+1 555-987-6543" 
  },
  { 
    id: "ca3", 
    name: "Emma Wilson", 
    company: "Safari Dreams", 
    email: "emma@safaridreams.co.uk", 
    phone: "+44 20 1234 5678" 
  },
];

// Mock destinations
export const mockDestinations = [
  { id: "d1", name: "Serengeti National Park", country: "Tanzania" },
  { id: "d2", name: "Okavango Delta", country: "Botswana" },
  { id: "d3", name: "Kruger National Park", country: "South Africa" },
  { id: "d4", name: "Maasai Mara", country: "Kenya" },
  { id: "d5", name: "Victoria Falls", country: "Zambia/Zimbabwe" },
  { id: "d6", name: "Cape Town", country: "South Africa" },
  { id: "d7", name: "Zanzibar", country: "Tanzania" },
  { id: "d8", name: "Namib Desert", country: "Namibia" },
];

// Mock suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "Savanna Lodge Group",
    contactPerson: "Daniel Mwangi",
    email: "bookings@savannagroup.com",
    phone: "+254 20 123 4567",
    serviceType: ["Accommodation", "Transfers"]
  },
  {
    id: "s2",
    name: "Safari Expeditions",
    contactPerson: "Fatima Nkosi",
    email: "reservations@safariexpeditions.co.za",
    phone: "+27 21 555 7890",
    serviceType: ["Activities", "Guides"]
  },
  {
    id: "s3",
    name: "Overland Africa",
    contactPerson: "James Okafor",
    email: "james@overlandafrica.com",
    phone: "+255 76 432 1098",
    serviceType: ["Vehicles", "Equipment"]
  },
  {
    id: "s4",
    name: "EcoStay Lodges",
    contactPerson: "Marie Taylor",
    email: "bookings@ecostay.com",
    phone: "+260 211 234567",
    serviceType: ["Accommodation"]
  }
];

// Mock supplier rates
export const mockSupplierRates: SupplierRate[] = [
  {
    id: "sr1",
    supplierId: "s1",
    serviceName: "Luxury Safari Tent",
    serviceType: "Accommodation",
    rate: 250,
    currency: "USD",
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-12-31"),
    seasonType: "standard"
  },
  {
    id: "sr2",
    supplierId: "s1",
    serviceName: "Luxury Safari Tent",
    serviceType: "Accommodation",
    rate: 350,
    currency: "USD",
    validFrom: new Date("2025-06-01"),
    validTo: new Date("2025-09-30"),
    seasonType: "high"
  },
  {
    id: "sr3",
    supplierId: "s2",
    serviceName: "Game Drive",
    serviceType: "Activities",
    rate: 85,
    currency: "USD",
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-12-31"),
    seasonType: "standard"
  },
  {
    id: "sr4",
    supplierId: "s3",
    serviceName: "4x4 Safari Vehicle",
    serviceType: "Vehicles",
    rate: 180,
    currency: "USD",
    validFrom: new Date("2025-01-01"),
    validTo: new Date("2025-12-31"),
    seasonType: "standard"
  }
];

// Generate mock quotes
const generateMockQuotes = (): Quote[] => {
  const quoteTypes: QuoteType[] = [
    "Truck Rental",
    "Transfer Request",
    "Private Nomad Schedule Tour",
    "Language Guided Tour",
    "Tailor-made Tour",
    "Bachelor/et Party",
    "Southern Africa Tour",
    "East Africa Tour",
    "FIT Tour"
  ];
  
  const statuses: QuoteStatus[] = ["draft", "sent", "confirmed", "rejected"];
  
  const mockQuotes: Quote[] = [];
  
  for (let i = 1; i <= 9; i++) {
    const quoteType = quoteTypes[i - 1];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const clientAgent = mockClientAgents[Math.floor(Math.random() * mockClientAgents.length)];
    const startDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 14) + 3);
    
    const destinations = [
      mockDestinations[Math.floor(Math.random() * mockDestinations.length)]
    ];
    
    if (Math.random() > 0.5) {
      let secondDestination;
      do {
        secondDestination = mockDestinations[Math.floor(Math.random() * mockDestinations.length)];
      } while (secondDestination.id === destinations[0].id);
      destinations.push(secondDestination);
    }
    
    const adults = Math.floor(Math.random() * 6) + 1;
    const children = Math.floor(Math.random() * 3);
    
    // Generate a simple itinerary
    const durationDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const itinerary = [];
    
    for (let day = 1; day <= durationDays; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day - 1);
      
      itinerary.push({
        id: `itin-${i}-${day}`,
        day,
        date,
        description: day === 1 
          ? `Arrival at ${destinations[0].name}` 
          : day === durationDays 
            ? `Departure from ${destinations[destinations.length - 1].name}` 
            : `Day at ${destinations[Math.min(Math.floor(day / (durationDays / destinations.length)), destinations.length - 1)].name}`,
        accommodation: day < durationDays ? "Safari Lodge" : undefined,
        meals: {
          breakfast: day > 1,
          lunch: true,
          dinner: day < durationDays
        },
        activities: day === 1 || day === durationDays ? [] : ["Game Drive", "Scenic Tour"],
        notes: ""
      });
    }
    
    // Generate mock cost items
    const costItems = [
      {
        id: `cost-${i}-1`,
        description: "Accommodation",
        supplierRate: 200,
        margin: 15,
        sellingRate: 230,
        quantity: durationDays - 1,
        total: 230 * (durationDays - 1),
        currency: "USD"
      },
      {
        id: `cost-${i}-2`,
        description: "Activities",
        supplierRate: 85,
        margin: 20,
        sellingRate: 102,
        quantity: (durationDays - 2) * 2,
        total: 102 * (durationDays - 2) * 2,
        currency: "USD"
      },
      {
        id: `cost-${i}-3`,
        description: "Transfers",
        supplierRate: 120,
        margin: 25,
        sellingRate: 150,
        quantity: 2,
        total: 150 * 2,
        currency: "USD"
      }
    ];
    
    const totalCost = costItems.reduce((sum, item) => sum + item.total, 0);
    
    mockQuotes.push({
      id: `q${i}`,
      quoteNumber: `QT-${2025}-${(1000 + i).toString().substring(1)}`,
      createdAt: new Date(2025, 0, i),
      updatedAt: new Date(2025, 0, i),
      status,
      type: quoteType,
      clientAgent,
      travelDates: {
        startDate,
        endDate
      },
      destinations,
      passengers: {
        adults,
        children
      },
      passengerDetails: [],
      itinerary,
      costItems,
      totalCost,
      currency: "USD",
      notes: "Sample quote for demonstration purposes.",
      version: 1
    });
  }
  
  return mockQuotes;
};

export const mockQuotes = generateMockQuotes();

// Helper function to get a quote by ID
export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.id === id);
};
