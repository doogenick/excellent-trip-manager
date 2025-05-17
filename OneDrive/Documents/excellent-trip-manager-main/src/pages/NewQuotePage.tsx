
import Layout from "@/components/Layout";
import { QuoteWizard } from "@/components/Quotes/QuoteWizard";

const NewQuotePage = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <QuoteWizard />
      </div>
    </Layout>
  );
};

export default NewQuotePage;
