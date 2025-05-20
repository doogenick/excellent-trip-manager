
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardSteps } from "../Quotes/QuoteWizard/WizardSteps";
import { Passenger, EmergencyContact, AccommodationPreference, createEmptyPassenger, defaultAccommodationPreference } from "@/types/booking";

export function BookingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepValidity, setStepValidity] = useState<boolean[]>([false, false, false, false]);
  
  // Passenger information
  const [leadPassenger, setLeadPassenger] = useState<Passenger>(createEmptyPassenger());
  const [additionalPassengers, setAdditionalPassengers] = useState<Passenger[]>([]);
  
  // Emergency contact
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: "",
    relationship: "",
    phone: ""
  });
  
  // Accommodation preferences
  const [accommodationPreference, setAccommodationPreference] = useState<AccommodationPreference>(defaultAccommodationPreference);
  
  // Additional booking details
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const steps = [
    "Lead Passenger",
    "Additional Travelers",
    "Accommodation",
    "Payment",
    "Review & Confirm"
  ];
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleCreateBooking();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const handleCreateBooking = () => {
    // Here we would submit the booking data
    console.log("Creating booking with data:", {
      leadPassenger,
      additionalPassengers,
      emergencyContact,
      accommodationPreference,
      specialRequirements,
      paymentMethod,
      termsAccepted
    });
  };
  
  // Update step validity status
  const updateStepValidity = (step: number, isValid: boolean) => {
    setStepValidity(prev => {
      const newValidity = [...prev];
      newValidity[step] = isValid;
      return newValidity;
    });
  };
  
  const isNextDisabled = () => {
    // Check if current step is valid
    return !stepValidity[activeStep];
  };
  
  const handleLeadPassengerChange = (passenger: Passenger) => {
    setLeadPassenger(passenger);
  };
  
  const handleAddPassenger = () => {
    setAdditionalPassengers([...additionalPassengers, createEmptyPassenger()]);
  };
  
  const handleUpdatePassenger = (index: number, passenger: Passenger) => {
    const updatedPassengers = [...additionalPassengers];
    updatedPassengers[index] = passenger;
    setAdditionalPassengers(updatedPassengers);
  };
  
  const handleRemovePassenger = (index: number) => {
    setAdditionalPassengers(additionalPassengers.filter((_, i) => i !== index));
  };
  
  const handleEmergencyContactChange = (contact: EmergencyContact) => {
    setEmergencyContact(contact);
  };
  
  const handleAccommodationChange = (preference: Partial<AccommodationPreference>) => {
    setAccommodationPreference({
      ...accommodationPreference,
      ...preference
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Booking</CardTitle>
          <CardDescription>Step {activeStep + 1} of {steps.length}: {steps[activeStep]}</CardDescription>
          
          <WizardSteps steps={steps} activeStep={activeStep} />
        </CardHeader>
        <CardContent>
          {/* Step content would go here */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lead Passenger Information</h2>
              <p className="text-muted-foreground">
                Enter details for the main traveler who will be the primary contact for this booking.
              </p>
              {/* Lead passenger form fields would go here */}
            </div>
          )}
          
          {activeStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Additional Travelers</h2>
              <p className="text-muted-foreground">
                Add any additional travelers who will be joining on this trip.
              </p>
              {/* Additional passengers form would go here */}
            </div>
          )}
          
          {activeStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Accommodation Preferences</h2>
              <p className="text-muted-foreground">
                Select your preferred accommodation options for this trip.
              </p>
              {/* Accommodation preferences form would go here */}
            </div>
          )}
          
          {activeStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <p className="text-muted-foreground">
                Select your payment method and review the payment schedule.
              </p>
              {/* Payment information form would go here */}
            </div>
          )}
          
          {activeStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Review & Confirm</h2>
              <p className="text-muted-foreground">
                Please review all the booking information before confirming.
              </p>
              {/* Booking summary would go here */}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled()}>
            {activeStep === steps.length - 1 ? "Confirm Booking" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default BookingWizard;
