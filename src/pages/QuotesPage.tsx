
import Layout from "@/components/Layout";
import { QuotesList } from "@/components/Quotes/QuotesList";
import { QuoteLog } from "@/components/Quotes/QuoteLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuotesPage = () => {
  return (
    <Layout>
      <div className="animate-fade-in p-6">
        <Tabs defaultValue="quotes-list" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="quotes-list">All Quotes</TabsTrigger>
            <TabsTrigger value="quote-log">Quote Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quotes-list">
            <QuotesList />
          </TabsContent>
          
          <TabsContent value="quote-log">
            <QuoteLog />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default QuotesPage;
