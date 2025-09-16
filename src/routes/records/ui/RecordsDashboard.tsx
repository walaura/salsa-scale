import { formatTime, formatGrams, formatTimeHtml } from "@/app/format.ts";
import { LogEntry } from "@/app/setup/db.ts";
import { Dashboard } from "@/ui/Dashboard.tsx";
import { WithId } from "mongodb";

const RecordsDashboard = ({
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

  return (
    <Dashboard
      widgets={[
        {
          title: "Time since last event",
          fact: formatTime(timeSinceLast, true),
          icon: "clock-pink",
        },
        {
          title: "Average time between",
          fact: formatTime(averageTimeBetweenEvents, true),
          icon: "time-snake",
        },
        {
          title: "Average size",
          fact: formatGrams(averageSizeOfEvents),
          icon: "food",
        },
        {
          title: "Expected next time",
          fact:
            (now > expectedNextFeedingTime ? "Soon!! Was " : "") +
            formatTimeHtml(expectedNextFeedingTime),
          icon: "clock-blue",
        },
      ]}
    />
  );
};

export { RecordsDashboard };
