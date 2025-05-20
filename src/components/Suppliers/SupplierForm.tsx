// src/components/Suppliers/SupplierForm.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Supplier } from '@prisma/client'; // Import the Supplier type from Prisma

interface SupplierFormProps {
  supplier?: Supplier | null; // Optional: for pre-filling form when editing
  onSubmit: (data: Omit<Supplier, 'SupplierID' | 'CreatedAt' | 'UpdatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SupplierForm({ supplier, onSubmit, onCancel, isLoading }: SupplierFormProps) {
  // Basic state for form fields - will be replaced with React Hook Form or similar
  const [formData, setFormData] = React.useState<Omit<Supplier, 'SupplierID' | 'CreatedAt' | 'UpdatedAt'>>({
    SupplierName: supplier?.SupplierName || '',
    ContactPerson: supplier?.ContactPerson || '',
    ContactEmail: supplier?.ContactEmail || '',
    ContactPhone: supplier?.ContactPhone || '',
    Address: supplier?.Address || '',
    Country: supplier?.Country || '',
    SupplierType: supplier?.SupplierType || '',
    Notes: supplier?.Notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="SupplierName">Supplier Name*</Label>
              <Input 
                id="SupplierName" 
                name="SupplierName" 
                value={formData.SupplierName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="SupplierType">Supplier Type</Label>
              <Input 
                id="SupplierType" 
                name="SupplierType" 
                value={formData.SupplierType || ''} 
                onChange={handleChange} 
                placeholder="e.g., Accommodation, Transport"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ContactPerson">Contact Person</Label>
              <Input 
                id="ContactPerson" 
                name="ContactPerson" 
                value={formData.ContactPerson || ''} 
                onChange={handleChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ContactEmail">Contact Email</Label>
              <Input 
                id="ContactEmail" 
                name="ContactEmail" 
                type="email" 
                value={formData.ContactEmail || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ContactPhone">Contact Phone</Label>
              <Input 
                id="ContactPhone" 
                name="ContactPhone" 
                value={formData.ContactPhone || ''} 
                onChange={handleChange} 
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="Country">Country</Label>
              <Input 
                id="Country" 
                name="Country" 
                value={formData.Country || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="Address">Address</Label>
            <Textarea 
              id="Address" 
              name="Address" 
              value={formData.Address || ''} 
              onChange={handleChange} 
              placeholder="Full address of the supplier"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="Notes">Notes</Label>
            <Textarea 
              id="Notes" 
              name="Notes" 
              value={formData.Notes || ''} 
              onChange={handleChange} 
              placeholder="Any additional notes about the supplier"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (supplier ? 'Save Changes' : 'Add Supplier')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
