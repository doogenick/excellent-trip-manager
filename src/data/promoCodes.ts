export interface PromoCodeConfig {
  [code: string]: {
    type: 'percentage' | 'fixedAmount';
    value: number;
    startDate?: string;
    endDate?: string;
    maxUses?: number;
    uses?: number;
    description?: string;
    minimumSpend?: number;
  };
}

export const promoCodeConfig: PromoCodeConfig = {
  'SUMMER25': {
    type: 'percentage',
    value: 25,
    startDate: '2025-06-01',
    endDate: '2025-09-30',
    description: 'Summer special: 25% off all tours',
    minimumSpend: 1000
  },
  'WINTER15': {
    type: 'percentage',
    value: 15,
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    description: 'Winter escape: 15% off all tours',
    minimumSpend: 800
  },
  'FAMILY100': {
    type: 'fixedAmount',
    value: 100,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    description: 'Family discount: $100 off per family',
    minimumSpend: 1500
  },
  'EARLYBIRD30': {
    type: 'percentage',
    value: 30,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    description: 'Early bird special: 30% off for early bookings',
    minimumSpend: 1200
  }
};
