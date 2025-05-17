
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDestinations, mockQuotes } from "@/data/mockData";
import { Destination } from "@/types";

export function TopDestinations() {
  // Count the occurrences of each destination in quotes
  const destinationCounts: Record<string, { count: number, destination: Destination }> = {};
  
  mockQuotes.forEach(quote => {
    quote.destinations.forEach(dest => {
      if (!destinationCounts[dest.id]) {
        destinationCounts[dest.id] = {
          count: 0,
          destination: dest
        };
      }
      destinationCounts[dest.id].count += 1;
    });
  });
  
  // Convert to array and sort by count
  const sortedDestinations = Object.values(destinationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top Destinations</CardTitle>
        <CardDescription>Most requested destinations in quotes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDestinations.map(({ destination, count }) => (
            <div key={destination.id} className="flex items-center">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{destination.name}</span>
                  <span className="text-muted-foreground text-sm">{count} quotes</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-sand-500 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(count / Math.max(...sortedDestinations.map(d => d.count))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
