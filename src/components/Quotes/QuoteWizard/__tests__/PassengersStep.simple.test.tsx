import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PassengersStep } from '../steps/PassengersStep';

// Simple test to verify the component renders without errors
describe('PassengersStep - Simple Test', () => {
  it('renders without crashing', () => {
    const mockSetAdults = jest.fn();
    const mockSetChildren = jest.fn();
    const mockSetNotes = jest.fn();
    
    render(
      <PassengersStep 
        adults="2" 
        setAdults={mockSetAdults}
        children="0"
        setChildren={mockSetChildren}
        notes=""
        setNotes={mockSetNotes}
        onValidChange={jest.fn()}
      />
    );
    
    // Simple assertion to verify the component renders
    expect(screen.getByText(/Number of Adults/i)).toBeInTheDocument();
  });
});
