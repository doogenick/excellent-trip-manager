// src/components/Suppliers/SupplierList.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Supplier } from '@prisma/client'; // Import the Supplier type from Prisma
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

interface SupplierListProps {
  suppliers: Supplier[];
  onAdd: () => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: number) => void; // Changed from string to number
  isLoading?: boolean;
}

export function SupplierList({ suppliers, onAdd, onEdit, onDelete, isLoading }: SupplierListProps) {
  if (isLoading) {
    return <p>Loading suppliers...</p>; // Replace with a proper skeleton loader later
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">No suppliers found.</p>
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Supplier
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Supplier
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.SupplierID}> // SupplierID is a number
              <TableCell className="font-medium">{supplier.SupplierName}</TableCell>
              <TableCell>{supplier.SupplierType}</TableCell>
              <TableCell>{supplier.ContactPerson}</TableCell>
              <TableCell>{supplier.ContactEmail}</TableCell>
              <TableCell>{supplier.ContactPhone}</TableCell>
              <TableCell>{supplier.Country}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(supplier)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(supplier.SupplierID)}> // SupplierID is a number
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
