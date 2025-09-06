const THRESHOLD = 1.75;
const DISTANCE_THRESHOLD = 2;

export const isFeedingEvent = (
  current: number,
  lastHour: number[]
): [isFeedingEvent: boolean, delta: number] => {
  const [prev] = lastHour;

  if (current >= prev) {
    return [false, 0];
  }

  const diff = lastHour
    .map((v, index) => (index === 0 ? 0 : lastHour[index - 1] - v))
    .slice(1);
  const diffAvg = diff.reduce((a, b) => a + b, 0) / diff.length;

  if (
    Math.max(...diff.map(Math.abs)) - Math.abs(diffAvg) >
    DISTANCE_THRESHOLD
  ) {
    console.log(`Too noisy: ${current} (${diff.join(", ")})`);
    return [false, 0];
  }

  const delta = Math.abs(current - prev - diffAvg);

  const isFeedingEvent = delta > THRESHOLD;
  return [isFeedingEvent, delta];
};
