export interface SeasonalAdjustment {
  name: string;
  multiplier: number;
  startDate: string;
  endDate: string;
  priority?: number;
}

export function getSeasonalMultiplier(
  date: Date, 
  adjustments: SeasonalAdjustment[] = []
): number {
  if (!date || !adjustments.length) return 1;

  const currentMonth = date.getMonth() + 1;
  const currentDay = date.getDate();
  const currentDateNum = currentMonth * 100 + currentDay;

  const sortedAdjustments = [...adjustments].sort((a, b) => 
    (b.priority || 0) - (a.priority || 0) || a.name.localeCompare(b.name)
  );

  for (const adj of sortedAdjustments) {
    const [startMonth, startDay] = adj.startDate.split('-').map(Number);
    const [endMonth, endDay] = adj.endDate.split('-').map(Number);
    
    const startDateNum = startMonth * 100 + startDay;
    const endDateNum = endMonth * 100 + endDay;

    if (startDateNum <= endDateNum) {
      // Normal date range (same year)
      if (currentDateNum >= startDateNum && currentDateNum <= endDateNum) {
        return adj.multiplier;
      }
    } else {
      // Wraps around year end (e.g., Dec 15 - Jan 15)
      if (currentDateNum >= startDateNum || currentDateNum <= endDateNum) {
        return adj.multiplier;
      }
    }
  }

  return 1;
}

export function getCombinedSeasonalMultiplier(
  date: Date,
  adjustments: SeasonalAdjustment[] = []
): number {
  const multipliers = adjustments
    .filter(adj => getSeasonalMultiplier(date, [adj]) !== 1)
    .map(adj => adj.multiplier);
  
  // Multiply all applicable multipliers together
  return multipliers.reduce((acc, curr) => acc * curr, 1);
}
