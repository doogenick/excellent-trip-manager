// src/components/Suppliers/SupplierPage.tsx
import React, { useState, useEffect } from 'react';
import { SupplierForm } from './SupplierForm';
import { SupplierList } from './SupplierList';
import { Supplier } from '@prisma/client'; // Assuming SupplierID is number from Prisma
import { Button } from '@/components/ui/button'; // If needed for layout
import { toast } from 'sonner'; // For notifications

const API_BASE_URL = '/api'; // Assuming your API is served from the same domain

// Real API functions
const fetchSuppliersAPI = async (): Promise<Supplier[]> => {
  const response = await fetch(`${API_BASE_URL}/suppliers`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch suppliers' }));
    throw new Error(errorData.message || 'Failed to fetch suppliers');
  }
  return response.json();
};

const addSupplierAPI = async (data: Omit<Supplier, 'SupplierID' | 'CreatedAt' | 'UpdatedAt'>): Promise<Supplier> => {
  const response = await fetch(`${API_BASE_URL}/suppliers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to add supplier' }));
    throw new Error(errorData.message || 'Failed to add supplier');
  }
  const newSupplier = await response.json();
  toast.success(`Supplier "${newSupplier.SupplierName}" added successfully!`);
  return newSupplier;
};

const updateSupplierAPI = async (supplierId: number, data: Partial<Omit<Supplier, 'SupplierID' | 'CreatedAt' | 'UpdatedAt'>>): Promise<Supplier> => {
  const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update supplier' }));
    throw new Error(errorData.message || 'Failed to update supplier');
  }
  const updatedSupplier = await response.json();
  toast.success(`Supplier "${updatedSupplier.SupplierName}" updated successfully!`);
  return updatedSupplier;
};

const deleteSupplierAPI = async (supplierId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to delete supplier' }));
    throw new Error(errorData.message || 'Failed to delete supplier');
  }
  // DELETE might not return a body, or might return the deleted item or a success message
  // For now, we just confirm deletion with a toast
  toast.success(`Supplier (ID: ${supplierId}) deleted successfully!`);
};


export function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSuppliersAPI(); // Replace with actual API call
      setSuppliers(data);
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
      toast.error("Failed to load suppliers.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (supplierId: number) => {
    // Add confirmation dialog here in a real app
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setIsLoading(true);
      try {
        await deleteSupplierAPI(supplierId); // Replace with actual API call
        setSuppliers(prev => prev.filter(s => s.SupplierID !== supplierId));
      } catch (error) {
        console.error("Failed to delete supplier", error);
        toast.error("Failed to delete supplier.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Supplier, 'SupplierID' | 'CreatedAt' | 'UpdatedAt'>) => {
    setIsLoading(true);
    try {
      if (editingSupplier) {
        const updated = await updateSupplierAPI(editingSupplier.SupplierID, data); // API call
        setSuppliers(prev => prev.map(s => s.SupplierID === editingSupplier.SupplierID ? updated : s));
      } else {
        const newSupplier = await addSupplierAPI(data); // API call
        setSuppliers(prev => [...prev, newSupplier]);
      }
      setShowForm(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error("Failed to save supplier", error);
      toast.error(`Failed to save supplier: ${editingSupplier ? editingSupplier.SupplierName : 'new supplier'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Supplier Management</h1>
      {showForm ? (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      ) : (
        <SupplierList
          suppliers={suppliers}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
