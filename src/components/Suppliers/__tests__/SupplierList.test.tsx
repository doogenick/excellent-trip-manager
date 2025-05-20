import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { SupplierList } from '../SupplierList';
import { Supplier } from '@prisma/client';
import { QueryClient } from '@tanstack/react-query';

describe('SupplierList', () => {
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

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAddNew = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <SupplierList
        suppliers={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddNew={mockOnAddNew}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state when no suppliers', () => {
    render(
      <SupplierList
        suppliers={[]}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddNew={mockOnAddNew}
      />
    );

    expect(screen.getByText(/No suppliers found/i)).toBeInTheDocument();
  });

  it('renders list of suppliers', () => {
    render(
      <SupplierList
        suppliers={mockSuppliers}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddNew={mockOnAddNew}
      />
    );

    expect(screen.getByText('Test Supplier 1')).toBeInTheDocument();
    expect(screen.getByText('Test Supplier 2')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(mockSuppliers.length + 1); // +1 for header row
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <SupplierList
        suppliers={mockSuppliers}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddNew={mockOnAddNew}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockSuppliers[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <SupplierList
        suppliers={mockSuppliers}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddNew={mockOnAddNew}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Should show confirmation dialog
    const confirmButton = screen.getByRole('button', { name: /delete supplier/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockSuppliers[0].SupplierID);
    });
  });

  it('calls onAddNew when add button is clicked', () => {
    render(
      <SupplierList
        suppliers={mockSuppliers}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddNew={mockOnAddNew}
      />
    );

    const addButton = screen.getByRole('button', { name: /add supplier/i });
    fireEvent.click(addButton);
    
    expect(mockOnAddNew).toHaveBeenCalled();
  });
});
