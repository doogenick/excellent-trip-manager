
export interface CrewMember {
  role: string;
  dailyRate: number;
  accommodationRate: number;
  mealAllowance: number;
}

export interface CrewMealRates {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface VehicleType {
  id: string;
  name: string;
  dailyRate: number;
  fuelConsumption: number;
  notes: string;
}

export interface CrewRole {
  id: string;
  name: string;
  dailyRate: number;
}

export interface RoomType {
  id: string;
  name: string;
  baseMultiplier: number;
}

export interface MealBasisOption {
  id: string;
  name: string;
  costMultiplier: number;
  display: string;
}
