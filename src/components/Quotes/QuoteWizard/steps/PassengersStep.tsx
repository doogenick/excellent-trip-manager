
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { passengersSchema, PassengersSchema } from "../quoteWizardSchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PassengersStepProps {
  adults: string;
  setAdults: (value: string) => void;
  children: string;
  setChildren: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export function PassengersStep({ 
  adults, setAdults, children, setChildren, notes, setNotes, onValidChange 
}: PassengersStepProps) {
  const {
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<PassengersSchema>({
    resolver: zodResolver(passengersSchema),
    mode: "onChange",
    defaultValues: { adults, children, notes },
  });

  useEffect(() => {
    setValue("adults", adults);
    setValue("children", children);
    setValue("notes", notes);
    trigger();
  }, [adults, children, notes, setValue, trigger]);

  useEffect(() => {
    if (onValidChange) onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults">Number of Adults</Label>
          <Input
            id="adults"
            type="number"
            min="1"
            value={adults}
            onChange={(e) => {
              setAdults(e.target.value);
              setValue("adults", e.target.value);
              trigger();
            }}
          />
          {errors.adults && (
            <div className="text-destructive text-xs mt-1">{errors.adults.message}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">Number of Children</Label>
          <Input
            id="children"
            type="number"
            min="0"
            value={children}
            onChange={(e) => {
              setChildren(e.target.value);
              setValue("children", e.target.value);
              trigger();
            }}
          />
          {errors.children && (
            <div className="text-destructive text-xs mt-1">{errors.children.message}</div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any special requirements or information"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setValue("notes", e.target.value);
            trigger();
          }}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
