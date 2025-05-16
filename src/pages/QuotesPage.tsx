
import Layout from "@/components/Layout";
import { QuotesList } from "@/components/Quotes/QuotesList";

const QuotesPage = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <QuotesList />
      </div>
    </Layout>
  );
};

export default QuotesPage;
