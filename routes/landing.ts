import type { WithId } from "mongodb";
import { makeChart } from "../ui/Chart.ts";
import { makeTable } from "../ui/Table.ts";
import { makeExpander } from "../ui/section/Expander.ts";
import { makeDashboard } from "../ui/Dashboard.ts";
import { withDb, type LogEntry } from "../app/setup/db.ts";

const getData = async ({ chartScale }: { chartScale: number }) =>
  withDb(async (database) => {
    const daysToFetch = Math.max(chartScale, 5, 10);

    const logs = database.collection<LogEntry>("logs");
    const all = await logs
      .find()
      .sort({ timestamp: -1 })
      .limit(6 * 24 * daysToFetch)
      .toArray();
    const feedingEvents = all.filter(
      (entry) => entry.feedingEventOfSize != null
    );
    return { all, feedingEvents };
  });

async function landingRoute({
  showActions,
  chartScale,
  url,
}: {
  showActions: boolean;
  chartScale: number;
  url: URL;
}) {
  const { all, feedingEvents } = await getData({
    chartScale,
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

  const pivot = [
    { label: "24h", value: 1 },
    { label: "3d", value: 3 },
    { label: "7d", value: 7 },
  ].map((f) => {
    const link = new URL(url);
    link.searchParams.set("scale", f.value.toString());
    return { ...f, isActive: f.value === chartScale, link };
  });
  const svgLine = makeExpander({
    title: "Chart",
    pivot,
    children: makeChart({ points: all, scale: chartScale }),
    isOpen: true,
  });

  const dashboard = makeDashboard({ feedingEvents });

  return [
    svgLine,
    dashboard
      ? makeExpander({
          title: "Dashboard",
          isOpen: true,
          children: dashboard,
        })
      : null,
    ...Object.entries(days).map(([date, points], idx) =>
      makeExpander({
        title: date,
        children: makeTable({ points, showActions }),
        isOpen: idx === 0,
      })
    ),
  ].join("");
}

export { landingRoute };
