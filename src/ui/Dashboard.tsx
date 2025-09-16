import type { WithId } from "mongodb";
import type { LogEntry } from "../app/setup/db.ts";
import { formatGrams, formatTime, formatTimeHtml } from "../app/format.ts";
import { withStyles } from "local-css/css";
import { Icon } from "./Icon.tsx";

const DashboardWidget = ({
  title,
  fact,
  icon,
}: {
  title: string;
  fact: string;
  icon: string;
}) => (
  <div class={widgetClassName}>
    <strong>{title}</strong>
    <span class={widgetClassName("text-w-icon")}>
      <Icon icon={icon} />
      <div class={widgetClassName("fact")}>{fact}</div>
    </span>
  </div>
);

const widgetClassName = withStyles((select) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  flexDirection: "column",
  border: "1px solid var(--pink-200)",
  margin: "-0.5px",
  padding: "2rem 1rem",
  strong: {
    fontSize: "var(--font-secondary)",
    color: "var(--pink-600)",
    fontWeight: "inherit",
    fontStyle: "italic",
  },
  [select("text-w-icon")]: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  [select("fact")]: {
    fontWeight: 800,
  },
}));

const Dashboard = ({
  widgets,
}: {
  widgets: Parameters<typeof DashboardWidget>[0][];
}) => {
  return (
    <div class={className}>
      {widgets.map((w) => (
        <DashboardWidget {...w} />
      ))}
    </div>
  );
};

const className = withStyles(() => ({
  display: "grid",
  background: "color-mix(in srgb, var(--neutral-0) 75%, transparent)",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  margin: "-0.5px",
}));

export { Dashboard };
