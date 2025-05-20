import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuoteType, FITTourType, GroupTourType, ServiceLevel, AccommodationType, MealPlan, CrewMemberType, VehicleType, TourType } from "@/types/quotes";
import { WizardSteps } from "./WizardSteps";
import { ClientInformationStep } from "./steps/ClientInformationStep";
import { TripDetailsStep } from "./steps/TripDetailsStep";
import { PassengersStep } from "./steps/PassengersStep";
import { PriceCalculatorStep } from "./steps/PriceCalculatorStep";
import { ReviewStep } from "./steps/ReviewStep";
import { TourTypeStep } from "./steps/TourTypeStep";
import { FITDetailsStep } from "./steps/FITDetailsStep";
import { GroupDetailsStep } from "./steps/GroupDetailsStep";
import { ItineraryStep, ItineraryItem, VehicleDetails } from "./steps/ItineraryStep";

export function QuoteWizard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // Client information
  const [clientId, setClientId] = useState("");
  
  // Tour type selection
  const [tourType, setTourType] = useState<QuoteType | "">("");
  
  // Trip details
  const [tripDetails, setTripDetails] = useState({
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    destinations: [] as string[],
    serviceLevel: "STANDARD" as ServiceLevel,
    accommodationType: "HOTEL" as AccommodationType,
    mealPlan: "BB" as MealPlan
  });
  
  // Passengers information
  const [passengers, setPassengers] = useState({
    adults: "2",
    children: "0",
    notes: ""
  });
  
  // FIT tour specific state
  const [fitDetails, setFitDetails] = useState({
    fitType: "PRIVATE_GUIDED" as FITTourType,
    isSelfDrive: false,
    includesVehicle: true,
    includesAccommodation: true,
    includesMeals: true,
    includesActivities: true,
    vehicleType: "4X4" as VehicleType,
    crewType: "DRIVER_GUIDE" as CrewMemberType
  });

  // Group tour specific state
  const [groupDetails, setGroupDetails] = useState({
    groupType: "FULLY_INCLUDED" as GroupTourType,
    vehicleType: "MINIBUS" as VehicleType,
    crewType: "FULL_CREW" as CrewMemberType,
    includesCampingEquipment: false,
    includesCookingEquipment: false,
    includesParkFees: true,
    includesActivities: true,
    requiresSingleRooms: true,
    requiresDoubleRooms: true,
    requiresTwinRooms: false
  });
  
  // Itinerary with daily KM tracking
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  
  // Vehicle and fuel calculation
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    selectedVehicle: "",
    customVehicleName: "",
    customDailyRate: 0,
    customFuelConsumption: 0, // KM per liter
    fuelPrice: 1.5, // Price per liter
    vehicleCollectionFee: 0,
    vehicleDeliveryFee: 0
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [perPersonPrice, setPerPersonPrice] = useState(0);

  // Calculate total KM for the tour
  const totalKilometers = itinerary.reduce((sum, day) => sum + day.distance, 0);

  // Track validity for each step
  const [stepValidity, setStepValidity] = useState<boolean[]>([false, false, false, false, false, false, false, false]);

  // Define steps based on tour type
  const steps = [
    "Tour Type",
    "Client Information",
    "Trip Details",
    "Passengers",
    tourType === "FIT" ? "FIT Details" : "Group Details",
    "Itinerary",
    "Price Calculator",
    "Review"
  ];

  // Update step validity when tour type changes
  useEffect(() => {
    // Reset step validity when tour type changes
    setStepValidity(Array(steps.length).fill(false));
  }, [tourType]);

  // Update total pax when adults or children change
  useEffect(() => {
    setPassengers(prev => ({
      ...prev,
      total: parseInt(prev.adults) + parseInt(prev.children)
    }));
  }, [passengers.adults, passengers.children]);

  // Effects to update state based on changes
  useEffect(() => {
    // Reset step validity when tour type changes
    setStepValidity(Array(steps.length).fill(false));
    // Set first step as valid if we have a selection
    if (tourType) {
      setStepValidity(prev => {
        const newArray = [...prev];
        newArray[0] = true;
        return newArray;
      });
    }
  }, [tourType, steps.length]);

  // Handle step validation changes
  const updateStepValidity = (stepIndex: number, isValid: boolean) => {
    setStepValidity(prev => {
      const newValidity = [...prev];
      newValidity[stepIndex] = isValid;
      return newValidity;
    });
  };
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleCreateQuote();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCreateQuote = () => {
    // Build the complete quote object
    const quote = {
      tourType,
      clientId,
      tripDetails,
      passengers,
      ...(tourType === "FIT" ? { fitDetails } : { groupDetails }),
      itinerary,
      vehicleDetails,
      totalKilometers,
      fuelCost: calculateFuelCost(),
      totalPrice,
      perPersonPrice,
      createdAt: new Date().toISOString()
    };
    
    console.log("Quote created:", quote);
    toast.success("Quote created successfully!");
    navigate("/quotes");
  };

  const handlePriceChange = (total: number, perPerson: number) => {
    setTotalPrice(total);
    setPerPersonPrice(perPerson);
  };

  // Calculate fuel cost based on total distance and vehicle consumption
  const calculateFuelCost = () => {
    const { customFuelConsumption, fuelPrice } = vehicleDetails;
    if (!customFuelConsumption) return 0;
    
    const litersNeeded = totalKilometers / customFuelConsumption;
    return litersNeeded * fuelPrice;
  };

  // Use stepValidity to control Next button
  const isNextDisabled = () => {
    return !stepValidity[activeStep];
  };

  // Props for each step component
  const tourTypeStepProps = {
    tourType,
    setTourType,
    onValidChange: (valid: boolean) => updateStepValidity(0, valid)
  };
  
  const clientStepProps = {
    clientId,
    setClientId,
    onValidChange: (valid: boolean) => updateStepValidity(1, valid)
  };
  
  // Handle passenger field updates
  const handlePassengerChange = (field: 'adults' | 'children' | 'notes', value: string) => {
    setPassengers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Convert our new data structure to match expected props for existing components
  const tripStepProps = {
    quoteType: tourType === "FIT" ? "FIT" : tourType === "GROUP" ? "GROUP" : "",
    setQuoteType: (value: any) => setTourType(value),
    startDate: tripDetails.startDate,
    setStartDate: (date?: Date) => setTripDetails(prev => ({ ...prev, startDate: date })),
    endDate: tripDetails.endDate,
    setEndDate: (date?: Date) => setTripDetails(prev => ({ ...prev, endDate: date })),
    selectedDestinations: tripDetails.destinations,
    setSelectedDestinations: (destinations: string[]) => setTripDetails(prev => ({ ...prev, destinations })),
    onValidChange: (valid: boolean) => updateStepValidity(2, valid)
  };

  const passengersStepProps = {
    adults: passengers.adults,
    setAdults: (value: string) => handlePassengerChange('adults', value),
    children: passengers.children,
    setChildren: (value: string) => handlePassengerChange('children', value),
    notes: passengers.notes,
    setNotes: (value: string) => handlePassengerChange('notes', value),
    onValidChange: (valid: boolean) => updateStepValidity(3, valid)
  };
  
  const fitDetailsStepProps = {
    fitDetails,
    setFitDetails,
    onValidChange: (valid: boolean) => updateStepValidity(4, valid)
  };
  
  const groupDetailsStepProps = {
    groupDetails,
    setGroupDetails,
    onValidChange: (valid: boolean) => updateStepValidity(4, valid)
  };
  
  const itineraryStepProps = {
    itinerary,
    setItinerary,
    vehicleDetails,
    setVehicleDetails,
    startDate: tripDetails.startDate,
    onValidChange: (valid: boolean) => updateStepValidity(5, valid)
  };
  
  const priceCalculatorStepProps = {
    adults: passengers.adults,
    children: passengers.children,
    quoteType: tourType as string,
    selectedDestinations: tripDetails.destinations,
    startDate: tripDetails.startDate,
    endDate: tripDetails.endDate,
    onPriceChange: handlePriceChange
  };
  
  const reviewStepProps = {
    clientId,
    quoteType: tourType === "FIT" ? "FIT" : tourType === "GROUP" ? "GROUP" : "",
    startDate: tripDetails.startDate,
    endDate: tripDetails.endDate,
    selectedDestinations: tripDetails.destinations,
    adults: passengers.adults,
    children: passengers.children,
    notes: passengers.notes,
    totalPrice,
    perPersonPrice
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Tour Type
        return <TourTypeStep {...tourTypeStepProps} />;
      
      case 1: // Client Information
        return <ClientInformationStep {...clientStepProps} />;
      
      case 2: // Trip Details
        return <TripDetailsStep {...tripStepProps} />;
      
      case 3: // Passengers
        return <PassengersStep {...passengersStepProps} />;
      
      case 4: // FIT or Group Details
        return tourType === "FIT" 
          ? <FITDetailsStep {...fitDetailsStepProps} />
          : <GroupDetailsStep {...groupDetailsStepProps} />;
      
      case 5: // Itinerary
        return <ItineraryStep {...itineraryStepProps} />;
      
      case 6: // Price Calculator
        return <PriceCalculatorStep {...priceCalculatorStepProps} />;
      
      case 7: // Review
        return <ReviewStep {...reviewStepProps} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote</CardTitle>
          <CardDescription>Step {activeStep + 1} of {steps.length}: {steps[activeStep]}</CardDescription>
          
          <WizardSteps steps={steps} activeStep={activeStep} />
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={activeStep === 0 ? () => navigate("/quotes") : handleBack}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled()}>
            {activeStep === steps.length - 1 ? "Create Quote" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
