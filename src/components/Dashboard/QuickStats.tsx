
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockQuotes } from "@/data/mockData";

export function QuickStats() {
  const totalQuotes = mockQuotes.length;
  const sentQuotes = mockQuotes.filter(q => q.status === "sent").length;
  const confirmedQuotes = mockQuotes.filter(q => q.status === "confirmed").length;
  
  // Calculate total value of confirmed quotes
  const confirmedValue = mockQuotes
    .filter(q => q.status === "confirmed")
    .reduce((sum, quote) => sum + quote.totalCost, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuotes}</div>
          <p className="text-xs text-muted-foreground">All time quotes</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sentQuotes}</div>
          <p className="text-xs text-muted-foreground">Awaiting client response</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{confirmedQuotes}</div>
          <p className="text-xs text-muted-foreground">Ready for booking</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${confirmedValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Total confirmed value</p>
        </CardContent>
      </Card>
    </div>
  );
}
