export interface OptionalItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  isOptional: true;
  category: 'activity' | 'meal' | 'park' | 'transfer' | 'experience';
  seasonalAdjustments?: {
    name: string;
    multiplier: number;
    startDate: string;
    endDate: string;
    priority?: number;
  }[];
  maxQuantity?: number;
}

export const optionalItems: OptionalItem[] = [
  {
    id: 'game-drive',
    name: 'Game Drive',
    description: 'Guided game drive in national park',
    cost: 100,
    isOptional: true,
    category: 'activity',
    seasonalAdjustments: [
      {
        name: 'Peak Season',
        multiplier: 1.2,
        startDate: '06-01',
        endDate: '09-30',
        priority: 1
      }
    ]
  },
  {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon Safari',
    description: 'Early morning hot air balloon ride over savannah',
    cost: 250,
    isOptional: true,
    category: 'experience',
    seasonalAdjustments: [
      {
        name: 'Peak Season',
        multiplier: 1.3,
        startDate: '06-01',
        endDate: '09-30',
        priority: 1
      }
    ]
  },
  {
    id: 'sundowner-safari',
    name: 'Sundowner Safari',
    description: 'Evening game drive with drinks',
    cost: 80,
    isOptional: true,
    category: 'activity',
    seasonalAdjustments: [
      {
        name: 'Peak Season',
        multiplier: 1.15,
        startDate: '06-01',
        endDate: '09-30',
        priority: 1
      }
    ]
  },
  {
    id: 'park-entrance',
    name: 'Park Entrance Fee',
    description: 'Daily park entrance fee per person',
    cost: 50,
    isOptional: true,
    category: 'park',
    seasonalAdjustments: []
  },
  {
    id: 'airport-transfer',
    name: 'Airport Transfer',
    description: 'Round-trip airport transfer',
    cost: 75,
    isOptional: true,
    category: 'transfer',
    seasonalAdjustments: []
  },
  {
    id: 'special-dinner',
    name: 'Special Dinner',
    description: 'Gourmet dinner experience',
    cost: 120,
    isOptional: true,
    category: 'meal',
    seasonalAdjustments: [
      {
        name: 'Peak Season',
        multiplier: 1.1,
        startDate: '06-01',
        endDate: '09-30',
        priority: 1
      }
    ]
  }
];
