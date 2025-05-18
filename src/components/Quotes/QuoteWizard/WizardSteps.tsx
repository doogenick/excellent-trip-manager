
import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

interface WizardStepsProps {
  steps: string[];
  activeStep: number;
}

export function WizardSteps({ steps, activeStep }: WizardStepsProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border transition-colors",
              activeStep >= index 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-muted text-muted-foreground border-muted"
            )}>
              {activeStep > index ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 transition-colors",
                activeStep > index ? "bg-primary" : "bg-muted"
              )}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
