import { Icon } from "@/ui/Icon.tsx";
import {
  isFeedingEvent,
  maybeMergePreviousFeedingEvent,
} from "../../app/feedingEvent.ts";
import { getAllData } from "../../app/getData.ts";
import { Expander } from "../../ui/Page/Expander.tsx";
import { Table } from "@/ui/Table/Table.tsx";
import { makePopoverWithTrigger } from "@/ui/Popover.tsx";
import { Button } from "@/ui/Button/Button.tsx";
import { px } from "lib/css/css.ts";
import { Route, withPage } from "@/app/setup/routes.ts";
import { Dashboard } from "@/ui/Dashboard.tsx";

async function backtestFeedingEvent() {
  const all = await getAllData({
    daysToFetch: 1,
  });

  let allResults = [];
  let mismatchResults = [];

  let newPositivesCount = 0;
  let newNegativesCount = 0;

  for (const point of all) {
    const sixNextPoints = all.slice(
      all.indexOf(point) + 1,
      all.indexOf(point) + 7,
    );

    const [shouldBeFeedingEvent, shouldBeSize, debugData] = isFeedingEvent(
      point.weight,
      sixNextPoints.map((p) => p.weight),
    );
    const [shouldBeFinalSize, eventsToMerge] = shouldBeFeedingEvent
      ? maybeMergePreviousFeedingEvent(shouldBeSize, sixNextPoints)
      : [shouldBeSize, []]; // todo, run backwards and use should bes instead of db data

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

      was: () => (
        <>
          <Icon icon={wasFeedingEvent ? "yay" : "nay"} />
          {wasFeedingEvent ? <span>({point.feedingEventOfSize})</span> : null}
        </>
      ),
      will: () => (
        <>
          <Icon icon={shouldBeFeedingEvent ? "yay" : "nay"} />
          {shouldBeFeedingEvent ? <span>({shouldBeFinalSize})</span> : null}
        </>
      ),
      weight: () => point.weight.toString(),
      nextPoints: () => sixNextPoints.map((p) => p.weight).join(", "),
      debug: () => {
        const debugDataStr = JSON.stringify(debugData.extra, null, 2);
        const [debugPopover, debugTriggerProps] = makePopoverWithTrigger({
          id: point._id.toString(),
          popover: {
            children: (
              <pre
                style={{
                  minWidth: px(300),
                  textAlign: "left",
                }}
              >
                {debugDataStr}
              </pre>
            ),
          },
        });

        return (
          <>
            {debugDataStr ? (
              <>
                {debugPopover}
                <Button label={debugData.outcome} {...debugTriggerProps} />
              </>
            ) : (
              debugData.outcome
            )}
          </>
        );
      },
      debugMerge: () => {
        const eventsToMergeStr = eventsToMerge.length
          ? eventsToMerge.join(", ")
          : null;
        const [mergePopover, mergeTriggerProps] = makePopoverWithTrigger({
          id: point._id.toString() + "-merge",
          popover: {
            children: (
              <pre
                style={{
                  minWidth: px(300),
                  textAlign: "left",
                }}
              >
                {eventsToMergeStr}
              </pre>
            ),
          },
        });

        return (
          <>
            {eventsToMergeStr ? (
              <>
                {mergePopover}
                <Button label="Merged with" {...mergeTriggerProps} />
              </>
            ) : null}
          </>
        );
      },
      timestamp: () => (
        <time dateTime={new Date(point.timestamp).toISOString()}>
          {new Date(point.timestamp).toLocaleString()} (
          {rtf1.format(
            Math.round((point.timestamp - Date.now()) / 1000 / 60),
            "minute",
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
    { title: "Debug merge", key: "debugMerge", visible: false },
    { title: "Timestamp", key: "timestamp" },
  ] as const;

  return (
    <>
      <Expander title="Summary" isOpen={true}>
        <Dashboard
          widgets={[
            {
              title: "new positives",
              fact: newPositivesCount.toString(),
              icon: "yay",
            },
            {
              title: "new negatives",
              fact: newNegativesCount.toString(),
              icon: "nay",
            },
          ]}
        />
      </Expander>
      <Expander title="Mismatches" isOpen={true} name="root">
        <Table columns={COLUMNS} data={mismatchResults} />
      </Expander>
      <Expander title="All results" isOpen={false} name="root">
        <Table columns={COLUMNS} data={allResults} />
      </Expander>
    </>
  );
}

export const backtestFeedingEventRoute: Route<"get"> = {
  method: "get",
  path: "/internal/backtest-feeding-event",
  handler: withPage(() => {
    return backtestFeedingEvent();
  }),
};
