
import { TopDestinations } from "@/components/Dashboard/TopDestinations";
import { QuickStats } from "@/components/Dashboard/QuickStats";
import { RecentQuotes } from "@/components/Dashboard/RecentQuotes";
import { QuoteTypes } from "@/components/Dashboard/QuoteTypes";
import Layout from "@/components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <QuickStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentQuotes />
          
          <div className="grid grid-cols-1 gap-6">
            <TopDestinations />
            <QuoteTypes />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
