import { Booking, BookingRequest, BookingStatus, Passenger } from '../types/booking';
import { promoCodeConfig } from '../data/promoCodes';
import { calculateTotalTourCost } from '../hooks/tourCalculator';

export class BookingService {
  private static instance: BookingService;
  private bookings: Booking[] = [];
  private bookingReferenceCounter = 1;

  private constructor() {}

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  // Generate unique booking reference
  private generateBookingReference(): string {
    return `BK${this.bookingReferenceCounter++}`;
  }

  // Validate booking request
  private validateBookingRequest(request: BookingRequest): void {
    if (!request.tourStartDate || !request.tourEndDate) {
      throw new Error('Tour dates are required');
    }

    if (request.tourStartDate < new Date()) {
      throw new Error('Tour start date cannot be in the past');
    }

    if (request.tourEndDate <= request.tourStartDate) {
      throw new Error('Tour end date must be after start date');
    }

    if (!request.passengers || request.passengers.length < 1) {
      throw new Error('At least one passenger is required');
    }

    // Validate promo code if provided
    if (request.promoCode && !promoCodeConfig[request.promoCode]) {
      throw new Error('Invalid promo code');
    }
  }

  // Create new booking
  public async createBooking(request: BookingRequest): Promise<Booking> {
    this.validateBookingRequest(request);

    const booking: Booking = {
      id: crypto.randomUUID(),
      bookingDate: new Date(),
      tourStartDate: request.tourStartDate,
      tourEndDate: request.tourEndDate,
      status: BookingStatus.PENDING,
      passengers: request.passengers,
      totalCost: 0, // Will be calculated below
      paidAmount: 0,
      currency: request.currency || 'USD',
      paymentStatus: 'PENDING',
      paymentMethod: undefined,
      bookingReference: this.generateBookingReference(),
      createdAt: new Date(),
      updatedAt: new Date(),
      cancellationPolicyAccepted: false,
      cancellationPolicy: {
        before30Days: 90, // 90% refund if cancelled >30 days before
        before14Days: 50, // 50% refund if cancelled >14 days before
        before7Days: 25, // 25% refund if cancelled >7 days before
        noShow: 0 // No refund for no-show
      },
      notes: request.specialRequests,
      createdBy: 'system',
      lastModifiedBy: 'system'
    };

    // Calculate total cost with optional activities and promo codes
    const selectedActivities = request.requestedActivities.map(activityId => ({
      id: activityId,
      quantity: 1
    }));

    const totalCost = await calculateTotalTourCost(
      selectedActivities,
      request.currency,
      undefined,
      request.promoCode
    );

    booking.totalCost = totalCost;

    // Add booking to list
    this.bookings.push(booking);

    return booking;
  }

  // Get booking by reference
  public getBookingByReference(reference: string): Booking | undefined {
    return this.bookings.find(b => b.bookingReference === reference);
  }

  // Update booking status
  public updateBookingStatus(bookingId: string, status: BookingStatus): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = status;
    booking.updatedAt = new Date();
  }

  // Cancel booking
  public cancelBooking(bookingId: string): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Calculate refund amount based on cancellation policy
    const daysUntilTour = Math.floor(
      (booking.tourStartDate.getTime() - new Date().getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    let refundPercentage = 0;
    if (daysUntilTour > 30) {
      refundPercentage = booking.cancellationPolicy?.before30Days || 0;
    } else if (daysUntilTour > 14) {
      refundPercentage = booking.cancellationPolicy?.before14Days || 0;
    } else if (daysUntilTour > 7) {
      refundPercentage = booking.cancellationPolicy?.before7Days || 0;
    }

    const refundAmount = booking.totalCost * (refundPercentage / 100);

    booking.status = BookingStatus.CANCELLED;
    booking.updatedAt = new Date();
    booking.notes = `Booking cancelled. Refund amount: ${refundAmount} ${booking.currency}`;
  }

  // Get all bookings
  public getAllBookings(): Booking[] {
    return [...this.bookings];
  }

  // Get bookings by status
  public getBookingsByStatus(status: BookingStatus): Booking[] {
    return this.bookings.filter(b => b.status === status);
  }
}
