import { MongoClient } from "mongodb";
import { makeChart } from "../ui/Chart.ts";
import { makeTable } from "../ui/Table.ts";
import { makeDetails } from "../ui/Details.ts";
import type { LogEntry } from "../app/db.ts";

const uri = process.env.MONGO_URL as string;

const getData = async ({ chartScale }: { chartScale: number }) => {
  const client = new MongoClient(uri);
  const daysToFetch = Math.max(chartScale, 5, 10);
  try {
    await client.connect();
    const database = client.db("default");
    const logs = database.collection<LogEntry>("logs");
    const list = logs
      .find()
      .sort({ timestamp: -1 })
      .limit(6 * 24 * daysToFetch); // 6 an hour, 14 hours/day

    const points = [];
    for await (const doc of list) {
      points.push(doc);
    }

    return points;
  } finally {
    await client.close();
  }
};

async function indexRoute({
  showActions,
  chartScale,
}: {
  showActions: boolean;
  chartScale: number;
}) {
  const points = await getData({
    chartScale,
  });

  const days: Record<string, typeof points> = {};
  for (const point of points) {
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

  const svgLine = makeDetails({
    title: "Chart",
    children: makeChart({ points, scale: chartScale }),
    isOpen: true,
  });

  const dom = /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Is salsa starving</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body>
        ${svgLine}
        ${Object.entries(days)
          .map(([date, points], idx) =>
            makeDetails({
              title: date,
              children: makeTable({ points, showActions }),
              isOpen: idx === 0,
            })
          )
          .join("")}
      </body>
    </html>`;

  return dom;
}

export { indexRoute };
