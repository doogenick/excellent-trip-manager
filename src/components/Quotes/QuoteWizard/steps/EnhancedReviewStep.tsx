
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuoteType } from "@/types";
import { format } from "date-fns";
import { CalendarDays, Users, Map, CalendarRange, Clipboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface EnhancedReviewStepProps {
  clientId: string;
  quoteType: QuoteType | "";
  startDate?: Date;
  endDate?: Date;
  selectedDestinations: string[];
  adults: string;
  children: string;
  notes: string;
  totalPrice: number;
  perPersonPrice: number;
  itinerary: ItineraryItem[];
  inclusions: InclusionItem[];
  exclusions: InclusionItem[];
  priceTiers: PriceTier[];
  currency: string;
}

export function EnhancedReviewStep({
  clientId,
  quoteType,
  startDate,
  endDate,
  selectedDestinations,
  adults,
  children,
  notes,
  totalPrice,
  perPersonPrice,
  itinerary,
  inclusions,
  exclusions,
  priceTiers,
  currency
}: EnhancedReviewStepProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "Not set";
    return format(date, "PPP");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  const totalPassengers = parseInt(adults) + parseInt(children);

  const getDuration = () => {
    if (!startDate || !endDate) return "Not set";
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} days`;
  };
  
  const getMealsLabel = (item: ItineraryItem) => {
    const meals = [];
    if (item.meals.breakfast) meals.push('B');
    if (item.meals.lunch) meals.push('L');
    if (item.meals.dinner) meals.push('D');
    return meals.length > 0 ? meals.join(',') : '-';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Quote Summary</h2>
      
      {/* Basic Info Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Type:</div>
              <div className="font-medium">{quoteType || "Not specified"}</div>
              
              <div className="text-muted-foreground">Start Date:</div>
              <div className="font-medium">{formatDate(startDate)}</div>
              
              <div className="text-muted-foreground">End Date:</div>
              <div className="font-medium">{formatDate(endDate)}</div>
              
              <div className="text-muted-foreground">Duration:</div>
              <div className="font-medium">{getDuration()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Passengers & Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Client:</div>
              <div className="font-medium">{clientId || "Not specified"}</div>
              
              <div className="text-muted-foreground">Adults:</div>
              <div className="font-medium">{adults}</div>
              
              <div className="text-muted-foreground">Children:</div>
              <div className="font-medium">{children}</div>
              
              <div className="text-muted-foreground">Total Passengers:</div>
              <div className="font-medium">{totalPassengers}</div>
            </div>
            
            {notes && (
              <div className="pt-2 border-t mt-2">
                <div className="text-muted-foreground text-sm mb-1">Notes:</div>
                <div className="text-sm">{notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Destinations */}
      {selectedDestinations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedDestinations.map(destination => (
                <Badge key={destination} variant="outline">{destination}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Accordion for detailed sections */}
      <Accordion type="single" collapsible className="w-full">
        {/* Itinerary */}
        <AccordionItem value="itinerary">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Itinerary ({itinerary.length} days)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {itinerary.length === 0 ? (
              <Alert>
                <AlertDescription>No itinerary has been created yet.</AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-md overflow-x-auto mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Day</TableHead>
                      <TableHead>Locations</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Accommodation</TableHead>
                      <TableHead className="w-[80px]">Meals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.day}
                        </TableCell>
                        <TableCell>
                          {item.startLocation} → {item.endLocation}
                        </TableCell>
                        <TableCell>
                          {item.activity || "-"}
                        </TableCell>
                        <TableCell>
                          {item.accommodation ? `${item.accommodation} (${item.accommodationType})` : "-"}
                        </TableCell>
                        <TableCell>
                          {getMealsLabel(item)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        
        {/* Pricing */}
        <AccordionItem value="pricing">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Pricing Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Base Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Currency:</div>
                      <div className="font-medium">{currency}</div>
                      
                      <div className="text-muted-foreground">Base Price Per Person:</div>
                      <div className="font-medium">{formatCurrency(perPersonPrice)}</div>
                      
                      <div className="text-muted-foreground">Total for {totalPassengers} passengers:</div>
                      <div className="font-medium">{formatCurrency(totalPrice)}</div>
                    </div>
                  </CardContent>
                </Card>
                
                {priceTiers.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tiered Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Passengers</TableHead>
                            <TableHead>Price Per Person</TableHead>
                            <TableHead>Single Supplement</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {priceTiers.map((tier) => (
                            <TableRow key={tier.id}>
                              <TableCell className="font-medium">
                                {tier.minPax === tier.maxPax ? tier.minPax : `${tier.minPax}-${tier.maxPax}`}
                              </TableCell>
                              <TableCell>{formatCurrency(tier.pricePerPerson)}</TableCell>
                              <TableCell>{formatCurrency(tier.singleSupplement)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Inclusions & Exclusions */}
        <AccordionItem value="inclusions-exclusions">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Inclusions & Exclusions
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Included in the Price:</h3>
                {inclusions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {inclusions.map(item => (
                      <li key={item.id}>{item.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No inclusions specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Not Included in the Price:</h3>
                {exclusions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {exclusions.map(item => (
                      <li key={item.id}>{item.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No exclusions specified.</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default EnhancedReviewStep;
