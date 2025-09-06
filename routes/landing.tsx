import type { WithId } from "mongodb";
import { makeChart } from "../ui/Chart.ts";
import { makeTable } from "../ui/Table.ts";
import { Expander } from "../ui/section/Expander.tsx";
import { makeDashboard } from "../ui/Dashboard.ts";
import { type LogEntry } from "../app/setup/db.ts";
import { StickySection } from "../ui/section/StickySection.tsx";
import { getAllData } from "../app/getData.ts";

async function landingRoute({
  showActions,
  chartScale,
  url,
}: {
  showActions: boolean;
  chartScale: number;
  url: URL;
}) {
  const all = await getAllData({
    daysToFetch: chartScale + 1,
  });
  const feedingEvents = all.filter((entry) => entry.feedingEventOfSize != null);

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
    { label: "6h", value: 0.25 },
    { label: "12h", value: 0.5 },
    { label: "24h", value: 1 },
    { label: "3d", value: 3 },
    { label: "7d", value: 7 },
  ].map((f) => {
    const link = new URL(url);
    link.searchParams.set("scale", f.value.toString());
    return { ...f, isActive: f.value === chartScale, link };
  });
  const svgLine = (
    <Expander title="Chart" pivot={pivot} isOpen={true}>
      {makeChart({ points: all, scale: chartScale })}
    </Expander>
  );

  const dashboard = makeDashboard({ feedingEvents });

  return [
    <StickySection>{svgLine}</StickySection>,
    dashboard ? (
      <Expander title="Dashboard" isOpen={true}>
        {dashboard}
      </Expander>
    ) : null,
    ...Object.entries(days).map(([date, points], idx) => (
      <Expander title={date} isOpen={idx === 0}>
        {makeTable({ points, showActions })}
      </Expander>
    )),
  ].join("");
}

export { landingRoute };
