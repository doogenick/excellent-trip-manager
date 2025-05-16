
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuotesPage from "./pages/QuotesPage";
import NewQuotePage from "./pages/NewQuotePage";
import QuoteDetailPage from "./pages/QuoteDetailPage";
import BookingsPage from "./pages/BookingsPage";
import ClientsAgentsPage from "./pages/ClientsAgentsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quotes" element={<QuotesPage />} />
          <Route path="/quotes/new" element={<NewQuotePage />} />
          <Route path="/quotes/:id" element={<QuoteDetailPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/clients" element={<ClientsAgentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
