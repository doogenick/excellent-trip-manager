
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FITTourType, GroupTourType, ServiceLevel, AccommodationType, MealPlan, CrewType, VehicleType } from "@/types/quotes";
import { WizardSteps } from "./WizardSteps";
import { ClientInformationStep } from "./steps/ClientInformationStep";
import { TripDetailsStep } from "./steps/TripDetailsStep";
import { PassengersStep } from "./steps/PassengersStep";
import { PriceCalculatorStep } from "./steps/PriceCalculatorStep";
import { ReviewStep } from "./steps/ReviewStep";
import { TourTypeStep } from "./steps/TourTypeStep";
import { FITDetailsStep } from "./steps/FITDetailsStep";
import { GroupDetailsStep } from "./steps/GroupDetailsStep";

// Base tour details interface
export interface BaseTourDetails {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  pax: {
    adults: number;
    children: number;
    total: number;
    isGroup: boolean;
  };
  serviceLevel: ServiceLevel;
  accommodationType: AccommodationType;
  mealPlan: MealPlan;
  destinations: string[];
  notes: string;
}

// FIT tour specific details
interface FITTourDetails {
  fitType: FITTourType;
  vehicleType?: VehicleType;
  crewType?: CrewType;
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

// Group tour specific details
interface GroupTourDetails {
  groupType: GroupTourType;
  vehicleType: VehicleType;
  crewType: CrewType;
  includesCampingEquipment: boolean;
  includesCookingEquipment: boolean;
  includesParkFees: boolean;
  includesActivities: boolean;
  requiresSingleRooms: boolean;
  requiresDoubleRooms: boolean;
  requiresTwinRooms: boolean;
}

export function QuoteWizard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // Base tour state
  const [tourType, setTourType] = useState<'FIT' | 'GROUP' | ''>('');
  
  // Base tour details
  const [tourDetails, setTourDetails] = useState<BaseTourDetails>({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    duration: 0,
    pax: {
      adults: 2,
      children: 0,
      total: 2,
      isGroup: false
    },
    serviceLevel: 'STANDARD',
    accommodationType: 'HOTEL',
    mealPlan: 'BB',
    destinations: [],
    notes: ''
  });

  // FIT tour specific state
  const [fitDetails, setFitDetails] = useState<FITTourDetails>({
    fitType: 'PRIVATE_GUIDED',
    isSelfDrive: false,
    includesVehicle: true,
    includesAccommodation: true,
    includesMeals: true,
    includesActivities: true,
    vehicleType: '4X4',
    crewType: 'DRIVER_GUIDE'
  });

  // Group tour specific state
  const [groupDetails, setGroupDetails] = useState<GroupTourDetails>({
    groupType: 'FULLY_INCLUDED',
    vehicleType: 'MINIBUS',
    crewType: 'FULL_CREW',
    includesCampingEquipment: false,
    includesCookingEquipment: false,
    includesParkFees: true,
    includesActivities: true,
    requiresSingleRooms: true,
    requiresDoubleRooms: true,
    requiresTwinRooms: false
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [perPersonPrice, setPerPersonPrice] = useState(0);

  // Track validity for each step
  const [stepValidity, setStepValidity] = useState<boolean[]>([]);

  // Define steps based on tour type
  const steps = [
    'Tour Type',
    'Tour Details',
    'Passengers',
    tourType === 'FIT' ? 'FIT Details' : 'Group Details',
    'Price Calculator',
    'Review'
  ];

  // Update step validity when tour type changes
  useEffect(() => {
    // Reset step validity when tour type changes
    setStepValidity(Array(steps.length).fill(false));
  }, [tourType]);

  // Update total pax when adults or children change
  useEffect(() => {
    setTourDetails(prev => ({
      ...prev,
      pax: {
        ...prev.pax,
        total: prev.pax.adults + prev.pax.children,
        isGroup: (prev.pax.adults + prev.pax.children) >= 8
      }
    }));
  }, [tourDetails.pax.adults, tourDetails.pax.children]);

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
    toast.success("Quote created successfully!");
    navigate("/quotes");
  };

  const handlePriceChange = (total: number, perPerson: number) => {
    setTotalPrice(total);
    setPerPersonPrice(perPerson);
  };

  // Use stepValidity to control Next button
  const isNextDisabled = () => {
    if (activeStep === 0) return !stepValidity[0];
    if (activeStep === 1) return !stepValidity[1];
    if (activeStep === 2) return !stepValidity[2];
    return false;
  };

  // Props for each step component
  const clientStepProps = {
    clientId,
    setClientId,
    onValidChange: (valid: boolean) => setStepValidity((prev) => {
      if (prev[0] === valid) return prev;
      const copy = [...prev];
      copy[0] = valid;
      return copy;
    }),
  };
  const tripStepProps = {
    quoteType,
    setQuoteType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedDestinations,
    setSelectedDestinations,
    onValidChange: (valid: boolean) => setStepValidity((prev) => {
      if (prev[1] === valid) return prev;
      const copy = [...prev];
      copy[1] = valid;
      return copy;
    }),
  };
  // Handle passenger field updates
  const handlePassengerChange = (field: 'adults' | 'children' | 'notes', value: string) => {
    setPassengers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const passengersStepProps = {
    adults: passengers.adults,
    setAdults: (value: string) => handlePassengerChange('adults', value),
    children: passengers.children,
    setChildren: (value: string) => handlePassengerChange('children', value),
    notes: passengers.notes,
    setNotes: (value: string) => handlePassengerChange('notes', value),
    onValidChange: (valid: boolean) => setStepValidity((prev) => {
      if (prev[2] === valid) return prev;
      const copy = [...prev];
      copy[2] = valid;
      return copy;
    }),
  };
  const priceCalculatorStepProps = { 
    onPriceChange: handlePriceChange,
    adults: passengers.adults,
    children: passengers.children,
    quoteType: quoteType as string,
    selectedDestinations,
    startDate,
    endDate
  };
  const reviewStepProps = { 
    clientId, 
    quoteType, 
    startDate, 
    endDate, 
    selectedDestinations, 
    adults: passengers.adults, 
    children: passengers.children, 
    notes: passengers.notes, 
    totalPrice, 
    perPersonPrice 
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
          {activeStep === 0 && <ClientInformationStep {...clientStepProps} />}
          {activeStep === 1 && <TripDetailsStep {...tripStepProps} />}
          {activeStep === 2 && <PassengersStep {...passengersStepProps} />}
          {activeStep === 3 && <PriceCalculatorStep {...priceCalculatorStepProps} />}
          {activeStep === 4 && <ReviewStep {...reviewStepProps} />}
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
