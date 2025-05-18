
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockQuotes } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Quote, QuoteStatus, QuoteType } from "@/types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

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

export function QuotesList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  
  // Filter quotes based on search query and filters
  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.clientAgent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.clientAgent.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.destinations.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter ? quote.status === statusFilter : true;
    const matchesType = typeFilter ? quote.type === typeFilter : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Create sets of unique quote types and statuses for filters
  const quoteTypes = Array.from(new Set(mockQuotes.map(q => q.type)));
  const statuses = Array.from(new Set(mockQuotes.map(q => q.status)));
  
  const handleRowClick = (quote: Quote) => {
    navigate(`/quotes/${quote.id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>Manage and view all your quotes</CardDescription>
        </div>
        <Button onClick={() => navigate('/quotes/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                {quoteTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote #</TableHead>
              <TableHead>Client/Agent</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Value</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <TableRow 
                  key={quote.id}
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => handleRowClick(quote)}
                >
                  <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                  <TableCell>
                    <div>{quote.clientAgent.name}</div>
                    <div className="text-xs text-muted-foreground">{quote.clientAgent.company}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{quote.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quote.travelDates.startDate.toLocaleDateString()} - {quote.travelDates.endDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(quote.status)}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${quote.totalCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(quote.updatedAt, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32">
                  <div className="text-muted-foreground">No quotes found matching your filters</div>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("");
                      setTypeFilter("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
