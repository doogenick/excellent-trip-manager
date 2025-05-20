
import Layout from "@/components/Layout";
import { EnhancedQuoteWizard } from "@/components/Quotes/QuoteWizard/EnhancedQuoteWizard";

const NewQuotePage = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <EnhancedQuoteWizard />
      </div>
    </Layout>
  );
};

export default NewQuotePage;
