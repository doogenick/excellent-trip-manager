if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).ResizeObserver = ResizeObserver;
}

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PriceCalculator } from '../PriceCalculator';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

describe('PriceCalculator', () => {
  const mockOnPriceChange = vi.fn();
  
  const defaultProps = {
    baseVehicleCost: 2000,
    baseServicesCost: 1000,
    minPassengers: 2,
    maxPassengers: 16,
    initialPassengers: 4,
    initialVehicleMarkup: 15,
    initialServicesMarkup: 20,
    tourDuration: 7,
    onPriceChange: mockOnPriceChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default values', () => {
    render(<PriceCalculator {...defaultProps} />);
    
    expect(screen.getByText('Price Calculator')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Markup: 15%')).toBeInTheDocument();
    expect(screen.getByText('Services Markup: 20%')).toBeInTheDocument();
    // Check the passenger count display using data-testid
    const passengerCountDisplay = screen.getByTestId('passenger-count-display');
    expect(passengerCountDisplay).toHaveTextContent(defaultProps.initialPassengers.toString());
  });

  it('calculates prices correctly', () => {
    render(<PriceCalculator {...defaultProps} />);
    
    // Initial calculations with default values
    // Vehicle: 2000 * 7 * 1.15 = 16100
    // Services: 1000 * 7 * 1.20 * 4 = 33600
    // Total: 16100 + 33600 = 49700
    // Per person: 49700 / 4 = 12425
    
    // Use data-testid attributes to target specific price elements
    const vehicleTotalPrice = screen.getByTestId('vehicle-total-price');
    const servicesTotalPrice = screen.getByTestId('services-total-price');
    const totalCostPrice = screen.getByTestId('total-cost-price');
    const perPersonPrice = screen.getByTestId('per-person-price');
    
    // Check that the prices contain the expected values (allowing for different formatting)
    expect(vehicleTotalPrice.textContent).toMatch(/16[\s,.]?100/);
    expect(servicesTotalPrice.textContent).toMatch(/33[\s,.]?600/);
    expect(totalCostPrice.textContent).toMatch(/49[\s,.]?700/);
    expect(perPersonPrice.textContent).toMatch(/12[\s,.]?425/);
  });

  it('updates calculations when changing vehicle markup', () => {
    render(<PriceCalculator {...defaultProps} />);
    
    // Assert initial total price before markup change
    expect(screen.getByTestId('total-cost-price')).toHaveTextContent('$49,700'); // (14000 * 1.15) + (28000 * 1.20)

    const sliders = screen.getAllByRole('slider');
const vehicleSlider = sliders[0];
    vehicleSlider.focus();
    // Default is 15, target 25. Assuming step is 1.
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(vehicleSlider, { key: 'ArrowRight' });
    }

    // Assert that vehicle markup percentage in label has changed
    // Vehicle: 2000 * 7 * 1.25 = 17500
    // Services: 1000 * 7 * 1.20 * 4 = 33600
    // Total: 17500 + 33600 = 51100
    // Per person: 51100 / 4 = 12775
    expect(mockOnPriceChange).toHaveBeenCalledWith(51100, 12775);
  });

  it('updates calculations when changing services markup', async () => {
    render(<PriceCalculator {...defaultProps} />);
    
    // Assert initial services total matches default markup
    expect(screen.getByTestId('services-total-price')).toHaveTextContent('$33 600'); // 28000 * 1.20

    const sliders = screen.getAllByRole('slider');
const servicesSlider = sliders[1];
    servicesSlider.focus();
    // Assuming default is 20, move to 30 (if step is 1, press ArrowRight 10 times)
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(servicesSlider, { key: 'ArrowRight' });
    }

    // Wait for re-render and check updated prices
    // Vehicle: 2000 * 7 * 1.15 = 16100
    // Services: 1000 * 7 * 1.30 * 4 = 36400
    // Total: 16100 + 36400 = 52500
    // Per person: 52500 / 4 = 13125
    expect(mockOnPriceChange).toHaveBeenCalledWith(52500, 13125);
  });

  it('updates calculations when changing number of passengers', async () => {
    render(<PriceCalculator {...defaultProps} />);
    
    // Assert initial total price is correct with 4 passengers
    expect(screen.getByTestId('total-cost-price')).toHaveTextContent('$49,700');

    const sliders = screen.getAllByRole('slider');
const passengersSlider = sliders[2];
    // Focus the slider and increment its value to 6 using keyboard events
    passengersSlider.focus();
    // Simulate pressing ArrowRight twice to increase from 4 to 6
    for (let i = 0; i < 2; i++) { // Default 4, target 6
      fireEvent.keyDown(passengersSlider, { key: 'ArrowRight' });
    }

    // Recalculate expected costs with 6 passengers
    // Vehicle: 2000 * 7 * 1.15 = 16100
    // Services: 1000 * 7 * 1.20 * 6 = 50400
    // Total: 16100 + 50400 = 66500
    // Per person: 66500 / 6 ≈ 11083.33
    expect(mockOnPriceChange).toHaveBeenCalledWith(66500, 11083.33);
  });

  it('handles different tour durations', () => {
    render(<PriceCalculator {...defaultProps} tourDuration={14} />);
    
    // Log the rendered output for debugging
    // This will print all text content to help diagnose formatting issues
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
    
    // With 14-day tour
    // Vehicle: 2000 * 14 * 1.15 = 32200
    // Services: 1000 * 14 * 1.20 * 4 = 67200
    // Total: 32200 + 67200 = 99400
    // Per person: 99400 / 4 = 24850
    // Use regex to match currency values with comma, space, or non-breaking space as thousands separator
    expect(screen.getAllByText(/\$32[\,\u00A0 ]?200/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$67[\,\u00A0 ]?200/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$99[\,\u00A0 ]?400/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$24[\,\u00A0 ]?850/).length).toBeGreaterThan(0);
  });
});
