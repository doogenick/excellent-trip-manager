
import { useState } from "react";
import { CrewMember, CrewMealRates, SeasonalAdjustment } from './types';

export function useTourCalculatorState() {
  // Tour basic settings
  const [tourDuration, setTourDuration] = useState(7);
  const [minPax, setMinPax] = useState(2);
  const [maxPax, setMaxPax] = useState(16);
  const [currentPax, setCurrentPax] = useState(8);
  const [fuelPrice, setFuelPrice] = useState(2.5);
  const [totalDistance, setTotalDistance] = useState(1200);
  
  // Vehicle settings
  const [selectedVehicle, setSelectedVehicle] = useState("truck-24");
  const [vehicleMarkup, setVehicleMarkup] = useState(15);
  const [customVehicleName, setCustomVehicleName] = useState("Custom Vehicle");
  const [customDailyRate, setCustomDailyRate] = useState(175);
  const [customFuelConsumption, setCustomFuelConsumption] = useState(6);
  const [vehicleNotes, setVehicleNotes] = useState("");
  
  // Accommodation settings
  const [averageAccommodationCost, setAverageAccommodationCost] = useState(120);
  const [accommodationMarkup, setAccommodationMarkup] = useState(10);
  const [selectedRoomType, setSelectedRoomType] = useState("double");
  const [selectedMealBasis, setSelectedMealBasis] = useState("bb");
  
  // Park fees
  const [parkFees, setParkFees] = useState<number[]>(Array(tourDuration).fill(0));
  
  // Crew settings
  const [crew, setCrew] = useState<CrewMember[]>([
    { role: "driver", dailyRate: 120, accommodationRate: 60, mealAllowance: 30 },
    { role: "guide", dailyRate: 150, accommodationRate: 60, mealAllowance: 30 }
  ]);
  
  const [crewMealRates, setCrewMealRates] = useState<CrewMealRates>({
    breakfast: 10,
    lunch: 15,
    dinner: 20
  });
  
  // Activities settings
  const [averageActivityCost, setAverageActivityCost] = useState(50);
  const [activitiesMarkup, setActivitiesMarkup] = useState(20);
  const [includedActivities, setIncludedActivities] = useState(5);
  const [activitiesSeasonalAdjustments, setActivitiesSeasonalAdjustments] = useState<SeasonalAdjustment[]>([
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
  ]);
  
  // Meals settings
  const [preparedMealsCost, setPreparedMealsCost] = useState(15);
  const [mealMarkup, setMealMarkup] = useState(15);
  const [includedMeals, setIncludedMeals] = useState(10); // Number of prepared meals included
  const [travelStartDate, setTravelStartDate] = useState<Date>(new Date());
  
  // Pre/Post tour options
  const [prePostNights, setPrePostNights] = useState(2);
  const [prePostAccommodationCost, setPrePostAccommodationCost] = useState(100);
  const [prePostMarkup, setPrePostMarkup] = useState(10);

  // Promo code state
  const [promoCode, setPromoCode] = useState<string>('');
  
  const validatePromoCode = (code: string) => {
    if (!code) return false;
    
    // Basic validation
    if (code.length < 3 || code.length > 20) {
      throw new Error('Promo code must be between 3 and 20 characters');
    }
    
    return true;
  };

  const updatePromoCode = (newCode: string) => {
    try {
      validatePromoCode(newCode);
      setPromoCode(newCode);
    } catch (error) {
      console.error('Invalid promo code:', error);
      setPromoCode('');
    }
  };

  return {
    // Tour basics
    tourDuration,
    setTourDuration,
    minPax,
    setMinPax,
    maxPax,
    setMaxPax,
    currentPax,
    setCurrentPax,
    fuelPrice,
    setFuelPrice,
    totalDistance,
    setTotalDistance,

    // Vehicle settings
    selectedVehicle,
    setSelectedVehicle,
    vehicleMarkup,
    setVehicleMarkup,
    customVehicleName,
    setCustomVehicleName,
    customDailyRate,
    setCustomDailyRate,
    customFuelConsumption,
    setCustomFuelConsumption,
    vehicleNotes,
    setVehicleNotes,

    // Accommodation settings
    averageAccommodationCost,
    setAverageAccommodationCost,
    accommodationMarkup,
    setAccommodationMarkup,
    selectedRoomType,
    setSelectedRoomType,
    selectedMealBasis,
    setSelectedMealBasis,

    // Park fees
    parkFees,
    setParkFees,

    // Crew settings
    crew,
    setCrew,
    crewMealRates,
    setCrewMealRates,

    // Activities settings
    averageActivityCost,
    setAverageActivityCost,
    activitiesMarkup,
    setActivitiesMarkup,
    includedActivities,
    setIncludedActivities,
    activitiesSeasonalAdjustments,
    setActivitiesSeasonalAdjustments,

    // Meals settings
    travelStartDate,
    setTravelStartDate,
    preparedMealsCost,
    setPreparedMealsCost,
    mealMarkup,
    setMealMarkup,
    includedMeals,
    setIncludedMeals,

    // Pre/Post tour options
    prePostNights,
    setPrePostNights,
    prePostAccommodationCost,
    setPrePostAccommodationCost,
    prePostMarkup,
    setPrePostMarkup,

    // Promo code
    promoCode,
    updatePromoCode
  };
}
