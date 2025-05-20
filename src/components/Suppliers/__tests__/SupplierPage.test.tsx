import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@/test/test-utils';
import { SupplierPage } from '../SupplierPage';
import { Supplier } from '@prisma/client';

// Mock the API functions
vi.mock('@/lib/api', () => ({
  fetchSuppliersAPI: vi.fn(),
  addSupplierAPI: vi.fn(),
  updateSupplierAPI: vi.fn(),
  deleteSupplierAPI: vi.fn(),
}));

const { fetchSuppliersAPI, addSupplierAPI, updateSupplierAPI, deleteSupplierAPI } = vi.mocked(
  // @ts-ignore - Mocking the module
  require('@/lib/api')
);

describe('SupplierPage', () => {
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
  ];

  beforeEach(() => {
    fetchSuppliersAPI.mockResolvedValue(mockSuppliers);
    addSupplierAPI.mockResolvedValue({ ...mockSuppliers[0], SupplierID: 2 });
    updateSupplierAPI.mockResolvedValue(mockSuppliers[0]);
    deleteSupplierAPI.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays suppliers', async () => {
    render(<SupplierPage />);
    
    // Should show loading initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(fetchSuppliersAPI).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Test Supplier 1')).toBeInTheDocument();
    });
  });

  it('handles error when loading suppliers fails', async () => {
    const errorMessage = 'Failed to load suppliers';
    fetchSuppliersAPI.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<SupplierPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading suppliers/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('opens and closes the add supplier form', async () => {
    render(<SupplierPage />);
    
    // Click add button
    const addButton = await screen.findByRole('button', { name: /add supplier/i });
    fireEvent.click(addButton);
    
    // Form should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Close the form
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Form should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('adds a new supplier', async () => {
    const newSupplier = {
      SupplierName: 'New Supplier',
      ContactPerson: 'Jane Doe',
      ContactEmail: 'jane@test.com',
      ContactPhone: '',
      Address: '',
      Country: '',
      SupplierType: '',
      Notes: '',
    };
    
    render(<SupplierPage />);
    
    // Open add form
    const addButton = await screen.findByRole('button', { name: /add supplier/i });
    fireEvent.click(addButton);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Supplier Name/i), {
      target: { value: newSupplier.SupplierName },
    });
    fireEvent.change(screen.getByLabelText(/Contact Person/i), {
      target: { value: newSupplier.ContactPerson },
    });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), {
      target: { value: newSupplier.ContactEmail },
    });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add supplier/i });
    fireEvent.click(submitButton);
    
    // Check that the API was called with the correct data
    await waitFor(() => {
      expect(addSupplierAPI).toHaveBeenCalledWith(newSupplier);
      // Should refetch suppliers after adding
      expect(fetchSuppliersAPI).toHaveBeenCalledTimes(2);
    });
  });

  it('edits an existing supplier', async () => {
    render(<SupplierPage />);
    
    // Wait for data to load
    await screen.findByText('Test Supplier 1');
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    // Form should be visible with supplier data
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Supplier Name/i)).toHaveValue('Test Supplier 1');
    
    // Update the name
    const updatedName = 'Updated Supplier Name';
    fireEvent.change(screen.getByLabelText(/Supplier Name/i), {
      target: { value: updatedName },
    });
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    // Check that the API was called with the updated data
    await waitFor(() => {
      expect(updateSupplierAPI).toHaveBeenCalledWith(1, {
        ...mockSuppliers[0],
        SupplierName: updatedName,
      });
      // Should refetch suppliers after updating
      expect(fetchSuppliersAPI).toHaveBeenCalledTimes(2);
    });
  });

  it('deletes a supplier', async () => {
    render(<SupplierPage />);
    
    // Wait for data to load
    await screen.findByText('Test Supplier 1');
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete supplier/i });
    fireEvent.click(confirmButton);
    
    // Check that the API was called with the correct ID
    await waitFor(() => {
      expect(deleteSupplierAPI).toHaveBeenCalledWith(1);
      // Should refetch suppliers after deleting
      expect(fetchSuppliersAPI).toHaveBeenCalledTimes(2);
    });
  });
});
