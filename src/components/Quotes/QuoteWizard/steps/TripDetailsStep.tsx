
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { mockDestinations } from "@/data/mockData";
import { QuoteType } from "@/types";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { tripDetailsSchema, TripDetailsSchema } from "../quoteWizardSchemas";

interface TripDetailsStepProps {
  quoteType: QuoteType | "";
  setQuoteType: (value: QuoteType) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  selectedDestinations: string[];
  setSelectedDestinations: (destinations: string[]) => void;
  onValidChange?: (isValid: boolean) => void;
}

const quoteTypes: QuoteType[] = [
  "Truck Rental",
  "Transfer Request",
  "Private Nomad Schedule Tour",
  "Language Guided Tour",
  "Tailor-made Tour",
  "Bachelor/et Party",
  "Southern Africa Tour",
  "East Africa Tour",
  "FIT Tour"
];

export function TripDetailsStep({ 
  quoteType, setQuoteType, 
  startDate, setStartDate, 
  endDate, setEndDate, 
  selectedDestinations, setSelectedDestinations,
  onValidChange
}: TripDetailsStepProps) {
  const {
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<TripDetailsSchema>({
    resolver: zodResolver(tripDetailsSchema),
    mode: "onChange",
    defaultValues: {
      quoteType: quoteType || "",
      startDate,
      endDate,
      selectedDestinations,
    },
  });

  // Keep form state in sync with wizard state
  useEffect(() => {
    setValue("quoteType", quoteType || "");
    setValue("startDate", startDate);
    setValue("endDate", endDate);
    setValue("selectedDestinations", selectedDestinations);
    trigger();
  }, [quoteType, startDate, endDate, selectedDestinations, setValue, trigger]);

  // Notify wizard of validity
  useEffect(() => {
    if (onValidChange) onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="quote-type">Quote Type</Label>
        <Select value={quoteType} onValueChange={(value) => {
          setQuoteType(value as QuoteType);
          setValue("quoteType", value as QuoteType);
          trigger();
        }}>
          <SelectTrigger id="quote-type">
            <SelectValue placeholder="Select quote type" />
          </SelectTrigger>
          <SelectContent>
            {quoteTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.quoteType && (
          <div className="text-destructive text-xs mt-1">{errors.quoteType.message}</div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                onClick={() => {
                  setValue("startDate", startDate);
                  trigger();
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setValue("startDate", date);
                  trigger();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <div className="text-destructive text-xs mt-1">{errors.startDate.message}</div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
                onClick={() => {
                  setValue("endDate", endDate);
                  trigger();
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick an end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => 
                  (startDate ? date < startDate : false) || 
                  date < new Date()
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Destinations</Label>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="list">Select from List</TabsTrigger>
            <TabsTrigger value="custom">Add Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockDestinations.map(destination => (
                <div 
                  key={destination.id}
                  className={cn(
                    "border rounded-md px-3 py-2 cursor-pointer transition-colors",
                    selectedDestinations.includes(destination.id)
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    if (selectedDestinations.includes(destination.id)) {
                      setSelectedDestinations(selectedDestinations.filter(id => id !== destination.id));
                    } else {
                      setSelectedDestinations([...selectedDestinations, destination.id]);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{destination.name}</div>
                      <div className="text-xs text-muted-foreground">{destination.country}</div>
                    </div>
                    {selectedDestinations.includes(destination.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="custom">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Destination</Label>
                <div className="flex gap-2">
                  <Input placeholder="Destination name" />
                  <Input placeholder="Country" />
                  <Button onClick={() => toast.info("Custom destinations will be implemented in the next version")}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {selectedDestinations.length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Selected:</span>{" "}
            {selectedDestinations.map(id => {
              const dest = mockDestinations.find(d => d.id === id);
              return dest?.name;
            }).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
