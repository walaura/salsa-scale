import { isFeedingEvent } from "../app/feedingEvent.ts";
import { getAllData } from "../app/getData.ts";
import { Expander } from "../ui/section/Expander.tsx";
import { Table } from "@/ui/Table/Table.tsx";

async function backtestFeedingEventRoute() {
  const all = await getAllData({
    daysToFetch: 1,
  });

  let allResults = [];
  let mismatchResults = [];

  let newPositivesCount = 0;
  let newNegativesCount = 0;

  for (const point of all) {
    const sixNextPoints = all
      .slice(all.indexOf(point) + 1, all.indexOf(point) + 7)
      .map((p) => p.weight);

    const [shouldBeFeedingEvent, shouldBeSize, debugData] = isFeedingEvent(
      point.weight,
      sixNextPoints
    );
    const wasFeedingEvent = point.feedingEventOfSize != null;
    if (shouldBeFeedingEvent && !wasFeedingEvent) {
      newPositivesCount++;
    }
    if (!shouldBeFeedingEvent && wasFeedingEvent) {
      newNegativesCount++;
    }

    const rtf1 = new Intl.RelativeTimeFormat("en", { style: "short" });

    const cell = {
      key: point._id.toString(),
      was: () => (wasFeedingEvent ? `✅ (${point.feedingEventOfSize})` : ` ❌`),
      will: () => (shouldBeFeedingEvent ? `✅ (${shouldBeSize})` : ` ❌`),
      weight: () => point.weight.toString(),
      nextPoints: () => sixNextPoints.join(", "),
      debug: () => (
        <pre>
          <details>
            <summary>{debugData.outcome}</summary>
            {JSON.stringify(debugData, null, 2)}
          </details>
        </pre>
      ),
      timestamp: () => (
        <time dateTime={new Date(point.timestamp).toISOString()}>
          {new Date(point.timestamp).toLocaleString()} (
          {rtf1.format(
            Math.round((point.timestamp - Date.now()) / 1000 / 60),
            "minute"
          )}
          )
        </time>
      ),
    };

    allResults.push(cell);
    if (shouldBeFeedingEvent != wasFeedingEvent) {
      mismatchResults.push(cell);
    }
  }

  const COLUMNS = [
    { title: "Was", key: "was" },
    { title: "Will", key: "will" },
    { title: "Weight", key: "weight" },
    { title: "Next points", key: "nextPoints" },
    { title: "Debug", key: "debug" },
    { title: "Timestamp", key: "timestamp" },
  ] as const;

  return (
    <>
      <Expander title="Summary" isOpen={true}>
        <>
          {newPositivesCount} new positives / {newNegativesCount} new negatives.
        </>
      </Expander>
      <Expander title="Mismatches" isOpen={true}>
        <Table columns={COLUMNS} data={mismatchResults} />
      </Expander>
      <Expander title="All results" isOpen={false}>
        <Table columns={COLUMNS} data={allResults} />
      </Expander>
    </>
  );
}

export { backtestFeedingEventRoute };
