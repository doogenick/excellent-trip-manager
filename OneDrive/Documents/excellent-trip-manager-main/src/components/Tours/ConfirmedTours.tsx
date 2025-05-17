
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockQuotes } from "@/data/mockData";
import { Truck, Calendar, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Quote } from "@/types";

export function ConfirmedTours() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>("");
  
  // Get only confirmed quotes
  const confirmedTours = mockQuotes.filter(quote => quote.status === "confirmed");
  
  // Filter tours based on search query and filters
  const filteredTours = confirmedTours.filter(tour => {
    const matchesSearch = 
      tour.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.clientAgent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.clientAgent.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destinations.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // For demo purposes, assuming vehicle type can be derived from quote type
    const hasVehicle = (tour: Quote) => {
      if (tour.type === "Truck Rental") return "truck";
      if (tour.type === "Transfer Request") return "van";
      if (tour.passengers.adults + (tour.passengers.children || 0) >= 8) return "truck";
      return "car";
    };
    
    const getMonth = (date: Date) => {
      return date.toLocaleString('default', { month: 'long' });
    };
    
    const matchesVehicle = vehicleFilter ? hasVehicle(tour) === vehicleFilter : true;
    const matchesMonth = monthFilter ? getMonth(tour.travelDates.startDate) === monthFilter : true;
    
    return matchesSearch && matchesVehicle && matchesMonth;
  });
  
  // Get unique months from confirmed tours
  const months = Array.from(
    new Set(
      confirmedTours.map(tour => 
        tour.travelDates.startDate.toLocaleString('default', { month: 'long' })
      )
    )
  ).sort((a, b) => {
    const monthOrder = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
  });
  
  const handleRowClick = (tour: Quote) => {
    navigate(`/quotes/${tour.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Confirmed Tours
        </CardTitle>
        <CardDescription>Track and manage confirmed tours for operations scheduling</CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tours..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-months">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-vehicles">All Vehicles</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="car">Car</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tour #</TableHead>
              <TableHead>Client/Agent</TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Start Date</span>
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>End Date</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Pax</span>
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Vehicle</span>
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Destinations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => {
                const duration = Math.round(
                  (tour.travelDates.endDate.getTime() - tour.travelDates.startDate.getTime()) / 
                  (1000 * 60 * 60 * 24)
                );
                
                // For demo purposes, derive vehicle type from quote type and passenger count
                const getVehicleType = () => {
                  if (tour.type === "Truck Rental") return "Truck";
                  if (tour.type === "Transfer Request") return "Van";
                  if (tour.passengers.adults + (tour.passengers.children || 0) >= 8) return "Truck";
                  return "Car";
                };
                
                return (
                  <TableRow 
                    key={tour.id}
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => handleRowClick(tour)}
                  >
                    <TableCell className="font-medium">{tour.quoteNumber}</TableCell>
                    <TableCell>
                      <div>{tour.clientAgent.name}</div>
                      <div className="text-xs text-muted-foreground">{tour.clientAgent.company}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {tour.travelDates.startDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {tour.travelDates.endDate.toLocaleDateString()}
                      <span className="text-xs text-muted-foreground ml-1">({duration} days)</span>
                    </TableCell>
                    <TableCell>
                      {tour.passengers.adults + (tour.passengers.children || 0)} pax
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">
                        {getVehicleType()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="truncate max-w-[200px]">
                        {tour.destinations.map(d => d.name).join(", ")}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32">
                  <div className="text-muted-foreground">No tours found matching your criteria</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
