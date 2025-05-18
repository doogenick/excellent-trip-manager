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
    expect(screen.getByText('4')).toBeInTheDocument(); // Passengers
  });

  it('calculates prices correctly', () => {
    render(<PriceCalculator {...defaultProps} />);
    
    // Initial calculations with default values
    // Vehicle: 2000 * 7 * 1.15 = 16100
    // Services: 1000 * 7 * 1.20 * 4 = 33600
    // Total: 16100 + 33600 = 49700
    // Per person: 49700 / 4 = 12425
    expect(screen.getByText('$16,100')).toBeInTheDocument();
    expect(screen.getByText('$33,600')).toBeInTheDocument();
    expect(screen.getByText('$49,700')).toBeInTheDocument();
    expect(screen.getByText('$12,425')).toBeInTheDocument();
  });

  it('updates calculations when changing vehicle markup', () => {
    render(<PriceCalculator {...defaultProps} />);
    
    const vehicleSlider = screen.getByLabelText('vehicle-markup');
    fireEvent.change(vehicleSlider, { target: { value: 25 } });
    
    // Vehicle: 2000 * 7 * 1.25 = 17500
    // Services: 1000 * 7 * 1.20 * 4 = 33600
    // Total: 17500 + 33600 = 51100
    // Per person: 51100 / 4 = 12775
    expect(mockOnPriceChange).toHaveBeenCalledWith(51100, 12775);
  });

  it('updates calculations when changing services markup', async () => {
    render(<PriceCalculator {...defaultProps} />);
    
    const sliders = screen.getAllByRole('slider');
    const servicesSlider = sliders[1]; // 0-based index: 2nd slider is services markup
    servicesSlider.focus();
    // Assuming default is 20, move to 30 (if step is 1, press ArrowRight 10 times)
    for (let i = 0; i < 10; i++) await userEvent.keyboard('{ArrowRight}');
    
    // Vehicle: 2000 * 7 * 1.15 = 16100
    // Services: 1000 * 7 * 1.30 * 4 = 36400
    // Total: 16100 + 36400 = 52500
    // Per person: 52500 / 4 = 13125
    expect(mockOnPriceChange).toHaveBeenCalledWith(52500, 13125);
  });

  it('updates calculations when changing number of passengers', async () => {
    render(<PriceCalculator {...defaultProps} />);
    
    const sliders = screen.getAllByRole('slider');
    const passengersSlider = sliders[2]; // 0-based index: 3rd slider is passengers
    // Focus the slider and increment its value to 6 using keyboard events (default is 4, so 2 ArrowRight presses)
    passengersSlider.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    
    // Vehicle: 2000 * 7 * 1.15 = 16100
    // Services: 1000 * 7 * 1.20 * 6 = 50400
    // Total: 16100 + 50400 = 66500
    // Per person: 66500 / 6 ≈ 11083.33
    expect(mockOnPriceChange).toHaveBeenCalledWith(66500, 11083.333333333334);
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
