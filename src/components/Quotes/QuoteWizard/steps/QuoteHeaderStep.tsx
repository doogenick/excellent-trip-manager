import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TourType } from "@/types/quotes";

interface QuoteHeaderStepProps {
  referenceNumber: string;
  setReferenceNumber: (value: string) => void;
  autoGenerateReference: boolean;
  setAutoGenerateReference: (value: boolean) => void;
  issueDate: Date;
  setIssueDate: (date: Date) => void;
  validUntil: Date;
  setValidUntil: (date: Date) => void;
  travelYear: string;
  setTravelYear: (year: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  agentName: string;
  setAgentName: (name: string) => void;
  tourCode: string;
  setTourCode: (code: string) => void;
  tourType: TourType | "";
  setTourType: (type: TourType) => void;
  onValidChange: (valid: boolean) => void;
}

export function QuoteHeaderStep({
  referenceNumber,
  setReferenceNumber,
  autoGenerateReference,
  setAutoGenerateReference,
  issueDate,
  setIssueDate,
  validUntil,
  setValidUntil,
  travelYear,
  setTravelYear,
  clientName,
  setClientName,
  agentName,
  setAgentName,
  tourCode,
  setTourCode,
  tourType,
  setTourType,
  onValidChange
}: QuoteHeaderStepProps) {
  const [isClient, setIsClient] = useState(true);

  // Generate a reference number if auto-generate is enabled
  const generateReferenceNumber = () => {
    const prefix = "Q";
    const date = format(new Date(), "yyMMdd");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${date}-${random}`;
  };

  // Handle the auto-generate switch toggle
  const handleAutoGenerateChange = (checked: boolean) => {
    setAutoGenerateReference(checked);
    if (checked) {
      setReferenceNumber(generateReferenceNumber());
    }
  };

  // Validate the form and call onValidChange
  const validateForm = () => {
    const isValid = !!referenceNumber && !!clientName && !!tourType;
    onValidChange(isValid);
    return isValid;
  };

  // Update validation when form values change
  const handleChange = () => {
    validateForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Details</CardTitle>
        <CardDescription>Enter the basic information for this quote</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reference Number Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoGenerate"
                checked={autoGenerateReference}
                onCheckedChange={handleAutoGenerateChange}
              />
              <Label htmlFor="autoGenerate">Auto-generate</Label>
            </div>
          </div>
          
          <Input
            id="referenceNumber"
            placeholder="Enter reference number"
            value={referenceNumber}
            onChange={(e) => {
              setReferenceNumber(e.target.value);
              handleChange();
            }}
            disabled={autoGenerateReference}
            className="w-full"
          />
        </div>

        {/* Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !issueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={issueDate}
                  onSelect={(date) => {
                    if (date) {
                      setIssueDate(date);
                      handleChange();
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !validUntil && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validUntil ? format(validUntil, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={validUntil}
                  onSelect={(date) => {
                    if (date) {
                      setValidUntil(date);
                      handleChange();
                    }
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelYear">Travel Year</Label>
          <Select
            value={travelYear}
            onValueChange={(value) => {
              setTravelYear(value);
              handleChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select travel year" />
            </SelectTrigger>
            <SelectContent>
              {[new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Client/Agent Toggle */}
        <div className="flex space-x-4 pb-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${isClient ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setIsClient(true)}
          >
            Client
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${!isClient ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setIsClient(false)}
          >
            Agent
          </button>
        </div>

        {/* Client/Agent Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">{isClient ? 'Client Name' : 'Agent Name'}</Label>
            <Input
              id="clientName"
              placeholder={isClient ? "Enter client name" : "Enter agent name"}
              value={isClient ? clientName : agentName}
              onChange={(e) => {
                isClient ? setClientName(e.target.value) : setAgentName(e.target.value);
                handleChange();
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tourCode">Tour Code / Request Reference</Label>
            <Input
              id="tourCode"
              placeholder="Enter tour code or reference"
              value={tourCode}
              onChange={(e) => {
                setTourCode(e.target.value);
                handleChange();
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Tour Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="tourType">Tour Type</Label>
          <Select
            value={tourType}
            onValueChange={(value) => {
              setTourType(value as TourType);
              handleChange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tour type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TourType.ACCOMMODATED}>Accommodated Tour</SelectItem>
              <SelectItem value={TourType.CAMPING}>Camping Tour</SelectItem>
              <SelectItem value={TourType.COMBINATION}>Combination Tour</SelectItem>
              <SelectItem value={TourType.SELF_DRIVE}>Self-Drive Tour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
