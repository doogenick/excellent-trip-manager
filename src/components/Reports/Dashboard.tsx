import React, { useState, useEffect } from 'react';
import { BookingStatus } from '../../types/booking';
import { BookingAnalytics, PerformanceMetrics, TrendAnalysis } from '../../types/reporting';
import { ReportingService } from '../../services/reportingService';
import Chart from 'react-apexcharts';

interface DashboardProps {
  className?: string;
}

export const Dashboard = ({ className = '' }: DashboardProps) => {
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [trends, setTrends] = useState<TrendAnalysis | null>(null);
  const [filters, setFilters] = useState({
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 12)),
      end: new Date()
    }
  });

  const reportingService = ReportingService.getInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, metricsData, trendsData] = await Promise.all([
          reportingService.getBookingAnalytics(filters),
          reportingService.getPerformanceMetrics(),
          reportingService.getTrendAnalysis(filters)
        ]);
        setAnalytics(analyticsData);
        setMetrics(metricsData);
        setTrends(trendsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchData();
  }, [filters]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  const renderRevenueChart = () => {
    if (!analytics?.activityAnalytics?.activityRevenueByMonth) return null;

    const series = [
      {
        name: 'Revenue',
        data: analytics.activityAnalytics.activityRevenueByMonth.map(t => t.revenue)
      },
      {
        name: 'Bookings',
        data: analytics.activityAnalytics.activityRevenueByMonth.map(t => t.bookings)
      }
    ];

    const categories = analytics.activityAnalytics.activityRevenueByMonth.map(t => t.month);

    return (
      <Chart
        options={{
          chart: { type: 'line' },
          xaxis: { categories },
          title: { text: 'Activity Revenue Trends', align: 'center' },
          stroke: { width: [4, 2] },
          yaxis: [
            {
              title: { text: 'Revenue ($)' },
              seriesName: 'Revenue'
            },
            {
              title: { text: 'Bookings' },
              seriesName: 'Bookings',
              opposite: true
            }
          ]
        }}
        series={series}
        type="line"
        height={400}
      />
    );
  };

  const renderActivityCategoryChart = () => {
    if (!analytics?.activityAnalytics?.activitiesByCategory) return null;

    const categories = Object.keys(analytics.activityAnalytics.activitiesByCategory);
    const series = categories.map(category => 
      analytics.activityAnalytics.activitiesByCategory[category].revenue
    );

    return (
      <Chart
        options={{
          chart: { type: 'donut' },
          labels: categories,
          title: { text: 'Activity Revenue by Category', align: 'center' },
          legend: { position: 'bottom' }
        }}
        series={series}
        type="donut"
        height={400}
      />
    );
  };

  const renderActivityPopularityChart = () => {
    if (!analytics?.activityAnalytics?.activityPopularity) return null;

    const topActivities = analytics.activityAnalytics.activityPopularity
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);

    const series = [
      {
        name: 'Bookings',
        data: topActivities.map(a => a.bookings)
      },
      {
        name: 'Revenue',
        data: topActivities.map(a => a.revenue)
      }
    ];

    const categories = topActivities.map(a => a.activityName);

    return (
      <Chart
        options={{
          chart: { type: 'bar' },
          xaxis: { categories },
          yaxis: [
            {
              title: { text: 'Bookings' },
              seriesName: 'Bookings'
            },
            {
              title: { text: 'Revenue ($)' },
              seriesName: 'Revenue',
              opposite: true
            }
          ],
          title: { text: 'Top Activities by Bookings and Revenue', align: 'center' },
          legend: { position: 'top' }
        }}
        series={series}
        type="bar"
        height={500}
      />
    );
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => handleDateRangeChange(
              new Date(new Date().setMonth(new Date().getMonth() - 1)),
              new Date()
            )}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Last Month
          </button>
          <button
            onClick={() => handleDateRangeChange(
              new Date(new Date().setMonth(new Date().getMonth() - 3)),
              new Date()
            )}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Last 3 Months
          </button>
          <button
            onClick={() => handleDateRangeChange(
              new Date(new Date().setMonth(new Date().getMonth() - 12)),
              new Date()
            )}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Last Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Key Metrics Cards */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">${analytics?.totalRevenue?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-2xl font-bold">{analytics?.totalBookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Average Booking Value</h3>
          <p className="text-2xl font-bold">${analytics?.averageBookingValue?.toFixed(2) || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Activity Revenue Trends</h3>
          {renderRevenueChart()}
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Activity Categories</h3>
          {renderActivityCategoryChart()}
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Top Activities</h3>
          {renderActivityPopularityChart()}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Revenue Growth</h3>
            <p className="text-xl font-bold">
              {metrics?.revenueGrowth?.percentage?.toFixed(1)}%
              <span className={`ml-2 ${metrics?.revenueGrowth?.percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics?.revenueGrowth?.percentage > 0 ? '↑' : '↓'}
              </span>
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Cancellation Rate</h3>
            <p className="text-xl font-bold">{metrics?.cancellationRate?.rate?.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Average Lead Time</h3>
            <p className="text-xl font-bold">{metrics?.averageBookingLeadTime?.days?.toFixed(0)} days</p>
          </div>
        </div>
      </div>

      {/* Activity Utilization */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Activity Utilization</h2>
        <div className="bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.activityAnalytics?.activityCapacityUtilization?.slice(0, 6)?.map((activity, index) => (
              <div key={index} className="p-4 border rounded">
                <h3 className="text-sm font-semibold">{activity.activityName}</h3>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${activity.utilizationRate}%` }}
                    />
                  </div>
                  <span className="ml-2">{activity.utilizationRate.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span>Capacity: {activity.totalCapacity}</span>
                  <span className="mx-2">|</span>
                  <span>Used: {activity.usedCapacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Sources */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Booking Sources</h2>
        <div className="bg-white p-6 rounded shadow">
          <div className="space-y-4">
            {trends?.bookingSources?.map((source, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">{source.source}</h3>
                  <p className="text-sm text-gray-500">
                    {source.medium} / {source.campaign}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm">Bookings:</p>
                    <p className="font-medium">{source.bookings}</p>
                  </div>
                  <div>
                    <p className="text-sm">Revenue:</p>
                    <p className="font-medium">${source.revenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm">Conversion:</p>
                    <p className="font-medium">{source.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
