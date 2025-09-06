import type { WithId } from "mongodb";
import { makeTable } from "../ui/Table.ts";
import { Expander } from "../ui/section/Expander.tsx";
import { type LogEntry } from "../app/setup/db.ts";
import { getAllData } from "../app/getData.ts";

async function recordsRoute({ showActions }: { showActions: boolean }) {
  const all = await getAllData({
    daysToFetch: 12,
  });

  const days: Record<string, WithId<LogEntry>[]> = {};
  for (const point of all) {
    const date = new Date(point.timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!days[date]) {
      days[date] = [];
    }
    days[date].push(point);
  }

  return Object.entries(days)
    .map(([date, points], idx) =>
      Expander({
        title: date,
        children: makeTable({ points, showActions }),
        isOpen: idx === 0,
      })
    )
    .join("");
}

export { recordsRoute };
