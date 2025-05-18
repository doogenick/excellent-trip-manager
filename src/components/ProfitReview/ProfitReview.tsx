import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useProfitReview } from "@/hooks/useProfitReview";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfitReviewProps {
  startDate: Date;
  endDate: Date;
  baseRate?: number;
  passengerCount?: number;
}

export function ProfitReview({
  startDate,
  endDate,
  baseRate: initialBaseRate = 1200,
  passengerCount: initialPassengerCount = 4,
}: ProfitReviewProps) {
  const [baseRate, setBaseRate] = useState(initialBaseRate);
  const [passengerCount, setPassengerCount] = useState(initialPassengerCount);

  const { profitReview, isLoading, error } = useProfitReview({
    startDate,
    endDate,
    baseRate,
    passengerCount,
  });

  if (isLoading) {
    return <div>Loading profit review...</div>;
  }

  if (error) {
    return <div>Error loading profit review: {error}</div>;
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="baseRate">Base Rate per Passenger</Label>
          <Input
            id="baseRate"
            type="number"
            value={baseRate}
            onChange={(e) => setBaseRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengerCount">Number of Passengers</Label>
          <Input
            id="passengerCount"
            type="number"
            value={passengerCount}
            onChange={(e) => setPassengerCount(Number(e.target.value))}
            className="w-full"
            min="1"
          />
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Trip Duration</div>
          <div className="text-lg font-medium">
            {profitReview.perDay.length} days
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(profitReview.totalRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {formatCurrency(profitReview.totalExpense)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Profit</CardDescription>
            <CardTitle 
              className={`text-2xl ${
                profitReview.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(profitReview.totalProfit)}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {profitReview.minProfitPerDay !== undefined && (
                <span>
                  Min Daily: {formatCurrency(profitReview.minProfitPerDay)}
                </span>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Costs by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitReview.categories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(category.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    {((category.total / profitReview.totalExpense) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(profitReview.totalExpense)}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Profit & Loss</CardTitle>
          <CardDescription>Revenue and expenses by day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitReview.perDay.map((day) => (
                  <TableRow key={day.date.toString()}>
                    <TableCell>{formatDate(day.date)}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(day.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(day.expense)}
                    </TableCell>
                    <TableCell 
                      className={`text-right font-medium ${
                        day.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(day.profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
