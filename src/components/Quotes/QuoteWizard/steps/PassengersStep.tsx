
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
}

export function PassengersStep({ 
  adults, setAdults, children, setChildren, notes, setNotes 
}: PassengersStepProps) {
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
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">Number of Children</Label>
          <Input
            id="children"
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any special requirements or information"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
