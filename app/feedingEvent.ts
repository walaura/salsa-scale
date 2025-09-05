const THRESHOLD = 4;

export const isFeedingEvent = (
  current: number,
  lastHour: number[]
): [isFeedingEvent: boolean, delta: number] => {
  const [prev, prevToLast] = lastHour;
  const maxPreviousWeight = Math.max(prev, prevToLast);

  // Not a feeding event if the weight is increasing
  if (current >= maxPreviousWeight) {
    return [false, 0];
  }

  const delta = Math.abs(
    Math.min(current, maxPreviousWeight) - Math.max(current, maxPreviousWeight)
  );

  const averageInChangeThruLastHour = Math.max(
    (lastHour.reduce((a, b) => a + b, 0) / lastHour.length - lastHour[0]) * 0.6,
    0
  );

  const adjustedThreshold = THRESHOLD + averageInChangeThruLastHour;

  return [
    maxPreviousWeight - current > adjustedThreshold,
    delta - averageInChangeThruLastHour,
  ];
};
