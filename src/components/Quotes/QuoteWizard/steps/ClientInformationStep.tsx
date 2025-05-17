
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockClientAgents } from "@/data/mockData";
import { toast } from "sonner";

interface ClientInformationStepProps {
  clientId: string;
  setClientId: (value: string) => void;
}

export function ClientInformationStep({ clientId, setClientId }: ClientInformationStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="client">Client/Agent</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger id="client">
            <SelectValue placeholder="Select a client or agent" />
          </SelectTrigger>
          <SelectContent>
            {mockClientAgents.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} {client.company ? `(${client.company})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Can't find the client?</span>
        <Button variant="link" className="p-0 h-auto" onClick={() => toast.info("Client creation will be implemented in the next version")}>
          Add new client
        </Button>
      </div>
    </div>
  );
}
