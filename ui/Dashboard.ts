import type { WithId } from "mongodb";
import type { LogEntry } from "../app/setup/db.ts";
import { formatGrams, formatTime, formatTimeHtml } from "../app/format.ts";
import { withStyles, css } from "../app/setup/styles.ts";

const makeDashboardWidget = ({
  title,
  fact,
  icon,
}: {
  title: string;
  fact: string;
  icon: string;
}) => {
  return /* HTML */ `
    <div class="${className("widget")}">
      <strong>${title}</strong>
      <span class="${className("widget-text-w-icon")}">
        <img src="./static/${icon}.gif" alt="" class="${className("icon")}" />
        <div class="${className("fact")}">${fact}</div>
      </span>
    </div>
  `;
};

const makeDashboard = ({
  feedingEvents,
}: {
  feedingEvents: WithId<LogEntry>[];
}) => {
  if (feedingEvents.length === 0) {
    return null;
  }

  const now = Date.now();
  const timeSinceLast = now - feedingEvents[0].timestamp;
  const averageTimeBetweenEvents =
    feedingEvents.reduce((acc, curr, idx) => {
      if (idx === 0) return acc;
      const diff = feedingEvents[idx - 1].timestamp - curr.timestamp;
      return acc + diff;
    }, timeSinceLast) / feedingEvents.length;

  const averageSizeOfEvents =
    feedingEvents.reduce((acc, curr) => {
      return acc + (curr.feedingEventOfSize ?? 0);
    }, 0) / feedingEvents.length;

  const expectedNextFeedingTime =
    now - timeSinceLast + averageTimeBetweenEvents;

  return /* HTML */ `
    <div class="${className}">
      ${makeDashboardWidget({
        title: "Time since last event",
        fact: formatTime(timeSinceLast, true),
        icon: "clock-pink",
      })}
      ${makeDashboardWidget({
        title: "Average time between",
        fact: formatTime(averageTimeBetweenEvents, true),
        icon: "time-snake",
      })}
      ${makeDashboardWidget({
        title: "Average size",
        fact: `${formatGrams(averageSizeOfEvents)}`,
        icon: "food",
      })}
      ${makeDashboardWidget({
        title: "Expected next time",
        fact:
          (now > expectedNextFeedingTime ? "Soon!! Was " : "") +
          formatTimeHtml(expectedNextFeedingTime),
        icon: "clock-blue",
      })}
    </div>
  `;
};

const [className] = withStyles((root) => ({
  display: "grid",
  background: "var(--neutral-0-A80)",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  margin: "-0.5px",
  [root("widget")]: {
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
    [root("widget-text-w-icon")]: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
    [root("fact")]: {
      fontWeight: 800,
    },
  },
}));

export { makeDashboard };
