
import { format } from "date-fns";
import { mockClientAgents, mockDestinations } from "@/data/mockData";
import { QuoteType } from "@/types";

interface ReviewStepProps {
  clientId: string;
  quoteType: QuoteType | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedDestinations: string[];
  adults: string;
  children: string;
  notes: string;
  totalPrice: number;
  perPersonPrice: number;
}

export function ReviewStep({
  clientId,
  quoteType,
  startDate,
  endDate,
  selectedDestinations,
  adults,
  children,
  notes,
  totalPrice,
  perPersonPrice
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Quote Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">Client/Agent</div>
          <div>{mockClientAgents.find(c => c.id === clientId)?.name}</div>
          <div className="text-sm text-muted-foreground">{mockClientAgents.find(c => c.id === clientId)?.company}</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Quote Type</div>
          <div>{quoteType}</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Travel Dates</div>
          <div>
            {startDate && format(startDate, "PPP")} - {endDate && format(endDate, "PPP")}
            {startDate && endDate && (
              <span className="text-sm text-muted-foreground ml-1">
                ({Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Passengers</div>
          <div>
            {adults} {parseInt(adults) === 1 ? "Adult" : "Adults"}
            {parseInt(children) > 0 && (
              <>, {children} {parseInt(children) === 1 ? "Child" : "Children"}</>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Destinations</div>
          <div>
            {selectedDestinations.map(id => {
              const dest = mockDestinations.find(d => d.id === id);
              return dest ? `${dest.name}, ${dest.country}` : "";
            }).join(" • ")}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Notes</div>
          <div className="text-sm">{notes || "No additional notes"}</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Price Details</div>
          <div>
            <div className="font-bold">Total: ${totalPrice.toLocaleString()}</div>
            <div>Per Person: ${perPersonPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-sand-50 border border-sand-200 rounded-md p-4">
        <p className="text-sm">Upon creating this quote, you will be able to:</p>
        <ul className="text-sm list-disc list-inside mt-2">
          <li>Add detailed itinerary items</li>
          <li>Add cost elements and pricing</li>
          <li>Generate a PDF quote to send to the client</li>
        </ul>
      </div>
    </div>
  );
}
