
import Layout from "@/components/Layout";
import { CostBreakdown } from "@/components/Quotes/CostBreakdown";

const CostBreakdownPage = () => {
  return (
    <Layout>
      <div className="animate-fade-in p-6">
        <CostBreakdown />
      </div>
    </Layout>
  );
};

export default CostBreakdownPage;
