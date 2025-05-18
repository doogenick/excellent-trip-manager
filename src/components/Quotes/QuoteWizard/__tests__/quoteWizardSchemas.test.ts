import { clientInformationSchema, tripDetailsSchema, passengersSchema } from '../quoteWizardSchemas';

describe('clientInformationSchema', () => {
  it('validates a correct clientId', () => {
    expect(() => clientInformationSchema.parse({ clientId: 'abc123' })).not.toThrow();
  });
  it('fails on empty clientId', () => {
    expect(() => clientInformationSchema.parse({ clientId: '' })).toThrow();
  });
});

describe('tripDetailsSchema', () => {
  const base = {
    quoteType: 'classic',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-10'),
    selectedDestinations: ['Paris'],
  };
  it('validates correct data', () => {
    expect(() => tripDetailsSchema.parse(base)).not.toThrow();
  });
  it('requires quoteType', () => {
    expect(() => tripDetailsSchema.parse({ ...base, quoteType: '' })).toThrow();
  });
  it('requires at least one destination', () => {
    expect(() => tripDetailsSchema.parse({ ...base, selectedDestinations: [] })).toThrow();
  });
  it('requires start and end dates', () => {
    expect(() => tripDetailsSchema.parse({ ...base, startDate: undefined })).toThrow();
    expect(() => tripDetailsSchema.parse({ ...base, endDate: undefined })).toThrow();
  });
  it('fails if endDate is before startDate', () => {
    expect(() => tripDetailsSchema.parse({ ...base, endDate: new Date('2025-06-30') })).toThrow();
  });
});

describe('passengersSchema', () => {
  it('validates correct data', () => {
    expect(() => passengersSchema.parse({ adults: '2', children: '1', notes: '' })).not.toThrow();
  });
  it('requires at least one adult', () => {
    expect(() => passengersSchema.parse({ adults: '0', children: '1', notes: '' })).toThrow();
  });
  it('children cannot be negative', () => {
    expect(() => passengersSchema.parse({ adults: '2', children: '-1', notes: '' })).toThrow();
  });
});
