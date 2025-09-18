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
import { px, rem } from "lib/css/css.ts";
import { Route, withPage } from "@/app/setup/routes.ts";
import { Dashboard } from "@/ui/Dashboard.tsx";
import { JSXNode } from "local-tsx/jsx-runtime";

async function backtestFeedingEvent() {
  const all = (
    await getAllData({
      daysToFetch: 1,
    })
  ).reverse();

  let allResults = [];
  let mismatchResults = [];
  let eventsMergedInto: { [key: string]: string[] } = {};

  let newPositivesCount = 0;
  let newNegativesCount = 0;

  for (const point of all) {
    const sixNextPoints = all
      .slice(all.indexOf(point) - 6, all.indexOf(point))
      .reverse();

    const [shouldBeFeedingEvent, shouldBeSize, debugData] = isFeedingEvent(
      point.weight,
      sixNextPoints.map((p) => p.weight),
    );
    if (shouldBeFeedingEvent) {
      all[all.indexOf(point)] = { ...point, feedingEventOfSize: shouldBeSize };
    }
    const [shouldBeFinalSize, eventsToMerge] = shouldBeFeedingEvent
      ? maybeMergePreviousFeedingEvent(shouldBeSize, sixNextPoints)
      : [shouldBeSize, []];

    for (const e of eventsToMerge) {
      all.map((p) =>
        p._id.toString() === e.toString()
          ? { ...p, feedingEventOfSize: null }
          : p,
      );
      eventsMergedInto[e.toString()] = [
        ...(eventsMergedInto[e.toString()] || []),
        point._id.toString(),
      ];
    }

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
          <Icon
            icon={
              shouldBeFeedingEvent
                ? eventsMergedInto[point._id.toString()]?.length
                  ? "up-arrow"
                  : "yay"
                : "nay"
            }
          />
          {shouldBeFeedingEvent ? <span>({shouldBeFinalSize})</span> : null}
        </>
      ),
      weight: () => point.weight.toString(),
      nextPoints: () => sixNextPoints.map((p) => p.weight).join(", "),
      debug: () => {
        const debugDataStr = JSON.stringify(debugData.extra, null, 2);
        const [debugPopover, debugTriggerProps] = makePopoverWithTrigger({
          popover: {
            children: <Debug>{debugDataStr}</Debug>,
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
        const eventsMergedIntoStr = (
          eventsMergedInto[point._id.toString()] ?? []
        ).join(", ");
        const eventsToMergeStr = eventsToMerge.length
          ? eventsToMerge.join(", ")
          : null;
        const [mergePopover, mergeTriggerProps] = makePopoverWithTrigger({
          popover: {
            children: <Debug>{eventsToMergeStr}</Debug>,
          },
        });
        const [mergeIntoPopover, mergeIntoTriggerProps] =
          makePopoverWithTrigger({
            popover: {
              children: <Debug>{eventsMergedIntoStr}</Debug>,
            },
          });

        return (
          <>
            {eventsToMergeStr ? (
              <>
                {mergePopover}
                <Button
                  label={`Merging ${eventsToMerge.length}`}
                  {...mergeTriggerProps}
                />
              </>
            ) : null}
            {eventsMergedIntoStr ? (
              <>
                {mergeIntoPopover}
                <Button
                  label={`Merged into ${eventsMergedInto[point._id.toString()].length}`}
                  {...mergeIntoTriggerProps}
                />
              </>
            ) : null}
          </>
        );
      },
      timestamp: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: px(4) }}>
          <time dateTime={new Date(point.timestamp).toISOString()}>
            {new Date(point.timestamp).toLocaleString()} (
            {rtf1.format(
              Math.round((point.timestamp - Date.now()) / 1000 / 60),
              "minute",
            )}
            )
          </time>
          <em style={{ fontSize: rem(1 / 2) }}>{point._id.toString()}</em>
        </div>
      ),
    };

    allResults.unshift(cell);
    if (shouldBeFeedingEvent != wasFeedingEvent) {
      mismatchResults.unshift(cell);
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

const Debug = ({ children }: { children: JSXNode }) => (
  <pre
    style={{
      minWidth: px(300),
      textAlign: "left",
    }}
  >
    {children}
  </pre>
);

export const backtestFeedingEventRoute: Route<"get"> = {
  method: "get",
  path: "/internal/backtest-feeding-event",
  handler: withPage(() => {
    return backtestFeedingEvent();
  }),
};
