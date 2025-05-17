
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const BookingsPage = () => {
  return (
    <Layout>
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <Calendar className="h-16 w-16 text-sand-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Booking Management</h2>
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          The booking management system will be implemented in the next version.
        </p>
        <Button className="bg-sand-500 hover:bg-sand-600">Coming Soon</Button>
      </div>
    </Layout>
  );
};

export default BookingsPage;
