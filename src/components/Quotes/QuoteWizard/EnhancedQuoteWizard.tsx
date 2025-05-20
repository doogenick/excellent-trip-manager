
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuoteType } from "@/types";
import { WizardSteps } from "./WizardSteps";
import { ClientInformationStep } from "./steps/ClientInformationStep";
import { TripDetailsStep } from "./steps/TripDetailsStep";
import { PassengersStep } from "./steps/PassengersStep";
import { PriceCalculatorStep } from "./steps/PriceCalculatorStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ItineraryStep } from "./steps/ItineraryStep";
import { InclusionsExclusionsStep } from "./steps/InclusionsExclusionsStep";
import { PricingStep } from "./steps/PricingStep";

// Define interfaces for the components
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

interface InclusionItem {
  id: string;
  text: string;
}

interface PriceTier {
  id: string;
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
  singleSupplement: number;
}

export function EnhancedQuoteWizard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // Step 1: Client Information
  const [clientId, setClientId] = useState("");
  
  // Step 2: Trip Details
  const [quoteType, setQuoteType] = useState<QuoteType | "">("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  
  // Step 3: Passengers
  const [passengers, setPassengers] = useState({
    adults: "2",
    children: "0",
    notes: ""
  });
  
  // Step 4: Itinerary
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  
  // Step 5: Price Calculator
  const [totalPrice, setTotalPrice] = useState(0);
  const [perPersonPrice, setPerPersonPrice] = useState(0);
  
  // Step 6: Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<InclusionItem[]>([]);
  const [exclusions, setExclusions] = useState<InclusionItem[]>([]);
  
  // Step 7: Pricing Tiers
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [currency, setCurrency] = useState("USD");
  
  // Track validity for each step
  const [stepValidity, setStepValidity] = useState<boolean[]>([
    false, // Client Info
    false, // Trip Details
    false, // Passengers
    false, // Itinerary
    true,  // Price Calculator (always valid)
    false, // Inclusions/Exclusions
    false, // Pricing
    true   // Review (always valid)
  ]);

  const steps = [
    "Client Information",
    "Trip Details",
    "Passengers",
    "Itinerary",
    "Price Calculator",
    "Inclusions & Exclusions",
    "Pricing",
    "Review"
  ];

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
    return !stepValidity[activeStep];
  };

  // Handle passenger field updates
  const handlePassengerChange = (field: 'adults' | 'children' | 'notes', value: string) => {
    setPassengers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update validity for a specific step
  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidity(prev => {
      if (prev[step] === isValid) return prev;
      const copy = [...prev];
      copy[step] = isValid;
      return copy;
    });
  };

  // Props for each step component
  const clientStepProps = {
    clientId,
    setClientId,
    onValidChange: (valid: boolean) => updateStepValidity(0, valid),
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
    onValidChange: (valid: boolean) => updateStepValidity(1, valid),
  };
  
  const passengersStepProps = {
    adults: passengers.adults,
    setAdults: (value: string) => handlePassengerChange('adults', value),
    children: passengers.children,
    setChildren: (value: string) => handlePassengerChange('children', value),
    notes: passengers.notes,
    setNotes: (value: string) => handlePassengerChange('notes', value),
    onValidChange: (valid: boolean) => updateStepValidity(2, valid),
  };
  
  const itineraryStepProps = {
    itinerary,
    startDate,
    onItineraryChange: setItinerary,
    onValidChange: (valid: boolean) => updateStepValidity(3, valid),
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
  
  const inclusionsExclusionsStepProps = {
    inclusions,
    exclusions,
    onInclusionsChange: setInclusions,
    onExclusionsChange: setExclusions,
    onValidChange: (valid: boolean) => updateStepValidity(5, valid),
  };
  
  const pricingStepProps = {
    priceTiers,
    onPriceTiersChange: setPriceTiers,
    baseCostPerPerson: perPersonPrice,
    currency,
    onCurrencyChange: setCurrency,
    onValidChange: (valid: boolean) => updateStepValidity(6, valid),
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
    perPersonPrice,
    itinerary,
    inclusions,
    exclusions,
    priceTiers,
    currency
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6">
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
          {activeStep === 3 && <ItineraryStep {...itineraryStepProps} />}
          {activeStep === 4 && <PriceCalculatorStep {...priceCalculatorStepProps} />}
          {activeStep === 5 && <InclusionsExclusionsStep {...inclusionsExclusionsStepProps} />}
          {activeStep === 6 && <PricingStep {...pricingStepProps} />}
          {activeStep === 7 && <ReviewStep {...reviewStepProps} />}
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

export default EnhancedQuoteWizard;
