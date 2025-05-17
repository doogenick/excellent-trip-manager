
import { VehicleType, CrewRole, RoomType, MealBasisOption } from './types';

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
  { id: "single", name: "Single Room", baseMultiplier: 1.5 },
  { id: "double", name: "Double/Twin Room", baseMultiplier: 1.0 },
  { id: "triple", name: "Triple Room", baseMultiplier: 0.85 },
  { id: "family", name: "Family Room", baseMultiplier: 0.75 },
  { id: "dorm", name: "Dormitory", baseMultiplier: 0.5 },
  { id: "camping", name: "Camping", baseMultiplier: 0.3 }
];

// Meal basis options
export const mealBasisOptions: MealBasisOption[] = [
  { id: "ro", name: "Room Only", costMultiplier: 0.0, display: "RO" },
  { id: "bb", name: "Bed & Breakfast", costMultiplier: 0.15, display: "B&B" },
  { id: "hb", name: "Half Board", costMultiplier: 0.35, display: "HB" },
  { id: "fb", name: "Full Board", costMultiplier: 0.5, display: "FB" },
  { id: "ai", name: "All Inclusive", costMultiplier: 0.75, display: "AI" }
];
