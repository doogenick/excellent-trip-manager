import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TourType } from "@/types/quotes";

interface TourTypeStepProps {
  tourType: TourType | '';
  setTourType: (type: TourType | '') => void;
  onValidChange: (valid: boolean) => void;
}

export function TourTypeStep({ tourType, setTourType, onValidChange }: TourTypeStepProps) {
  const handleChange = (value: string) => {
    setTourType(value as TourType | '');
    onValidChange(!!value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Tour Type</CardTitle>
        <CardDescription>Choose the type of tour you want to create</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={tourType} 
          onValueChange={handleChange}
          className="grid gap-4 md:grid-cols-2"
        >
          <div>
            <RadioGroupItem value="FIT" id="fit" className="peer sr-only" />
            <Label
              htmlFor="fit"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="font-medium">FIT Tour</div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                For 1-7 passengers. Ideal for individuals, couples, or small groups.
              </div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="GROUP" id="group" className="peer sr-only" />
            <Label
              htmlFor="group"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="font-medium">Group Tour</div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                For 8+ passengers. Perfect for larger groups with shared services.
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
