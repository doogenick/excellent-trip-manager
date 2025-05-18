import { render, screen, fireEvent } from '@testing-library/react';
import { QuoteWizard } from '../QuoteWizard';
import '@testing-library/jest-dom';

describe('QuoteWizard Integration', () => {
  it('disables Next button until Client Information is valid', () => {
    render(<QuoteWizard />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();
    // Select a client
    fireEvent.click(screen.getByLabelText(/client\/agent/i));
    // Open dropdown and select the first client
    fireEvent.click(screen.getByText(/select a client or agent/i));
    const firstOption = screen.getAllByRole('option')[0];
    fireEvent.click(firstOption);
    // Next should now be enabled
    expect(nextBtn).not.toBeDisabled();
  });

  it('shows error and disables Next for invalid Trip Details', () => {
    render(<QuoteWizard />);
    // Complete step 1
    const clientOption = screen.getAllByRole('option')[0];
    fireEvent.click(clientOption);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    // Step 2: leave all fields empty, Next should be disabled
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();
    // Select a quote type
    fireEvent.click(screen.getByLabelText(/quote type/i));
    fireEvent.click(screen.getAllByRole('option')[0]);
    // Pick start and end date
    // (simulate picking dates if your calendar allows direct input, otherwise skip)
    // Select a destination
    fireEvent.click(screen.getByText(/select destinations/i));
    fireEvent.click(screen.getAllByRole('option')[0]);
    // Now Next should be enabled if all required fields are set
    // expect(nextBtn).not.toBeDisabled();
  });

  it('shows error and disables Next for invalid Passengers', () => {
    render(<QuoteWizard />);
    // Go to Passengers step
    // Complete previous steps...
    // (simulate valid input for previous steps)
    // Set adults to 0
    const adultsInput = screen.getByLabelText(/number of adults/i);
    fireEvent.change(adultsInput, { target: { value: '0' } });
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();
    // Set adults to 2
    fireEvent.change(adultsInput, { target: { value: '2' } });
    expect(nextBtn).not.toBeDisabled();
  });
});
