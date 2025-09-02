import type { WithId } from "mongodb";
import type { LogEntry } from "../app/setup/db.ts";
import { formatGrams, formatTime, formatTimeHtml } from "../app/format.ts";

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
    <div class="dashboard-widget">
      <strong>${title}</strong>
      <span class="dashboard-widget-text-w-icon">
        <img src="./static/${icon}.gif" alt="" class="dashboard-icon" />
        <div class="dashboard-fact">${fact}</div>
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
    <div class="dashboard">
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

export { makeDashboard };
