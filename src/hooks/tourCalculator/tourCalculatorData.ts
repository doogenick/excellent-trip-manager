
import { VehicleType, CrewRole, RoomType, MealBasisOption, SeasonalAdjustment } from './types';

// Vehicle types with their properties
export const vehicleTypes: VehicleType[] = [
  { id: "truck-24", name: "Truck (24 seats)", dailyRate: 350, fuelConsumption: 4, notes: "" },
  { id: "truck-16", name: "Truck (16 seats)", dailyRate: 250, fuelConsumption: 5, notes: "" },
  { id: "quantum", name: "Quantum", dailyRate: 150, fuelConsumption: 8, notes: "" },
  { id: "subcontracted", name: "Subcontracted Vehicle", dailyRate: 200, fuelConsumption: 7, notes: "" },
  { id: "custom", name: "Custom Vehicle", dailyRate: 175, fuelConsumption: 6, notes: "" }
];

// Crew types with their properties
export const crewRoles: CrewRole[] = [
  { id: "driver", name: "Driver", dailyRate: 120 },
  { id: "guide", name: "Guide", dailyRate: 150 },
  { id: "assistant", name: "Assistant", dailyRate: 80 }
];

// Room types with their properties
export const roomTypes: RoomType[] = [
  {
    id: "single",
    name: "Single Room",
    baseMultiplier: 1.5,
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.2,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      },
      {
        name: "Low Season",
        multiplier: 0.9,
        startDate: "01-01",
        endDate: "03-31",
        priority: 1
      }
    ]
  },
  {
    id: "double",
    name: "Double/Twin Room",
    baseMultiplier: 1.0,
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.15,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      },
      {
        name: "Low Season",
        multiplier: 0.95,
        startDate: "01-01",
        endDate: "03-31",
        priority: 1
      }
    ]
  },
  {
    id: "triple",
    name: "Triple Room",
    baseMultiplier: 0.85,
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.1,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      }
    ]
  },
  {
    id: "family",
    name: "Family Room",
    baseMultiplier: 0.75,
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.1,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      }
    ]
  },
  {
    id: "dorm",
    name: "Dormitory",
    baseMultiplier: 0.5,
    seasonalAdjustments: []
  },
  {
    id: "camping",
    name: "Camping",
    baseMultiplier: 0.3,
    seasonalAdjustments: []
  }
];

// Meal basis options
export const mealBasisOptions: MealBasisOption[] = [
  {
    id: "ro",
    name: "Room Only",
    costMultiplier: 0.0,
    display: "RO",
    seasonalAdjustments: []
  },
  {
    id: "bb",
    name: "Bed & Breakfast",
    costMultiplier: 0.15,
    display: "B&B",
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.1,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      }
    ]
  },
  {
    id: "hb",
    name: "Half Board",
    costMultiplier: 0.35,
    display: "HB",
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.1,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      }
    ]
  },
  {
    id: "fb",
    name: "Full Board",
    costMultiplier: 0.5,
    display: "FB",
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.1,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      }
    ]
  },
  {
    id: "ai",
    name: "All Inclusive",
    costMultiplier: 0.75,
    display: "AI",
    seasonalAdjustments: [
      {
        name: "Peak Season",
        multiplier: 1.1,
        startDate: "06-01",
        endDate: "09-30",
        priority: 1
      }
    ]
  }
];
