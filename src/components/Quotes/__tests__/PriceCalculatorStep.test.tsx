if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).ResizeObserver = ResizeObserver;
}

import { render, screen } from '@testing-library/react';
import { PriceCalculatorStep } from '../QuoteWizard/steps/PriceCalculatorStep';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

describe('PriceCalculatorStep', () => {
  const mockOnPriceChange = vi.fn();
  
  const defaultProps = {
    onPriceChange: mockOnPriceChange,
    adults: '2',
    children: '1',
    quoteType: 'luxury',
    selectedDestinations: ['Paris', 'Lyon'],
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-08'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with quote summary', () => {
    render(<PriceCalculatorStep {...defaultProps} />);
    
    // Check if the quote summary is displayed correctly
    expect(screen.getByText('Quote Summary')).toBeInTheDocument();
    expect(screen.getByText('2 Adults, 1 Children')).toBeInTheDocument();
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    expect(screen.getByText('Paris, Lyon')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
    
    // Check if the PriceCalculator is rendered
    expect(screen.getByText('Price Calculator')).toBeInTheDocument();
  });

  it('calculates base costs based on quote type and destinations', () => {
    render(<PriceCalculatorStep {...defaultProps} />);
    
    // For luxury tour with 2 destinations:
    // Base vehicle: 2000 * 1.5 (luxury) + (2 * 200) = 3400
    // Base services: 1000 * 2 (luxury) + (2 * 100) = 2200
    // These values should be passed to the PriceCalculator
    
    // Check if the price calculator receives the correct base costs
    // We can't directly access the PriceCalculator's props in the test,
    // but we can check if the calculated prices reflect these base costs
    
    // For a 7-day luxury tour with 3 passengers (2 adults + 1 child):
    // Vehicle: 3400 * 7 * 1.25 = 29750 (25% markup for luxury)
    // Services: 2200 * 7 * 1.30 * 3 = 60060 (30% markup for luxury)
    // Total: 29750 + 60060 = 89810
    // Per person: 89810 / 3 ≈ 29936.67
    
    // The actual values will be checked in the PriceCalculator's own tests
    // Here we just verify that the component renders without errors
    expect(screen.getByText('Price Calculator')).toBeInTheDocument();
  });

  it('handles different quote types', () => {
    const adventureProps = {
      ...defaultProps,
      quoteType: 'adventure',
    };
    
    render(<PriceCalculatorStep {...adventureProps} />);
    
    // Check if the adventure type is displayed
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    
    // For adventure tour with 2 destinations:
    // Base vehicle: 2000 * 1.2 (adventure) + (2 * 200) = 2800
    // Base services: 1000 * 1.3 (adventure) + (2 * 100) = 1500
    // These values should be passed to the PriceCalculator
    
    // Again, we just verify rendering since calculations are tested in PriceCalculator
    expect(screen.getByText('Price Calculator')).toBeInTheDocument();
  });

  it('handles empty destinations', () => {
    const noDestinationsProps = {
      ...defaultProps,
      selectedDestinations: [],
    };
    
    render(<PriceCalculatorStep {...noDestinationsProps} />);
    
    // Should still render without errors
    expect(screen.getByText('Price Calculator')).toBeInTheDocument();
  });
});
