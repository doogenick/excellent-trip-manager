
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockQuotes } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Quote, QuoteStatus } from "@/types";
import { useNavigate } from "react-router-dom";

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

export function RecentQuotes() {
  const navigate = useNavigate();
  // Get 5 most recent quotes based on updated date
  const recentQuotes = [...mockQuotes]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  const handleRowClick = (quote: Quote) => {
    navigate(`/quotes/${quote.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quotes</CardTitle>
        <CardDescription>Latest quotes that have been created or updated</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote #</TableHead>
              <TableHead>Client/Agent</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentQuotes.map((quote) => (
              <TableRow 
                key={quote.id}
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleRowClick(quote)}
              >
                <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                <TableCell>{quote.clientAgent.name}</TableCell>
                <TableCell>{quote.type}</TableCell>
                <TableCell>
                  {quote.travelDates.startDate.toLocaleDateString()} - {quote.travelDates.endDate.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(quote.status)}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(quote.updatedAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
