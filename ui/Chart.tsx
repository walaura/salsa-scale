import type { WithId } from "mongodb";
import type { LogEntry } from "../app/setup/db.ts";
import { formatGrams, formatTime } from "../app/format.ts";
import { withKeyframes, withStyles } from "../app/styles.ts";

const MSECS_IN_DAY = 24 * 60 * 60 * 1000;

const HEIGHT = 200;
const PADDING = 25;

const Chart = ({
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

  return (
    <svg class={className} height={PADDING + HEIGHT + PADDING}>
      <svg
        height="100%"
        width="100%"
        preserveAspectRatio="none"
        viewBox={`0 0 1000 ${PADDING + HEIGHT + PADDING}`}
      >
        <polyline
          class={className("line")}
          vector-effect="non-scaling-stroke"
          points={svgPoints
            .map((point) => {
              const x = Math.floor(point.timeOffset * 1000);
              const y = PADDING + projectPoint(point.weight) * HEIGHT;
              return `${x} ${y}`;
            })
            .join(", ")}
        />
      </svg>
      <svg>
        <text fill="var(--neutral-600)" x={PADDING} y={PADDING + 4}>
          {formatGrams(maxWeight)}
        </text>
        <text fill="var(--neutral-600)" x={PADDING} y={HEIGHT + PADDING + 4}>
          {formatGrams(minWeight)}
        </text>
        {svgPoints
          .filter((point) => point.feedingEventOfSize != null)
          .map((point) => {
            const x = point.timeOffset * 100;
            const y = PADDING + projectPoint(point.weight) * HEIGHT;
            return (
              <circle class={className("dot")} cx={`${x}%`} cy={`${y}`} r="6" />
            );
          })
          .join("")}
        {svgPoints
          .map((point) => {
            const x = point.timeOffset * 100;
            const y = PADDING + projectPoint(point.weight) * HEIGHT;
            return makeHoverable({ point, x, y });
          })
          .join("")}
      </svg>
    </svg>
  );
};

const dashAnimation = withKeyframes({
  to: {
    strokeDashoffset: 0,
  },
});

const [className] = withStyles((select) => ({
  display: "block",
  contain: "strict",
  width: "100%",
  background:
    "repeating-linear-gradient(var(--neutral-0-A80), var(--neutral-0-A80) 24px, var(--pink-100) 24px, var(--pink-100) 25px)",
  marginBottom: "-1px",
  "&, *": {
    transformBox: "fill-box",
  },
  text: {
    fontSize: "var(--font-secondary)",
  },
  [select("line")]: {
    strokeDasharray: 2000,
    strokeDashoffset: 2000,
    animation: `${dashAnimation} 1.5s linear forwards`,
    fill: "none",
    strokeWidth: 4,
    strokeLinecap: "round",
    stroke: "var(--pink-200)",
  },
  [select("dot")]: {
    fill: "var(--pink-500)",
  },
}));

const makeHoverable = ({
  point,
  x,
  y,
}: {
  point: WithId<LogEntry>;
  x: number;
  y: number;
}) => (
  <g class={hoverableClassName}>
    <a href={`#${point._id.toString()}`}>
      <circle cx={`${x}%`} cy={`${y}`} r="12" />
      <g transform="translate(-20 0)">
        <g class={`${hoverableClassName("label")}`}>
          <svg x={`${x}%`} y={`${y - 24}`}>
            <rect width="48" height="32" fill="var(--pink-600)" rx="4" ry="4" />
            <text fill="var(--neutral-0)" x="24" y="14" text-anchor="middle">
              {formatGrams(point.weight)}
            </text>
            <text
              class={hoverableClassName("date")}
              fill="var(--pink-100)"
              x="24"
              y="25"
              text-anchor="middle"
            >
              {formatTime(point.timestamp)}
            </text>
          </svg>
        </g>
      </g>
    </a>
  </g>
);

const [hoverableClassName] = withStyles((select) => ({
  circle: {
    display: "none",
  },
  [select("date")]: {
    fontSize: "0.6em",
  },
  [select("label")]: {
    transform: "scaleY(0.5) scaleX(0.2)",
    opacity: 0,
    transformOrigin: "bottom center",
    transition: "transform 0.1s ease, opacity 0.1s ease",
  },
  "&:hover": {
    zIndex: 99999,
    [select("label")]: {
      opacity: 1,
      transform: "scaleY(1) scaleX(1) translateZ(42px)",
    },
  },
}));

export { Chart };
