import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PassengersStep } from '../steps/PassengersStep';

// Mock the required modules
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    setValue: jest.fn(),
    trigger: jest.fn(),
    formState: { errors: {}, isValid: true },
  }),
}));

describe('PassengersStep', () => {
  const mockSetAdults = jest.fn();
  const mockSetChildren = jest.fn();
  const mockSetNotes = jest.fn();
  const mockOnValidChange = jest.fn();

  const defaultProps = {
    adults: '2',
    setAdults: mockSetAdults,
    children: '0',
    setChildren: mockSetChildren,
    notes: '',
    setNotes: mockSetNotes,
    onValidChange: mockOnValidChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default values', () => {
    render(<PassengersStep {...defaultProps} />);
    
    expect(screen.getByLabelText(/Number of Adults/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Number of Children/i)).toHaveValue(0);
    expect(screen.getByLabelText(/Additional Notes/i)).toHaveValue('');
  });

  it('calls setAdults when adults input changes', () => {
    render(<PassengersStep {...defaultProps} />);
    const adultsInput = screen.getByLabelText(/Number of Adults/i);
    fireEvent.change(adultsInput, { target: { value: '3' } });
    expect(mockSetAdults).toHaveBeenCalledWith('3');
  });

  it('calls setChildren when children input changes', () => {
    render(<PassengersStep {...defaultProps} />);
    const childrenInput = screen.getByLabelText(/Number of Children/i);
    fireEvent.change(childrenInput, { target: { value: '2' } });
    expect(mockSetChildren).toHaveBeenCalledWith('2');
  });

  it('calls setNotes when notes input changes', () => {
    render(<PassengersStep {...defaultProps} />);
    const notesInput = screen.getByLabelText(/Additional Notes/i);
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });
    expect(mockSetNotes).toHaveBeenCalledWith('Test notes');
  });
});
