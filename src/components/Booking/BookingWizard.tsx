import React, { useState } from 'react';
import { BookingRequest, Passenger } from '../../types/booking';
import { BookingService } from '../../services/bookingService';

export const BookingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingRequest>>({
    passengers: [{}],
    requestedActivities: []
  });
  const [error, setError] = useState<string | null>(null);

  const bookingService = BookingService.getInstance();

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const passengers = [...(bookingData.passengers || [])];
    passengers[index] = {
      ...(passengers[index] || {}),
      [field]: value
    };
    setBookingData({ ...bookingData, passengers });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const completeData = bookingData as BookingRequest;
      const booking = await bookingService.createBooking(completeData);
      alert(`Booking created successfully! Reference: ${booking.bookingReference}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">1. Tour Details</h2>
            <div>
              <label>Tour Start Date</label>
              <input
                type="date"
                value={bookingData.tourStartDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setBookingData({ ...bookingData, tourStartDate: new Date(e.target.value) })}
              />
            </div>
            <div>
              <label>Tour End Date</label>
              <input
                type="date"
                value={bookingData.tourEndDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setBookingData({ ...bookingData, tourEndDate: new Date(e.target.value) })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">2. Passenger Details</h2>
            {bookingData.passengers?.map((passenger, index) => (
              <div key={index} className="border p-4 rounded">
                <h3>Passenger {index + 1}</h3>
                <div className="space-y-2">
                  <div>
                    <label>First Name</label>
                    <input
                      value={passenger.firstName || ''}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <input
                      value={passenger.lastName || ''}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      value={passenger.email || ''}
                      onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setBookingData({ ...bookingData, passengers: [...(bookingData.passengers || []), {}] })}
            >
              Add Passenger
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">3. Activities & Preferences</h2>
            <div>
              <label>Room Type</label>
              <select
                value={bookingData.accommodationPreferences?.roomType || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  accommodationPreferences: {
                    ...(bookingData.accommodationPreferences || {}),
                    roomType: e.target.value
                  }
                })}
              >
                <option value="">Select Room Type</option>
                <option value="single">Single</option>
                <option value="double">Double/Twin</option>
                <option value="triple">Triple</option>
                <option value="family">Family</option>
                <option value="dorm">Dormitory</option>
                <option value="camping">Camping</option>
              </select>
            </div>
            <div>
              <label>Meal Basis</label>
              <select
                value={bookingData.accommodationPreferences?.mealBasis || ''}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  accommodationPreferences: {
                    ...(bookingData.accommodationPreferences || {}),
                    mealBasis: e.target.value
                  }
                })}
              >
                <option value="">Select Meal Basis</option>
                <option value="ro">Room Only</option>
                <option value="bb">Bed & Breakfast</option>
                <option value="hb">Half Board</option>
                <option value="fb">Full Board</option>
                <option value="ai">All Inclusive</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">4. Review & Confirm</h2>
            <div className="p-4 border rounded">
              <h3>Booking Summary</h3>
              <div className="space-y-2">
                <div>Tour Dates: {bookingData.tourStartDate?.toLocaleDateString()} - {bookingData.tourEndDate?.toLocaleDateString()}</div>
                <div>Passengers: {(bookingData.passengers || []).length}</div>
                <div>Room Type: {bookingData.accommodationPreferences?.roomType}</div>
                <div>Meal Basis: {bookingData.accommodationPreferences?.mealBasis}</div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={handlePrevious}>Previous</button>
              <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Confirm Booking
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tour Booking Wizard</h1>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {renderStep()}
        {currentStep !== 1 && currentStep !== 4 && (
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
