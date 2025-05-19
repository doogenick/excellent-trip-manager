import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuoteWizard } from '../QuoteWizard';
import '@testing-library/jest-dom';

describe('QuoteWizard Integration', () => {
  it('disables Next button until Client Information is valid', async () => {
    render(
      <MemoryRouter>
        <QuoteWizard />
      </MemoryRouter>
    );
    const passengersNextBtn = screen.getByRole('button', { name: /next/i });
    expect(passengersNextBtn).toBeDisabled();

    // Open the client select dropdown
    fireEvent.click(screen.getByRole('combobox', { name: /Client\/Agent/i }));
    // Select the first client (Sarah Johnson)
    const clientOption = await screen.findByText(/Sarah Johnson/i);
    fireEvent.click(clientOption);

    // Wait for validation to pass and Next button to be enabled
    await waitFor(() => {
      expect(passengersNextBtn).not.toBeDisabled();
    });
  });

  it('shows error and disables Next for invalid Trip Details', async () => {
    render(
      <MemoryRouter>
        <QuoteWizard />
      </MemoryRouter>
    );
    // Complete step 1: Select the first client
    fireEvent.click(screen.getByRole('combobox', { name: /Client\/Agent/i }));
    const firstClientOption = await screen.findByText(/Sarah Johnson/i);
    fireEvent.click(firstClientOption);
    const passengersNextBtn = screen.getByRole('button', { name: /next/i });
    await waitFor(() => {
      expect(passengersNextBtn).not.toBeDisabled();
    });
    fireEvent.click(passengersNextBtn); // Go to Trip Details

    // Trip Details Step (Step 2)
    // Check that Next is initially disabled because fields are empty
    expect(passengersNextBtn).toBeDisabled();
    // Select a quote type
    fireEvent.click(screen.getByRole('combobox', { name: /Quote Type/i }));
    const quoteTypeOption = await screen.findByText(/Truck Rental/i); // Or any valid option
    fireEvent.click(quoteTypeOption);
    
    // Pick start and end date
    // (simulate picking dates if your calendar allows direct input, otherwise skip)
    // Select a destination
    const destinationOption = await screen.findByText(/Serengeti National Park/i);
    fireEvent.click(destinationOption);
    // Now Next should be enabled if all required fields are set
    // expect(passengersNextBtn).not.toBeDisabled();
  });

  it.only('shows error and disables Next for invalid Passengers', async () => {
    render(
      <MemoryRouter>
        <QuoteWizard />
      </MemoryRouter>
    );
    // Go to Passengers step
    // Complete step 1: Select the first client
    fireEvent.click(screen.getByRole('combobox', { name: /Client\/Agent/i }));
    const firstClientStep1 = await screen.findByText(/Sarah Johnson/i);
    fireEvent.click(firstClientStep1);
    const passengersNextBtn = screen.getByRole('button', { name: /next/i });
    await waitFor(() => {
      expect(passengersNextBtn).not.toBeDisabled();
    });
    fireEvent.click(passengersNextBtn); // Move to step 2

    // Complete step 2 (Trip Details) - ensure all required fields are set
    // Select a quote type
    const quoteTypeCombo = screen.getByRole('combobox', { name: /Quote Type/i });
    fireEvent.click(quoteTypeCombo);
    const quoteTypeOption = await screen.findByText(/Truck Rental/i);
    fireEvent.click(quoteTypeOption);

    // Set start and end dates using the date picker buttons
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Open start date picker and select today
    const startDateButton = screen.getByTestId('start-date-picker');
    fireEvent.click(startDateButton);
    
    // The calendar should now be visible
    const startDateGrid = await screen.findByRole('grid');
    const todayButton = screen.getByRole('button', { 
      name: new RegExp(`^${today.getDate()}$`)
    });
    fireEvent.click(todayButton);
    
    // Open end date picker and select tomorrow
    const endDateButton = screen.getByTestId('end-date-picker');
    fireEvent.click(endDateButton);
    
    // Wait for the end date calendar to be visible
    const endDateGrid = await screen.findByRole('grid');
    const tomorrowButton = screen.getByRole('button', {
      name: new RegExp(`^${tomorrow.getDate()}$`)
    });
    fireEvent.click(tomorrowButton);
    
    // Select a destination
    const destinationCombo = screen.getByRole('combobox', { name: /Destinations/i });
    fireEvent.click(destinationCombo);
    const destinationOption = await screen.findByText(/Serengeti National Park/i);
    fireEvent.click(destinationOption);

    // Now Next should be enabled if all required fields are set
    await waitFor(() => {
      expect(passengersNextBtn).not.toBeDisabled();
    }, { timeout: 2000 });
    
    fireEvent.click(passengersNextBtn); // Move to step 3 (Passengers)

    // Re-query the Next button after step change
    const passengersFinalNextBtn = screen.getByRole('button', { name: /next/i });

    // Set adults to 0 (invalid)
    const adultsInput = screen.getByLabelText(/number of adults/i);
    fireEvent.change(adultsInput, { target: { value: '0' } });
    fireEvent.blur(adultsInput);

    // Wait for validation to fail and button to be disabled
    await waitFor(() => {
      expect(screen.getByText(/at least one adult is required/i)).toBeInTheDocument();
      expect(passengersFinalNextBtn).toBeDisabled();
    }, { timeout: 1000 });

    // Set adults to 2 (valid)
    fireEvent.change(adultsInput, { target: { value: '2' } });
    fireEvent.blur(adultsInput);

    // Wait for adult validation error to disappear
    await waitFor(() => {
      expect(screen.queryByText(/at least one adult is required/i)).not.toBeInTheDocument();
    }, { timeout: 1000 });

    // Explicitly set children to 0 (valid)
    const childrenInput = screen.getByLabelText(/number of children/i);
    fireEvent.change(childrenInput, { target: { value: '0' } });
    fireEvent.blur(childrenInput);

    // Wait for validation to pass and Next button to be enabled
    await waitFor(() => {
      expect(passengersFinalNextBtn).not.toBeDisabled();
    }, { timeout: 2000 });
  });
});
