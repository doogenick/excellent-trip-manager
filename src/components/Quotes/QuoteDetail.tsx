
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

  // Removed the duplicate object declaration that was causing the syntax error

  const currentQuote = quote || defaultQuote;

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
