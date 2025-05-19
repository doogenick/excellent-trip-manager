import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Download, Send, Calendar, Trash, Edit, Users } from "lucide-react";

interface QuoteDetailProps {
  quote?: {
    id: string;
    status: 'draft' | 'sent' | 'confirmed' | 'cancelled';
    quoteNumber: string;
    type: string;
    client: {
      name: string;
      email: string;
      phone: string;
    };
    trip: {
      type: string;
      startDate: string | Date;
      endDate: string | Date;
    };
    items: Array<{
      id: string;
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    passengers?: {
      adults: number;
      children: number;
    };
    travelDates?: {
      startDate: Date;
      endDate: Date;
    };
    itinerary?: any[];
    passengerDetails?: any[];
    costs?: any[];
  };
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function QuoteDetail({ quote: propQuote }: QuoteDetailProps) {
  const defaultQuote = {
    id: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "draft" as const,
    quoteNumber: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
    type: "Standard",
    client: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    trip: {
      type: "Standard",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    items: [
      {
        id: "1",
        name: "Standard Vehicle",
        description: "7-day rental",
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        id: "2",
        name: "Additional Driver",
        description: "Additional driver fee",
        quantity: 1,
        unitPrice: 100,
        total: 100,
      },
      {
        id: "3",
        name: "Insurance",
        description: "Full coverage",
        quantity: 1,
        unitPrice: 200,
        total: 200,
      },
    ],
    subtotal: 1500,
    tax: 150,
    total: 1650,
    passengers: {
      adults: 2,
      children: 1,
    },
    travelDates: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    itinerary: [],
    passengerDetails: [],
    costs: [],
  };

  const quote = propQuote || defaultQuote;
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleEdit = () => {
    console.log('Edit quote:', quote.id);
  };

  const handleSendQuote = () => {
    console.log('Send quote:', quote.id);
  };

  const handleCreateBooking = () => {
    console.log('Create booking for quote:', quote.id);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    console.log('Delete quote:', quote.id);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const totalPassengers = (quote.passengers?.adults || 0) + (quote.passengers?.children || 0);
  const duration = quote.travelDates 
    ? Math.round((new Date(quote.travelDates.endDate).getTime() - new Date(quote.travelDates.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
    items: [
      {
        id: "1",
        name: "Standard Vehicle",
        description: "7-day rental",
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        id: "2",
        name: "Additional Driver",
        description: "Additional driver fee",
        quantity: 1,
        unitPrice: 100,
        total: 100,
      },
      {
        id: "3",
        name: "Insurance",
        description: "Full coverage",
        quantity: 1,
        unitPrice: 200,
        total: 200,
      },
    ],
    subtotal: 1500,
    tax: 150,
    total: 1650,
  };

  const currentQuote = quote || defaultQuote;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quote Details</h1>
          <p className="text-muted-foreground">View and manage quote information</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            Export
          </Button>
          <Button>
            Send to Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Quote Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quote Number</p>
                <p className="font-medium">{currentQuote.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline">{currentQuote.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Created</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client Name</p>
                <p className="font-medium">{currentQuote.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{currentQuote.client.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{currentQuote.client.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Trip Details</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>This section shows the trip details including dates and type.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Trip Type</p>
                <p className="font-medium">{currentQuote.trip.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(currentQuote.trip.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(currentQuote.trip.endDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cost Breakdown</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>This section shows the financial breakdown of the quote, including items and totals.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentQuote.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold">
                  <TableCell colSpan={4} className="text-right">Subtotal</TableCell>
                  <TableCell className="text-right">{formatCurrency(currentQuote.subtotal)}</TableCell>
                </TableRow>
                <TableRow className="font-semibold">
                  <TableCell colSpan={4} className="text-right">Tax (10%)</TableCell>
                  <TableCell className="text-right">{formatCurrency(currentQuote.tax)}</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell colSpan={4} className="text-right text-lg">Total</TableCell>
                  <TableCell className="text-right text-lg">{formatCurrency(currentQuote.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Send to Client</Button>
        </div>
      </div>
    </div>
  );
}

export default QuoteDetail;
    profitPerPax: 0,
  }), []);
  
  const { profitReview = defaultProfitReview } = useTourCalculator(
    quote?.itinerary || [],
    totalPassengers,
    baseRate,
    {
      pax: totalPassengers,
      minProfitPerDay: 1200,
      fuelInTotal: 15956,
      fuelOutTotal: 9372,
      currencyRate: 1.0,
    }
  ) || { profitReview: defaultProfitReview };
  
  // Calculate base rate (simplified - adjust based on your pricing logic)
  const baseRate = useMemo(() => {
    if (!quote) return 0;
    return quote.totalCost / (quote.itinerary?.length || 1) / Math.max(1, totalPassengers);
  }, [quote, totalPassengers]);
  

  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!quote) {
    return <div className="p-8 text-center">Quote not found</div>;
  }
  
  // Ensure quote has necessary properties
  const safeQuote = {
    ...quote,
    passengers: quote.passengers || { adults: 0, children: 0 },
    travelDates: quote.travelDates || { startDate: new Date(), endDate: new Date() },
    itinerary: quote.itinerary || [],
    passengerDetails: quote.passengerDetails || [],
    costs: (quote.costs || []) as ExtendedCostItem[]
  };
  
  const duration = Math.round((safeQuote.travelDates.endDate.getTime() - safeQuote.travelDates.startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const handleEdit = () => {
    toast.info("Edit functionality will be implemented in the next version");
  };
  
  const handleSendQuote = () => {
    toast.success("Quote sent successfully!");
  };
  
  const handleCreateBooking = () => {
    toast.info("Booking functionality will be implemented in the next version");
  };
  
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    toast.success("Quote deleted successfully!");
    navigate("/quotes");
  };
  
  return (
    <>
      <div className="p-6 space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {safeQuote.quoteNumber}
                  <Badge className={getStatusBadgeColor(safeQuote.status)}>
                    {safeQuote.status.charAt(0).toUpperCase() + safeQuote.status.slice(1)}
                  </Badge>
                </h1>
                <p className="text-muted-foreground">{safeQuote.type}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {safeQuote.status === "draft" && (
                  <>
                    <Button variant="outline" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button onClick={handleSendQuote}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Quote
                    </Button>
                  </>
                )}
                
                {safeQuote.status === "sent" && (
                  <>
                    <Button variant="outline" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button onClick={handleSendQuote}>
                      <Send className="h-4 w-4 mr-2" />
                      Resend Quote
                    </Button>
                  </>
                )}
                
                {safeQuote.status === "confirmed" && (
                  <Button onClick={handleCreateBooking} className="bg-savanna-500 hover:bg-savanna-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Booking
                  </Button>
                )}
                
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            {/* Profit Review Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Profit Analysis</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>This section shows the financial breakdown of the quote, including revenue, expenses, and profit margins.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {quote?.itinerary?.length > 0 ? (
                <ProfitReview 
                  summary={profitReview} 
                  className="border rounded-lg p-4 bg-card"
                />
              ) : (
                <div className="text-center p-8 border rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">
                    Add itinerary items to see profit analysis
                  </p>
                </div>
              )}
            </div>
            
            {/* Trip Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Client</CardDescription>
                  <CardTitle className="text-lg">{quote.clientAgent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {quote.clientAgent.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {quote.clientAgent.phone}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Trip Duration</CardDescription>
                  <CardTitle className="text-lg">{duration} days</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {quote.travelDates.startDate.toLocaleDateString()} - {quote.travelDates.endDate.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Passengers</CardDescription>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <CardTitle className="text-lg">{totalPassengers}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {quote.passengers.adults} Adults, {quote.passengers.children} Children
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Itinerary Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              {quote.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {quote.itinerary.map((day) => (
                    <Card key={day.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">Day {day.day}</h3>
                            <p className="text-sm text-muted-foreground">
                              {day.date.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">{day.description}</p>
                        {day.accommodation && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Accommodation:</span> {day.accommodation}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">No itinerary items added yet</p>
                </div>
              )}
            </div>
            
            {/* Cost Breakdown Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Cost Breakdown</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.costItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">
                            {quote.currency} {item.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {quote.currency} {quote.totalCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quote {quote.quoteNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>This section shows the financial breakdown of the quote, including revenue, expenses, and profit margins.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {quote?.itinerary?.length > 0 ? (
                <ProfitReview 
                  summary={profitReview} 
                  className="border rounded-lg p-4 bg-card"
                />
              ) : (
                <div className="text-center p-8 border rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">
                    Add itinerary items to see profit analysis
                  </p>
                </div>
              )}
            </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {quote.quoteNumber}
              <Badge className={getStatusBadgeColor(quote.status)}>
                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </Badge>
            </h1>
            <p className="text-muted-foreground">{quote.type}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quote.status === "draft" && (
              <>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleSendQuote}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Quote
                </Button>
              </>
            )}
            
            {quote.status === "sent" && (
              <>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleSendQuote}>
                  <Send className="h-4 w-4 mr-2" />
                  Resend Quote
                </Button>
              </>
            )}
            
            {quote.status === "confirmed" && (
              <Button onClick={handleCreateBooking} className="bg-savanna-500 hover:bg-savanna-600">
                <Calendar className="h-4 w-4 mr-2" />
                Create Booking
              </Button>
            )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>This section shows the financial breakdown of the quote, including revenue, expenses, and profit margins.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {quote?.itinerary?.length > 0 ? (
            <ProfitReview 
              summary={profitReview} 
              className="border rounded-lg p-4 bg-card"
            />
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">
                Add itinerary items to see profit analysis
              </p>
            </div>
          )}
        </div>
        

            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="font-medium">{quote.clientAgent.name}</div>
                  <div className="text-sm text-muted-foreground">{quote.clientAgent.company}</div>
                </div>
                <div className="text-sm">
                  <div>{quote.clientAgent.email}</div>
                  <div>{quote.clientAgent.phone}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="font-medium">Dates</div>
                  <div className="text-sm">
                    {quote.travelDates.startDate.toLocaleDateString()} - {quote.travelDates.endDate.toLocaleDateString()}
                    <span className="text-muted-foreground ml-1">({duration} days)</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Destinations</div>
                  <div className="text-sm">
                    {quote.destinations.map((dest, i) => (
                      <span key={dest.id}>
                        {dest.name}, {dest.country}
                        {i < quote.destinations.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Passengers</div>
                  <div className="text-sm">
                    {quote.passengers.adults} {quote.passengers.adults === 1 ? "Adult" : "Adults"}
                    {quote.passengers.children > 0 && (
                      <>, {quote.passengers.children} {quote.passengers.children === 1 ? "Child" : "Children"}</>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Selling Price:</span>
                  <span className="font-medium">${quote.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Currency:</span>
                  <span>{quote.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Quote Version:</span>
                  <span>{quote.version}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        

            </TabsTrigger>
            <TabsTrigger value="costs">
              <FileText className="h-4 w-4 mr-2" />
              Costs
            </TabsTrigger>
            <TabsTrigger value="passengers">
              <Users className="h-4 w-4 mr-2" />
              Passengers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
                <CardDescription>Day by day breakdown of the trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quote.itinerary.map((item) => (
                    <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Day {item.day}: {item.date.toLocaleDateString()}</h3>
                        <div className="text-sm text-muted-foreground">
                          {item.meals.breakfast && "B"}
                          {item.meals.lunch && item.meals.breakfast && " • "}
                          {item.meals.lunch && "L"}
                          {item.meals.dinner && (item.meals.breakfast || item.meals.lunch) && " • "}
                          {item.meals.dinner && "D"}
                        </div>
                      </div>
                      <p className="mb-2">{item.description}</p>
                      {item.accommodation && (
                        <div className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Accommodation:</span> {item.accommodation}
                        </div>
                      )}
                      {item.activities.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Activities:</span> {item.activities.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="costs" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Detailed cost information</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Supplier Rate</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                      <TableHead className="text-right">Selling Rate</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quote.costItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">${item.supplierRate}</TableCell>
                        <TableCell className="text-right">{item.margin}%</TableCell>
                        <TableCell className="text-right">${item.sellingRate}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.total}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">${quote.totalCost}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate PDF
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          

                  {quote.passengerDetails.length === 0 
                    ? "No passenger details have been added yet"
                    : "List of passengers on this trip"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quote.passengerDetails.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">No passenger details have been added to this quote yet</p>
                    <Button onClick={() => toast.info("This functionality will be added in the next version")}>
                      Add Passengers
                    </Button>
                  </div>
                ) : (
                  <div>Passenger list would appear here</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
            </div>
          </div>
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quote {quote.quoteNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
