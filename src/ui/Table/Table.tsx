import { ROUTES } from "../../router.ts";
import { formatGrams, formatTimeHtml } from "../../app/format.ts";
import type { LogEntry } from "../../app/setup/db.ts";
import type { WithId } from "mongodb";
import { TableActionsRow } from "./TableActions.tsx";
import { rem, withStyles } from "../../app/styles.ts";

const WeightRow = ({ point }: { point: LogEntry }) => {
  if (point.feedingEventOfSize == null) {
    return formatGrams(point.weight);
  }

  return (
    <div class={className("rowWithIcon")}>
      <img src="/static/cake.gif" alt="Cake" />
      <div class={className("rowWithIconInner")}>
        {formatGrams(point.weight)}
        <strong>
          Feeding event at {formatTimeHtml(point.timestamp)} –{" "}
          {formatGrams(point.feedingEventOfSize)}
        </strong>
      </div>
    </div>
  );
};

const ActionsRow = ({ point }: { point: WithId<LogEntry> }) => (
  <TableActionsRow
    actions={[
      {
        title: "Delete record",
        icon: "bomb",
        href: ROUTES.delet.path.replace(":id", point._id.toString()),
      },
      {
        title: "Mark as LV3 feeding event",
        icon: "fe-add",
        href: ROUTES.markEvent.path
          .replace(":id", point._id.toString())
          .replace(":size", "3"),
      },
      {
        title: "Unset feeding event",
        icon: "fe-rm",
        href: ROUTES.unMarkEvent.path.replace(":id", point._id.toString()),
      },
    ]}
  />
);

const Table = ({
  points,
  showActions = false,
}: {
  points: WithId<LogEntry>[];
  showActions?: boolean;
}) => (
  <table class={className}>
    <thead>
      <tr>
        <th>Weight</th>
        <th>Time</th>
        {showActions ? <th>Actions</th> : null}
      </tr>
    </thead>
    <tbody>
      {points.map((point) => {
        return (
          <tr id={point._id.toString()}>
            {[
              <WeightRow point={point} />,
              formatTimeHtml(point.timestamp),
              showActions ? <ActionsRow point={point} /> : null,
            ]
              .filter((v) => v != null)
              .map((children) => (
                <td>{children} </td>
              ))}
          </tr>
        );
      })}
    </tbody>
  </table>
);

const [className] = withStyles((select) => ({
  contain: "strict",
  overflow: "hidden",
  borderCollapse: "collapse",
  background: "var(--neutral-0)",
  width: "100%",
  ":is(th, td):last-child": {
    textAlign: "end",
  },
  "thead th, tr td": {
    padding: "0.5rem 1rem",
  },
  thead: {
    borderBottom: "1px solid var(--pink-200)",
    th: {
      background: "var(--pink-100)",
      color: "var(--pink-600)",
      fontSize: "var(--font-secondary)",
      fontWeight: "normal",
      fontStyle: "italic",
      textAlign: "start",
    },
  },
  tr: {
    "&:hover": {
      background: "var(--pink-50)",
    },
    td: {
      color: "var(--neutral-400)",
      borderBottom: "1px solid var(--pink-100)",
      fontSize: "var(--font-secondary)",
      strong: {
        fontWeight: "bold",
        color: "var(--neutral-1000)",
        fontSize: "var(--font-primary)",
      },
      [select("rowWithIcon")]: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: "1rem",
        [select("rowWithIconInner")]: {
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: rem(1 / 8),
        },
      },
    },
  },
}));

export { Table };
