
import { mockClientAgents, mockQuotes } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter clients based on search query
  const filteredClients = mockClientAgents.filter(client => {
    return (
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Count quotes per client
  const quotesPerClient = mockClientAgents.map(client => {
    const count = mockQuotes.filter(quote => quote.clientAgent.id === client.id).length;
    return { id: client.id, count };
  });
  
  const handleAddClient = () => {
    toast.info("Client creation will be implemented in the next version");
  };
  
  const handleEditClient = (id: string) => {
    toast.info(`Edit client ${id} - will be implemented in the next version`);
  };
  
  const handleDeleteClient = (id: string) => {
    toast.info(`Delete client ${id} - will be implemented in the next version`);
  };
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Clients & Agents</CardTitle>
              <CardDescription>Manage your clients and agents</CardDescription>
            </div>
            <Button className="bg-sand-500 hover:bg-sand-600 flex items-center gap-2 self-start" onClick={handleAddClient}>
              <Plus className="h-4 w-4" />
              <span>Add Client</span>
            </Button>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="text-center">Quotes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                      {client.company && (
                        <div className="text-xs text-muted-foreground">{client.company}</div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone || "-"}</TableCell>
                    <TableCell className="text-center">
                      {quotesPerClient.find(q => q.id === client.id)?.count || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClient(client.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClient(client.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <div className="text-muted-foreground">No clients found</div>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing {filteredClients.length} of {mockClientAgents.length} clients and agents
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
