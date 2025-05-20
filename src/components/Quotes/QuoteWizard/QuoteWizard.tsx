import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  QuoteType, 
  FITTourType, 
  GroupTourType, 
  ServiceLevel, 
  AccommodationType, 
  MealPlan, 
  CrewMemberType, 
  VehicleType, 
  TourType, 
  CrewMember, 
  TrailerDetails,
  VehicleDetails 
} from "@/types/quotes";
import { WizardSteps } from "./WizardSteps";
import { ClientInformationStep } from "./steps/ClientInformationStep";
import { TripDetailsStep } from "./steps/TripDetailsStep";
import { PassengersStep } from "./steps/PassengersStep";
import { PriceCalculatorStep } from "./steps/PriceCalculatorStep";
import { ReviewStep } from "./steps/ReviewStep";
import { TourTypeStep } from "./steps/TourTypeStep";
import { FITDetailsStep } from "./steps/FITDetailsStep";
import { GroupDetailsStep } from "./steps/GroupDetailsStep";
import { ItineraryStep, ItineraryItem, VehicleDetails as ItineraryVehicleDetails } from "./steps/ItineraryStep";
import { QuoteHeaderStep } from "./steps/QuoteHeaderStep";
import { CrewManagementStep } from "./steps/CrewManagementStep";
import { VehicleManagementStep } from "./steps/VehicleManagementStep";

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
  
  // Quote header information
  const [quoteHeader, setQuoteHeader] = useState({
    referenceNumber: "",
    autoGenerateReference: true,
    issueDate: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    travelYear: new Date().getFullYear().toString(),
    clientName: "",
    agentName: "",
    tourCode: ""
  });

  // Vehicle management
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([]);
  const [trailers, setTrailers] = useState<TrailerDetails[]>([]);
  const [startTransitKm, setStartTransitKm] = useState(0);
  const [endTransitKm, setEndTransitKm] = useState(0);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(1.5);

  // Crew management
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);

  // For backward compatibility with ItineraryStep
  const [vehicleDetails, setVehicleDetails] = useState<ItineraryVehicleDetails>({
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
    "Quote Header",
    "Client Information",
    "Trip Details",
    "Passengers",
    tourType === "FIT" ? "FIT Details" : "Group Details",
    "Itinerary",
    "Vehicle Management",
    "Crew Management",
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
      quoteHeader,
      tripDetails,
      passengers,
      ...(tourType === "FIT" ? { fitDetails } : { groupDetails }),
      itinerary,
      vehicles,
      trailers,
      transitDetails: {
        startTransitKm,
        endTransitKm,
        fuelPricePerLiter
      },
      crewMembers,
      totalKilometers,
      fuelCost: calculateEnhancedFuelCost(),
      totalPrice,
      perPersonPrice,
      createdAt: new Date().toISOString(),
      // Keep old vehicleDetails for backward compatibility
      vehicleDetails
    };
    
    console.log("Quote created:", quote);
    toast.success("Quote created successfully!");
    navigate("/quotes");
  };

  const handlePriceChange = (total: number, perPerson: number) => {
    setTotalPrice(total);
    setPerPersonPrice(perPerson);
  };

  // Calculate fuel cost based on total distance and vehicle consumption (legacy)
  const calculateFuelCost = () => {
    const { customFuelConsumption, fuelPrice } = vehicleDetails;
    if (!customFuelConsumption) return 0;
    
    const litersNeeded = totalKilometers / customFuelConsumption;
    return litersNeeded * fuelPrice;
  };
  
  // Enhanced fuel cost calculation using multiple vehicles
  const calculateEnhancedFuelCost = () => {
    // If no vehicles defined, use legacy calculation
    if (vehicles.length === 0) {
      return calculateFuelCost();
    }
    
    // Calculate fuel cost for all vehicles
    const totalDistanceWithTransit = totalKilometers + startTransitKm + endTransitKm;
    
    return vehicles.reduce((total, vehicle) => {
      if (!vehicle.fuelConsumption) return total;
      const litersPer100km = 100 / vehicle.fuelConsumption;
      const litersNeeded = (totalDistanceWithTransit / 100) * litersPer100km;
      return total + (litersNeeded * fuelPricePerLiter);
    }, 0);
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
  // Props for Quote Header step
  const quoteHeaderStepProps = {
    referenceNumber: quoteHeader.referenceNumber,
    setReferenceNumber: (value: string) => setQuoteHeader(prev => ({ ...prev, referenceNumber: value })),
    autoGenerateReference: quoteHeader.autoGenerateReference,
    setAutoGenerateReference: (value: boolean) => setQuoteHeader(prev => ({ ...prev, autoGenerateReference: value })),
    issueDate: quoteHeader.issueDate,
    setIssueDate: (date: Date) => setQuoteHeader(prev => ({ ...prev, issueDate: date })),
    validUntil: quoteHeader.validUntil,
    setValidUntil: (date: Date) => setQuoteHeader(prev => ({ ...prev, validUntil: date })),
    travelYear: quoteHeader.travelYear,
    setTravelYear: (year: string) => setQuoteHeader(prev => ({ ...prev, travelYear: year })),
    clientName: quoteHeader.clientName,
    setClientName: (name: string) => setQuoteHeader(prev => ({ ...prev, clientName: name })),
    agentName: quoteHeader.agentName,
    setAgentName: (name: string) => setQuoteHeader(prev => ({ ...prev, agentName: name })),
    tourCode: quoteHeader.tourCode,
    setTourCode: (code: string) => setQuoteHeader(prev => ({ ...prev, tourCode: code })),
    tourType: tourType as unknown as TourType | "",
    setTourType: (type: TourType) => setTourType(type as unknown as QuoteType),
    onValidChange: (valid: boolean) => updateStepValidity(1, valid)
  };

  const tripStepProps = {
    quoteType: tourType as QuoteType | "",
    setQuoteType: (value: QuoteType) => setTourType(value),
    startDate: tripDetails.startDate,
    setStartDate: (date?: Date) => setTripDetails(prev => ({ ...prev, startDate: date })),
    endDate: tripDetails.endDate,
    setEndDate: (date?: Date) => setTripDetails(prev => ({ ...prev, endDate: date })),
    selectedDestinations: tripDetails.destinations,
    setSelectedDestinations: (destinations: string[]) => setTripDetails(prev => ({ ...prev, destinations })),
    onValidChange: (valid: boolean) => updateStepValidity(3, valid)
  };

  const passengersStepProps = {
    adults: passengers.adults,
    setAdults: (value: string) => handlePassengerChange('adults', value),
    children: passengers.children,
    setChildren: (value: string) => handlePassengerChange('children', value),
    notes: passengers.notes,
    setNotes: (value: string) => handlePassengerChange('notes', value),
    onValidChange: (valid: boolean) => updateStepValidity(4, valid)
  };
  
  const fitDetailsStepProps = {
    fitDetails,
    setFitDetails,
    onValidChange: (valid: boolean) => updateStepValidity(5, valid)
  };
  
  const groupDetailsStepProps = {
    groupDetails,
    setGroupDetails,
    onValidChange: (valid: boolean) => updateStepValidity(5, valid)
  };
  
  const itineraryStepProps = {
    itinerary,
    setItinerary,
    vehicleDetails,
    setVehicleDetails,
    startDate: tripDetails.startDate,
    onValidChange: (valid: boolean) => updateStepValidity(6, valid)
  };

  const vehicleManagementStepProps = {
    vehicles,
    setVehicles,
    trailers,
    setTrailers,
    startTransitKm,
    setStartTransitKm,
    endTransitKm,
    setEndTransitKm,
    fuelPricePerLiter,
    setFuelPricePerLiter,
    totalDistance: totalKilometers,
    onValidChange: (valid: boolean) => updateStepValidity(7, valid)
  };

  const crewManagementStepProps = {
    crewMembers,
    setCrewMembers,
    totalDays: itinerary.length,
    onValidChange: (valid: boolean) => updateStepValidity(8, valid)
  };
  
  const priceCalculatorStepProps = {
    adults: passengers.adults,
    children: passengers.children,
    quoteType: tourType as QuoteType | "",
    selectedDestinations: tripDetails.destinations,
    startDate: tripDetails.startDate,
    endDate: tripDetails.endDate,
    onPriceChange: handlePriceChange,
    onValidChange: (valid: boolean) => updateStepValidity(9, valid)
  };
  
  const reviewStepProps = {
    clientId,
    quoteType: tourType as QuoteType | "",
    startDate: tripDetails.startDate,
    endDate: tripDetails.endDate,
    selectedDestinations: tripDetails.destinations,
    adults: passengers.adults,
    children: passengers.children,
    notes: passengers.notes,
    totalPrice,
    perPersonPrice,
    onValidChange: (valid: boolean) => updateStepValidity(10, valid)
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Tour Type
        return <TourTypeStep {...tourTypeStepProps} />;
      
      case 1: // Quote Header
        return <QuoteHeaderStep {...quoteHeaderStepProps} />;
      
      case 2: // Client Information
        return <ClientInformationStep {...clientStepProps} />;
      
      case 3: // Trip Details
        return <TripDetailsStep {...tripStepProps} />;
      
      case 4: // Passengers
        return <PassengersStep {...passengersStepProps} />;
      
      case 5: // FIT or Group Details
        return tourType === "FIT" 
          ? <FITDetailsStep {...fitDetailsStepProps} />
          : <GroupDetailsStep {...groupDetailsStepProps} />;
      
      case 6: // Itinerary
        return <ItineraryStep {...itineraryStepProps} />;
        
      case 7: // Vehicle Management
        return <VehicleManagementStep {...vehicleManagementStepProps} />;
        
      case 8: // Crew Management
        return <CrewManagementStep {...crewManagementStepProps} />;
      
      case 9: // Price Calculator
        return <PriceCalculatorStep {...priceCalculatorStepProps} />;
      
      case 10: // Review
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
