
import { useState } from "react";
import { CrewMember, CrewMealRates } from './types';

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
  
  // Meals settings
  const [preparedMealsCost, setPreparedMealsCost] = useState(15);
  const [mealMarkup, setMealMarkup] = useState(15);
  const [includedMeals, setIncludedMeals] = useState(10); // Number of prepared meals included
  
  // Pre/Post tour options
  const [prePostNights, setPrePostNights] = useState(2);
  const [prePostAccommodationCost, setPrePostAccommodationCost] = useState(100);
  const [prePostMarkup, setPrePostMarkup] = useState(10);

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

    // Meals settings
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
    setPrePostMarkup
  };
}
