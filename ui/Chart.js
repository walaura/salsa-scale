const { formatGrams } = require("../app/formatGrams.js");

const MSECS_IN_DAY = 24 * 60 * 60 * 1000;
const CHART_LENGTH = MSECS_IN_DAY;

const HEIGHT = 200;
const PADDING = 25;

const makeChart = ({ points }) => {
  const timestamp = Date.now();
  const svgPointsCount = points.filter(
    (point) => point.timestamp > timestamp - CHART_LENGTH
  ).length;

  const svgPoints = points
    .slice(0, svgPointsCount + 2)
    .map((point) => ({
      ...point,
      timeOffset: (CHART_LENGTH - (timestamp - point.timestamp)) / CHART_LENGTH,
    }))
    .reverse();

  const maxWeight = Math.max(...svgPoints.map((point) => point.weight));
  const minWeight = Math.min(...svgPoints.map((point) => point.weight));

  const projectPoint = (pointWeight) => {
    const scaled = (pointWeight - minWeight) / (maxWeight - minWeight);
    return 1 - Math.max(0, Math.min(1, scaled));
  };

  return /* HTML */ `<svg
    class="chart-container"
    height="${PADDING + HEIGHT + PADDING}"
  >
    <svg
      class="chart"
      height="100%"
      width="100%"
      preserveAspectRatio="none"
      viewBox="0 0 1000 ${PADDING + HEIGHT + PADDING}"
    >
      <polyline
        vector-effect="non-scaling-stroke"
        points="${svgPoints
          .map((point) => {
            const x = Math.floor(point.timeOffset * 1000);
            const y = PADDING + projectPoint(point.weight) * HEIGHT;
            return `${x} ${y}`;
          })
          .join(", ")}"
        style="fill:none;stroke-width:4;stroke-linecap:round;stroke:var(--pink-200)"
      />
    </svg>
    <svg>
      <text fill="var(--pink-600)" x="${PADDING}" y="${PADDING + 4}">
        ${formatGrams(maxWeight)}
      </text>
      <text fill="var(--pink-600)" x="${PADDING}" y="${HEIGHT + PADDING + 4}">
        ${formatGrams(minWeight)}
      </text>
      ${svgPoints
        .map((point) => {
          const x = point.timeOffset * 100;
          const y = PADDING + projectPoint(point.weight) * HEIGHT;
          return /* HTML */ `
            <g class="chart-point">
              <circle cx="${x}%" cy="${y}" r="2" fill="var(--pink-300)" />
              <g transform="translate(-20 0)">
                <g class="chart-point-label">
                  <svg x="${x}%" y="${y - 24}">
                    <rect
                      width="40"
                      height="20"
                      fill="var(--pink-600)"
                      rx="10"
                      ry="10"
                    />
                    <text fill="#fff" x="20" y="14" text-anchor="middle">
                      ${formatGrams(point.weight)}
                    </text>
                  </svg>
                </g>
              </g>
            </g>
          `;
        })
        .join(", ")}
    </svg>
  </svg>`;
};

exports.makeChart = makeChart;
