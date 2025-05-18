import { z } from 'zod';

export const clientInformationSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
});

export const tripDetailsSchema = z.object({
  quoteType: z.string().min(1, 'Quote type is required'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  selectedDestinations: z.array(z.string()).min(1, 'At least one destination is required'),
}).refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const passengersSchema = z.object({
  adults: z.string().refine((val) => parseInt(val) > 0, {
    message: 'At least one adult is required',
  }),
  children: z.string().refine((val) => parseInt(val) >= 0, {
    message: 'Children cannot be negative',
  }),
  notes: z.string().optional(),
});

export type ClientInformationSchema = z.infer<typeof clientInformationSchema>;
export type TripDetailsSchema = z.infer<typeof tripDetailsSchema>;
export type PassengersSchema = z.infer<typeof passengersSchema>;
