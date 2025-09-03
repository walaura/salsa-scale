import type { WithId } from "mongodb";
import { makeChart } from "../ui/Chart.ts";
import { makeTable } from "../ui/Table.ts";
import { makeExpander } from "../ui/section/Expander.ts";
import { makeDashboard } from "../ui/Dashboard.ts";
import { type LogEntry } from "../app/setup/db.ts";
import { makeStickySection } from "../ui/section/StickySection.ts";
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
    makeStickySection({
      children: svgLine,
    }),
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
