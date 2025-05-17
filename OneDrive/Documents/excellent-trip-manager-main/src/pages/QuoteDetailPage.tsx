
import Layout from "@/components/Layout";
import { QuoteDetail } from "@/components/Quotes/QuoteDetail";

const QuoteDetailPage = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <QuoteDetail />
      </div>
    </Layout>
  );
};

export default QuoteDetailPage;
