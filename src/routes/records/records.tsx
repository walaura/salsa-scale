import type { WithId } from "mongodb";
import { RecordsTable } from "./ui/RecordsTable.tsx";
import { Expander } from "../../ui/section/Expander.tsx";
import { type LogEntry } from "../../app/setup/db.ts";
import { getAllData } from "../../app/getData.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { getShouldSeeSecrets, Route, withPage } from "@/app/setup/routes.ts";

async function records({ showActions }: { showActions: boolean }) {
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
    .map(([date, points], idx) => (
      <Expander title={date} isOpen={idx === 0}>
        <RecordsTable points={points} showActions={showActions} />
      </Expander>
    ))
    .join("");
}

const recordsRoute: Route<"get"> = {
  method: "get",
  path: "/records",
  handler: withPage((req) => {
    const showActions = getShouldSeeSecrets(req);
    return records({ showActions });
  }),
};

export { recordsRoute };
