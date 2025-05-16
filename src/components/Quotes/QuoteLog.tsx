
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockQuotes } from "@/data/mockData";
import { FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Quote, QuoteStatus } from "@/types";

type QuoteLogType = "fit" | "group";

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

export function QuoteLog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Filter quotes based on search query, status filter, and tab (FIT vs Group)
  const filterQuotes = (quotes: Quote[], type: QuoteLogType) => {
    return quotes.filter(quote => {
      const isGroup = quote.passengers.adults + (quote.passengers.children || 0) >= 8;
      const matchesType = type === "fit" ? !isGroup : isGroup;
      
      const matchesSearch = 
        quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.clientAgent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.clientAgent.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.destinations.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter ? quote.status === statusFilter : true;
      
      return matchesType && matchesSearch && matchesStatus;
    });
  };
  
  const fitQuotes = filterQuotes(mockQuotes, "fit");
  const groupQuotes = filterQuotes(mockQuotes, "group");
  
  // Create a set of unique quote statuses for filters
  const statuses = Array.from(new Set(mockQuotes.map(q => q.status)));
  
  const handleRowClick = (quote: Quote) => {
    navigate(`/quotes/${quote.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Quote Log
        </CardTitle>
        <CardDescription>Manage and track all quotes by type</CardDescription>
        
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
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="fit">FIT Quotes (1-7 pax)</TabsTrigger>
            <TabsTrigger value="group">Group Quotes (8+ pax)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fit">
            <QuoteTable quotes={fitQuotes} onRowClick={handleRowClick} />
          </TabsContent>
          
          <TabsContent value="group">
            <QuoteTable quotes={groupQuotes} onRowClick={handleRowClick} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface QuoteTableProps {
  quotes: Quote[];
  onRowClick: (quote: Quote) => void;
}

function QuoteTable({ quotes, onRowClick }: QuoteTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quote #</TableHead>
          <TableHead>Client/Agent</TableHead>
          <TableHead className="hidden md:table-cell">Passengers</TableHead>
          <TableHead className="hidden md:table-cell">Dates</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Value</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.length > 0 ? (
          quotes.map((quote) => (
            <TableRow 
              key={quote.id}
              className="cursor-pointer hover:bg-secondary"
              onClick={() => onRowClick(quote)}
            >
              <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
              <TableCell>
                <div>{quote.clientAgent.name}</div>
                <div className="text-xs text-muted-foreground">{quote.clientAgent.company}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {quote.passengers.adults + (quote.passengers.children || 0)} pax
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {quote.travelDates.startDate.toLocaleDateString()}
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
              <div className="text-muted-foreground">No quotes found matching your criteria</div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
