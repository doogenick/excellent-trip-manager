import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientInformationSchema, ClientInformationSchema } from "../quoteWizardSchemas";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockClientAgents } from "@/data/mockData";
import { toast } from "sonner";

interface ClientInformationStepProps {
  clientId: string;
  setClientId: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export function ClientInformationStep({ clientId, setClientId, onValidChange }: ClientInformationStepProps) {
  const {
    register,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<ClientInformationSchema>({
    resolver: zodResolver(clientInformationSchema),
    mode: "onChange",
    defaultValues: { clientId },
  });

  // Keep form state in sync with wizard state
  useEffect(() => {
    setValue("clientId", clientId);
    trigger();
  }, [clientId, setValue, trigger]);

  // Notify wizard of validity
  useEffect(() => {
    if (onValidChange) onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="client">Client/Agent</Label>
        <Select
          value={clientId}
          onValueChange={(val) => {
            setClientId(val);
            setValue("clientId", val);
            trigger();
          }}
        >
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
        {errors.clientId && (
          <div className="text-destructive text-xs mt-1">{errors.clientId.message}</div>
        )}
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
