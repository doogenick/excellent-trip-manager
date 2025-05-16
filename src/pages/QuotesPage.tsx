
import Layout from "@/components/Layout";
import { QuotesList } from "@/components/Quotes/QuotesList";
import { QuoteLog } from "@/components/Quotes/QuoteLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuotesPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="animate-fade-in p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quotes</h1>
          <Button 
            onClick={() => navigate('/quotes/cost-breakdown')}
            variant="outline"
            className="flex gap-2"
          >
            <Calculator className="h-4 w-4" />
            Cost Calculator
          </Button>
        </div>

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
