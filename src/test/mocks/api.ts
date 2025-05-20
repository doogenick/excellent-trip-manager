import { vi } from 'vitest';
import { Supplier } from '@prisma/client';

// Mock data
const mockSuppliers: Supplier[] = [
  {
    SupplierID: 1,
    SupplierName: 'Test Supplier 1',
    ContactPerson: 'John Doe',
    ContactEmail: 'john@test.com',
    ContactPhone: '123-456-7890',
    Address: '123 Test St',
    Country: 'Testland',
    SupplierType: 'Accommodation',
    Notes: 'Test notes 1',
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
  {
    SupplierID: 2,
    SupplierName: 'Test Supplier 2',
    ContactPerson: 'Jane Smith',
    ContactEmail: 'jane@test.com',
    ContactPhone: '098-765-4321',
    Address: '456 Test Ave',
    Country: 'Testland',
    SupplierType: 'Activity',
    Notes: 'Test notes 2',
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  },
];

// Mock implementations
export const fetchSuppliersAPI = vi.fn(async (): Promise<Supplier[]> => {
  return [...mockSuppliers];
});

export const addSupplierAPI = vi.fn(async (data: Omit<Supplier, 'SupplierID' | 'CreatedAt' | 'UpdatedAt'>): Promise<Supplier> => {
  const newSupplier: Supplier = {
    ...data,
    SupplierID: mockSuppliers.length + 1,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  };
  mockSuppliers.push(newSupplier);
  return newSupplier;
});

export const updateSupplierAPI = vi.fn(async (id: number, data: Partial<Supplier>): Promise<Supplier> => {
  const index = mockSuppliers.findIndex(s => s.SupplierID === id);
  if (index === -1) {
    throw new Error('Supplier not found');
  }
  
  const updatedSupplier = {
    ...mockSuppliers[index],
    ...data,
    UpdatedAt: new Date(),
  };
  
  mockSuppliers[index] = updatedSupplier;
  return updatedSupplier;
});

export const deleteSupplierAPI = vi.fn(async (id: number): Promise<boolean> => {
  const index = mockSuppliers.findIndex(s => s.SupplierID === id);
  if (index === -1) {
    throw new Error('Supplier not found');
  }
  
  mockSuppliers.splice(index, 1);
  return true;
});
