const MSECS_IN_DAY = 24 * 60 * 60 * 1000;
const CHART_LENGTH = MSECS_IN_DAY * 2;

const makeChart = ({ points }) => {
  const timestamp = Date.now();
  const svgPointsCount = points.filter(
    (point) => point.timestamp > timestamp - CHART_LENGTH
  ).length;

  const svgPoints = points
    .slice(0, svgPointsCount + 6)
    .map((point) => ({
      ...point,
      timeOffset: (CHART_LENGTH - (timestamp - point.timestamp)) / CHART_LENGTH,
    }))
    .reverse();

  const maxWeight = Math.max(...svgPoints.map((point) => point.weight));

  return /* HTML */ `<svg
    height="200"
    width="100%"
    preserveAspectRatio="none"
    viewBox="0 0 1000 ${maxWeight}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline
      vector-effect="non-scaling-stroke"
      points="${svgPoints
        .map((point) => {
          const x = Math.floor(point.timeOffset * 1000);
          const y = maxWeight - Math.max(point.weight, 0);
          return `${x} ${y}`;
        })
        .join(", ")}"
      style="fill:none;stroke-width:6;stroke-linecap:round"
    />
  </svg>`;
};

exports.makeChart = makeChart;
