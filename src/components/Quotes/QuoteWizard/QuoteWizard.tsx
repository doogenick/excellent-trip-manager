
import { useState } from "react";
import { Button } from "../../ui/button";
// DEBUG: changed from alias to relative import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
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

export function QuoteWizard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [clientId, setClientId] = useState("");
  const [quoteType, setQuoteType] = useState<QuoteType | "">("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [notes, setNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [perPersonPrice, setPerPersonPrice] = useState(0);

  // Track validity for each step
  const [stepValidity, setStepValidity] = useState<boolean[]>([false, false, false]);

  const steps = [
    "Client Information",
    "Trip Details",
    "Passengers",
    "Price Calculator",
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
  const passengersStepProps = {
    adults,
    setAdults,
    children,
    setChildren,
    notes,
    setNotes,
    onValidChange: (valid: boolean) => setStepValidity((prev) => {
      if (prev[2] === valid) return prev;
      const copy = [...prev];
      copy[2] = valid;
      return copy;
    }),
  };
  const priceCalculatorStepProps = { 
    onPriceChange: handlePriceChange,
    adults,
    children,
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
    adults, 
    children, 
    notes, 
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
