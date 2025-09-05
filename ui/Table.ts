import { ROUTES } from "../router.ts";
import { formatGrams, formatTimeHtml } from "../app/format.ts";
import type { LogEntry } from "../app/setup/db.ts";
import type { WithId } from "mongodb";
import { makeTableActionsRow } from "./Table/TableActions.ts";
import { css, withStyles } from "../app/setup/styles.ts";

const makeWeightRow = ({ point }: { point: LogEntry }) => {
  if (point.feedingEventOfSize == null) {
    return formatGrams(point.weight);
  }

  return /* HTML */ `<div class="${className("rowWithIcon")}">
    <img src="/static/cake.gif" alt="Cake" />
    <div>
      ${formatGrams(point.weight)}<br />
      <strong>
        Feeding event at ${formatTimeHtml(point.timestamp)} –
        ${formatGrams(point.feedingEventOfSize)}
      </strong>
    </div>
  </div>`;
};

const makeActionsRow = ({ point }: { point: WithId<LogEntry> }) =>
  makeTableActionsRow({
    actions: [
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
    ],
  });

const makeTable = ({
  points,
  showActions = false,
}: {
  points: WithId<LogEntry>[];
  showActions?: boolean;
}) => /* HTML */ ` <table class="${className}">
  <thead>
    <tr>
      <th>Weight</th>
      <th>Time</th>
      ${showActions ? "<th>Actions</th>" : ""}
    </tr>
  </thead>
  <tbody>
    ${points
      .map((point) => {
        return /* HTML */ ` <tr id=${point._id.toString()}>
          ${[
            makeWeightRow({ point }),
            formatTimeHtml(point.timestamp),
            showActions ? makeActionsRow({ point }) : undefined,
          ]
            .filter((v) => v != null)
            .map((children) => makeTd({ children }))
            .join("")}
        </tr>`;
      })
      .join("")}
  </tbody>
</table>`;

const makeTd = ({ children }: { children: string }) =>
  /* HTML */ `<td>${children}</td>`;

const [className] = withStyles(
  (root) => css`
    ${root} {
      contain: strict;
      overflow: hidden;
      border-collapse: collapse;
      background: var(--neutral-0);
      width: 100%;
      :is(th, td):last-child {
        text-align: end;
      }

      thead th,
      tr td {
        padding: 0.5rem 1rem;
      }

      thead {
        border-bottom: 1px solid var(--pink-200);
        th {
          background: var(--pink-100);
          color: var(--pink-600);
          font-size: var(--font-secondary);
          font-weight: normal;
          font-style: italic;
          text-align: start;
        }
      }

      tr {
        &:hover {
          background: var(--pink-50);
        }
        td {
          color: var(--neutral-400);
          border-bottom: 1px solid var(--pink-100);
          font-size: var(--font-secondary);
          strong {
            font-weight: bold;
            color: var(--neutral-1000);
            font-size: var(--font-primary);
          }
          ${root("rowWithIcon")} {
            display: flex;
            align-items: flex-start;
            flex-direction: row;
            gap: 1rem;
          }
        }
      }
    }
  `
);

export { makeTable };
