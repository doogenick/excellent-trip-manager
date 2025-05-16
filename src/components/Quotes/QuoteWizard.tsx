
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { mockClientAgents, mockDestinations } from "@/data/mockData";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { QuoteType } from "@/types";

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
  
  const steps = [
    "Client Information",
    "Trip Details",
    "Passengers",
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
  
  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !clientId;
      case 1:
        return !quoteType || !startDate || !endDate || selectedDestinations.length === 0;
      case 2:
        return !adults || parseInt(adults) < 1;
      default:
        return false;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quote</CardTitle>
          <CardDescription>Step {activeStep + 1} of {steps.length}: {steps[activeStep]}</CardDescription>
          
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
        </CardHeader>
        <CardContent>
          {activeStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client/Agent</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select a client or agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClientAgents.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.company ? `(${client.company})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Can't find the client?</span>
                <Button variant="link" className="p-0 h-auto" onClick={() => toast.info("Client creation will be implemented in the next version")}>
                  Add new client
                </Button>
              </div>
            </div>
          )}
          
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quote-type">Quote Type</Label>
                <Select value={quoteType} onValueChange={(value) => setQuoteType(value as QuoteType)}>
                  <SelectTrigger id="quote-type">
                    <SelectValue placeholder="Select quote type" />
                  </SelectTrigger>
                  <SelectContent>
                    {quoteTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                <Tabs 
                  defaultValue="list" 
                  className="w-full"
                >
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
          )}
          
          {activeStep === 2 && (
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
          )}
          
          {activeStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review Quote Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Client/Agent</div>
                  <div>{mockClientAgents.find(c => c.id === clientId)?.name}</div>
                  <div className="text-sm text-muted-foreground">{mockClientAgents.find(c => c.id === clientId)?.company}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Quote Type</div>
                  <div>{quoteType}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Travel Dates</div>
                  <div>
                    {startDate && format(startDate, "PPP")} - {endDate && format(endDate, "PPP")}
                    {startDate && endDate && (
                      <span className="text-sm text-muted-foreground ml-1">
                        ({Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Passengers</div>
                  <div>
                    {adults} {parseInt(adults) === 1 ? "Adult" : "Adults"}
                    {parseInt(children) > 0 && (
                      <>, {children} {parseInt(children) === 1 ? "Child" : "Children"}</>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Destinations</div>
                  <div>
                    {selectedDestinations.map(id => {
                      const dest = mockDestinations.find(d => d.id === id);
                      return dest ? `${dest.name}, ${dest.country}` : "";
                    }).join(" • ")}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm">{notes || "No additional notes"}</div>
                </div>
              </div>
              
              <div className="bg-sand-50 border border-sand-200 rounded-md p-4">
                <p className="text-sm">Upon creating this quote, you will be able to:</p>
                <ul className="text-sm list-disc list-inside mt-2">
                  <li>Add detailed itinerary items</li>
                  <li>Add cost elements and pricing</li>
                  <li>Generate a PDF quote to send to the client</li>
                </ul>
              </div>
            </div>
          )}
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
