import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { SupplierForm } from '../SupplierForm';
import { Supplier } from '@prisma/client';

describe('SupplierForm', () => {
  const mockSupplier: Supplier = {
    SupplierID: 1,
    SupplierName: 'Test Supplier',
    ContactPerson: 'John Doe',
    ContactEmail: 'john@test.com',
    ContactPhone: '123-456-7890',
    Address: '123 Test St',
    Country: 'Testland',
    SupplierType: 'Accommodation',
    Notes: 'Test notes',
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  };

  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with empty fields when no supplier is provided', () => {
    render(
      <SupplierForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/Supplier Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Contact Person/i)).toHaveValue('');
    expect(screen.getByLabelText(/Contact Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Contact Phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Address/i)).toHaveValue('');
    expect(screen.getByLabelText(/Country/i)).toHaveValue('');
    expect(screen.getByLabelText(/Supplier Type/i)).toHaveValue('');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue('');
  });

  it('pre-fills the form when a supplier is provided', () => {
    render(
      <SupplierForm
        supplier={mockSupplier}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/Supplier Name/i)).toHaveValue(mockSupplier.SupplierName);
    expect(screen.getByLabelText(/Contact Person/i)).toHaveValue(mockSupplier.ContactPerson || '');
    expect(screen.getByLabelText(/Contact Email/i)).toHaveValue(mockSupplier.ContactEmail || '');
    expect(screen.getByLabelText(/Contact Phone/i)).toHaveValue(mockSupplier.ContactPhone || '');
    expect(screen.getByLabelText(/Address/i)).toHaveValue(mockSupplier.Address || '');
    expect(screen.getByLabelText(/Country/i)).toHaveValue(mockSupplier.Country || '');
    expect(screen.getByLabelText(/Supplier Type/i)).toHaveValue(mockSupplier.SupplierType || '');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue(mockSupplier.Notes || '');
  });

  it('calls onSubmit with form data when form is submitted', async () => {
    render(
      <SupplierForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Supplier Name/i), {
      target: { value: 'New Supplier' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Person/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), {
      target: { value: 'jane@test.com' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Supplier/ }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        SupplierName: 'New Supplier',
        ContactPerson: 'Jane Doe',
        ContactEmail: 'jane@test.com',
        ContactPhone: '',
        Address: '',
        Country: '',
        SupplierType: '',
        Notes: '',
      });
    });
  });

  it('validates required fields', async () => {
    render(
      <SupplierForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Add Supplier/ }));

    // Check for required field validation
    await waitFor(() => {
      expect(screen.getByText(/Supplier name is required/)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <SupplierForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
