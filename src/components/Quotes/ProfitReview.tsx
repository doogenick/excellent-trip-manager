import React from 'react';
import { ProfitReviewSummary } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface ProfitReviewProps {
  summary: ProfitReviewSummary;
  className?: string;
}

export const ProfitReview: React.FC<ProfitReviewProps> = ({ summary, className = '' }) => {
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
    <div className={`space-y-6 ${className}`}>
      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Revenue" 
          value={summary.totalRevenue} 
          className="text-green-600" 
        />
        <StatCard 
          label="Total Expense" 
          value={summary.totalExpense} 
          className="text-red-600"
        />
        <StatCard 
          label="Total Profit" 
          value={summary.totalProfit} 
          className={summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.categories.map((cat) => (
                <TableRow key={cat.name}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(cat.total)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(summary.totalExpense)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Per-Day Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Profit & Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expense</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.perDay.map((day) => (
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


      {/* Optional Checks */}
      {(summary.minProfitPerDay !== undefined || 
        summary.dailyFuelIn !== undefined || 
        summary.dailyFuelOut !== undefined) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.minProfitPerDay !== undefined && (
              <div className="flex justify-between">
                <span>Minimum Profit per Day:</span>
                <span className={summary.minProfitPerDay >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(summary.minProfitPerDay)}
                </span>
              </div>
            )}
            {summary.dailyFuelIn !== undefined && (
              <div className="flex justify-between">
                <span>Daily Fuel In:</span>
                <span>{formatCurrency(summary.dailyFuelIn)}</span>
              </div>
            )}
            {summary.dailyFuelOut !== undefined && (
              <div className="flex justify-between">
                <span>Daily Fuel Out:</span>
                <span>{formatCurrency(summary.dailyFuelOut)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper component for stat cards
interface StatCardProps {
  label: string;
  value: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, className = '' }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className={`text-2xl font-bold ${className}`}>
          {formatCurrency(value)}
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfitReview;
