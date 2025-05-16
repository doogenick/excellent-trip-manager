
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSuppliers, mockSupplierRates } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function SettingsPage() {
  const handleSaveCompanySettings = () => {
    toast.success("Company settings saved!");
  };
  
  const handleAddSupplier = () => {
    toast.info("Adding suppliers will be implemented in the next version");
  };
  
  const handleAddRate = () => {
    toast.info("Adding rates will be implemented in the next version");
  };
  
  return (
    <div className="p-6">
      <Tabs defaultValue="company">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="rates">Rates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>Manage your company details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Nomad Trip Management" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.nomadtripmanagement.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="info@nomadtripmanagement.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Safari Avenue, Adventure City, AC 12345" />
              </div>
              
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border rounded flex items-center justify-center bg-muted text-muted-foreground">
                    Logo
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 200x200px, PNG or SVG format</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveCompanySettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Supplier Management</CardTitle>
                  <CardDescription>Manage your suppliers and service providers</CardDescription>
                </div>
                <Button className="bg-sand-500 hover:bg-sand-600 flex items-center gap-2 self-start" onClick={handleAddSupplier}>
                  <Plus className="h-4 w-4" />
                  <span>Add Supplier</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Service Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="cursor-pointer hover:bg-secondary">
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {supplier.serviceType.map((service, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded-md">
                              {service}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Rate Management</CardTitle>
                  <CardDescription>Manage your supplier rates and pricing</CardDescription>
                </div>
                <Button className="bg-sand-500 hover:bg-sand-600 flex items-center gap-2 self-start" onClick={handleAddRate}>
                  <Plus className="h-4 w-4" />
                  <span>Add Rate</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="supplier-filter">Filter by Supplier</Label>
                  <Select>
                    <SelectTrigger id="supplier-filter">
                      <SelectValue placeholder="All Suppliers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-suppliers">All Suppliers</SelectItem>
                      {mockSuppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/3">
                  <Label htmlFor="service-filter">Filter by Service Type</Label>
                  <Select>
                    <SelectTrigger id="service-filter">
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-services">All Services</SelectItem>
                      <SelectItem value="Accommodation">Accommodation</SelectItem>
                      <SelectItem value="Activities">Activities</SelectItem>
                      <SelectItem value="Transfers">Transfers</SelectItem>
                      <SelectItem value="Vehicles">Vehicles</SelectItem>
                      <SelectItem value="Guides">Guides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/3">
                  <Label htmlFor="season-filter">Filter by Season</Label>
                  <Select>
                    <SelectTrigger id="season-filter">
                      <SelectValue placeholder="All Seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-seasons">All Seasons</SelectItem>
                      <SelectItem value="high">High Season</SelectItem>
                      <SelectItem value="standard">Standard Season</SelectItem>
                      <SelectItem value="low">Low Season</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Season</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSupplierRates.map((rate) => {
                    const supplier = mockSuppliers.find(s => s.id === rate.supplierId);
                    return (
                      <TableRow key={rate.id} className="cursor-pointer hover:bg-secondary">
                        <TableCell>
                          <div className="font-medium">{rate.serviceName}</div>
                          <div className="text-xs text-muted-foreground">{rate.serviceType}</div>
                        </TableCell>
                        <TableCell>{supplier?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <div className="font-medium">${rate.rate}</div>
                          <div className="text-xs text-muted-foreground">{rate.currency}</div>
                        </TableCell>
                        <TableCell>
                          {format(rate.validFrom, "dd MMM yyyy")} - {format(rate.validTo, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-md",
                            rate.seasonType === "high" ? "bg-sunset-100 text-sunset-800" :
                            rate.seasonType === "low" ? "bg-blue-100 text-blue-800" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {rate.seasonType?.charAt(0).toUpperCase() + rate.seasonType?.slice(1) || "Standard"} Season
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
