import type { WithId } from "mongodb";
import type { LogEntry } from "../app/db.ts";
import { formatGrams, formatTime } from "../app/format.ts";

const MSECS_IN_DAY = 24 * 60 * 60 * 1000;

const HEIGHT = 200;
const PADDING = 25;

const makeChart = ({
  points,
  scale = 1,
}: {
  points: WithId<LogEntry>[];
  scale?: number;
}) => {
  const length = scale * MSECS_IN_DAY;
  const timestamp = Date.now();
  const svgPointsCount = points.filter(
    (point) => point.timestamp > timestamp - length
  ).length;

  let svgPoints = points
    .slice(0, svgPointsCount + 2)
    .map((point) => ({
      ...point,
      timeOffset: (length - (timestamp - point.timestamp)) / length,
    }))
    .reverse();

  svgPoints = svgPoints.filter((p, i) => {
    if (p.feedingEventOfSize != null) {
      return true;
    }
    return i % Math.round(scale * 2) === 0;
  });

  const maxWeight = Math.max(...svgPoints.map((point) => point.weight));
  const minWeight = Math.min(...svgPoints.map((point) => point.weight));

  const projectPoint = (pointWeight: number) => {
    const scaled = (pointWeight - minWeight) / (maxWeight - minWeight);
    return 1 - Math.max(0, Math.min(1, scaled));
  };

  return /* HTML */ `<svg class="chart" height="${PADDING + HEIGHT + PADDING}">
    <svg
      height="100%"
      width="100%"
      preserveAspectRatio="none"
      viewBox="0 0 1000 ${PADDING + HEIGHT + PADDING}"
    >
      <polyline
        class="chart-line"
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
      <text fill="var(--neutral-600)" x="${PADDING}" y="${PADDING + 4}">
        ${formatGrams(maxWeight)}
      </text>
      <text
        fill="var(--neutral-600)"
        x="${PADDING}"
        y="${HEIGHT + PADDING + 4}"
      >
        ${formatGrams(minWeight)}
      </text>
      ${svgPoints
        .filter((point) => point.feedingEventOfSize != null)
        .map((point) => {
          const x = point.timeOffset * 100;
          const y = PADDING + projectPoint(point.weight) * HEIGHT;
          return /* HTML */ `
            <circle class="chart-dot" cx="${x}%" cy="${y}" r="6" />
          `;
        })
        .join("")}
      ${svgPoints
        .map((point) => {
          const x = point.timeOffset * 100;
          const y = PADDING + projectPoint(point.weight) * HEIGHT;
          return /* HTML */ `
            <g class="chart-hoverable">
              <a href="#${point._id.toString()}">
                <circle cx="${x}%" cy="${y}" r="12" />
                <g transform="translate(-20 0)">
                  <g class="chart-hoverable-label">
                    <svg x="${x}%" y="${y - 24}">
                      <rect
                        width="48"
                        height="32"
                        fill="var(--pink-600)"
                        rx="4"
                        ry="4"
                      />
                      <text fill="#fff" x="24" y="14" text-anchor="middle">
                        ${formatGrams(point.weight)}
                      </text>
                      <text
                        class="chart-hoverable-date"
                        fill="var(--pink-100)"
                        x="24"
                        y="25"
                        text-anchor="middle"
                      >
                        ${formatTime(point.timestamp)}
                      </text>
                    </svg>
                  </g>
                </g>
              </a>
            </g>
          `;
        })
        .join("")}
    </svg>
  </svg>`;
};

export { makeChart };
