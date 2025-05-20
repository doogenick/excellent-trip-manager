
import { useState } from "react";
import { ItineraryManager } from "../../ItineraryManager/ItineraryManager";

interface ItineraryItem {
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

interface ItineraryStepProps {
  itinerary: ItineraryItem[];
  startDate?: Date;
  onItineraryChange: (itinerary: ItineraryItem[]) => void;
  onValidChange?: (isValid: boolean) => void;
}

export function ItineraryStep({ 
  itinerary, 
  startDate, 
  onItineraryChange,
  onValidChange
}: ItineraryStepProps) {
  // Automatically set validity based on whether there's at least one itinerary item
  useState(() => {
    if (onValidChange) {
      onValidChange(itinerary.length > 0);
    }
  });

  const handleItineraryChange = (newItinerary: ItineraryItem[]) => {
    onItineraryChange(newItinerary);
    if (onValidChange) {
      onValidChange(newItinerary.length > 0);
    }
  };

  return <ItineraryManager 
    itinerary={itinerary}
    onItineraryChange={handleItineraryChange}
    startDate={startDate}
  />;
}
