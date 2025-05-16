
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuoteById } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuoteStatus } from "@/types";
import { Edit, FileText, Send, Trash, Calendar, Users } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function getStatusBadgeColor(status: QuoteStatus) {
  switch (status) {
    case "draft":
      return "bg-muted text-muted-foreground hover:bg-muted";
    case "sent":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "confirmed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted";
  }
}

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quote = getQuoteById(id || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  if (!quote) {
    return <div className="p-8 text-center">Quote not found</div>;
  }
  
  const duration = Math.round((quote.travelDates.endDate.getTime() - quote.travelDates.startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const handleEdit = () => {
    // Would navigate to edit page
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
      <div className="p-6 space-y-6">
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
            
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Client/Agent Information</CardTitle>
            </CardHeader>
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
        
        <Tabs defaultValue="itinerary">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="itinerary">
              <Calendar className="h-4 w-4 mr-2" />
              Itinerary
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
          
          <TabsContent value="passengers" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Details</CardTitle>
                <CardDescription>
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
        </Tabs>
      </div>
      
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
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Helper Table components for the costs tab
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
);

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />
);

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
);

// Add cn helper function since we're using it
import { cn } from "@/lib/utils";
