
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockQuotes } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function QuoteTypes() {
  // Count quotes by type
  const typeCounts: Record<string, number> = {};
  
  mockQuotes.forEach(quote => {
    if (!typeCounts[quote.type]) {
      typeCounts[quote.type] = 0;
    }
    typeCounts[quote.type] += 1;
  });
  
  // Convert to array for chart data
  const chartData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  const COLORS = ['#a5885a', '#91ad4c', '#ea7d5b', '#b29969', '#a6c264', '#f09a7f', '#8c6f45', '#778f3a', '#d05e3a'];
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Quote Types</CardTitle>
        <CardDescription>Distribution of quotes by type</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} quotes`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
