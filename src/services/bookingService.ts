
import { Booking, BookingRequest, BookingStatus, BookingStatusUtils } from '../types/booking';
import { useTourCalculator } from '../hooks/tourCalculator';

// Mock function to simulate calculating the total tour cost
const calculateTotalTourCost = (quoteId: string, options?: any): number => {
  // In a real implementation, this would use the tour calculator to get the actual cost
  // For now, we'll return a mock value
  return 1500 * (options?.pax || 1);
};

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Mock database
const bookings: Booking[] = [];

// Create a new booking
export const createBooking = async (bookingRequest: BookingRequest): Promise<Booking> => {
  try {
    const { clientId, quoteId, bookingDate, depositAmount, notes } = bookingRequest;
    
    // Validate required fields
    if (!clientId) throw new Error('Client ID is required');
    if (!quoteId) throw new Error('Quote ID is required');
    
    // Calculate total amount from the quote
    const totalAmount = calculateTotalTourCost(quoteId);
    
    // Create new booking
    const newBooking: Booking = {
      id: generateId(),
      clientId,
      quoteId,
      status: BookingStatus.PENDING,
      bookingDate: bookingDate || new Date(),
      totalAmount,
      depositAmount: depositAmount || totalAmount * 0.2, // Default 20% deposit
      depositPaid: false,
      depositDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      balanceDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: notes || '',
      paymentHistory: []
    };
    
    // Save to database (mock)
    bookings.push(newBooking);
    
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const booking = bookings.find(b => b.id === id);
    return booking || null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<Booking | null> => {
  try {
    // Validate status
    if (!BookingStatusUtils.values().includes(status)) {
      throw new Error('Invalid booking status');
    }
    
    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) return null;
    
    bookings[bookingIndex].status = status;
    return bookings[bookingIndex];
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Record payment
export const recordPayment = async (bookingId: string, amount: number, method: string, reference: string): Promise<Booking | null> => {
  try {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return null;
    
    const payment = {
      id: generateId(),
      date: new Date(),
      amount,
      method,
      reference
    };
    
    bookings[bookingIndex].paymentHistory.push(payment);
    
    const totalPaid = bookings[bookingIndex].paymentHistory.reduce(
      (sum, payment) => sum + payment.amount, 0
    );
    
    // Mark deposit as paid if enough has been paid
    if (totalPaid >= bookings[bookingIndex].depositAmount) {
      bookings[bookingIndex].depositPaid = true;
    }
    
    // Mark as confirmed if fully paid
    if (totalPaid >= bookings[bookingIndex].totalAmount) {
      bookings[bookingIndex].status = BookingStatus.CONFIRMED;
    }
    
    return bookings[bookingIndex];
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
};

// Get all bookings
export const getAllBookings = async (): Promise<Booking[]> => {
  return [...bookings];
};

// Get bookings by client
export const getBookingsByClientId = async (clientId: string): Promise<Booking[]> => {
  return bookings.filter(b => b.clientId === clientId);
};

