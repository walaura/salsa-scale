import { ROUTES } from "../router.ts";
import { formatGrams, formatTimeHtml } from "../app/format.ts";
import type { LogEntry } from "../app/setup/db.ts";
import type { WithId } from "mongodb";

const makeWeightRow = ({ point }: { point: LogEntry }) => {
  if (point.feedingEventOfSize == null) {
    return /* HTML */ `<td class="weight">${formatGrams(point.weight)}</td>`;
  }

  return /* HTML */ ` <td class="weight">
    <div class="row-with-icon">
      <img src="/static/cake.gif" alt="Cake" />
      <div>
        ${formatGrams(point.weight)}<br />
        <strong>
          Feeding event at ${formatTimeHtml(point.timestamp)} –
          ${formatGrams(point.feedingEventOfSize)}</strong
        >
      </div>
    </div>
  </td>`;
};

const makeActionsRow = ({ point }: { point: WithId<LogEntry> }) => {
  const ACTIONS = [
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
  ];

  return /* HTML */ `<td>
    <div class="actions">
      ${ACTIONS.map(
        (action) => /* HTML */ `
          <div class="actions-action">
            <div
              class="popover"
              popover
              id="actions-popover-${point._id}-${action.icon}"
            >
              ${action.title}?
              <a target="_blank" href="${action.href}"> Confirm </a>
            </div>
            <button
              title="${action.title}"
              popovertarget="actions-popover-${point._id}-${action.icon}"
            >
              <img src="/static/${action.icon}.gif" alt="${action.title}" />
            </button>
          </div>
        `
      ).join("")}
    </div>
  </td>`;
};

const makeTable = ({
  points,
  showActions = false,
}: {
  points: WithId<LogEntry>[];
  showActions?: boolean;
}) => /* HTML */ ` <table class="container">
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
          ${makeWeightRow({ point })}
          <td class="timestamp">${formatTimeHtml(point.timestamp)}</td>
          ${showActions ? makeActionsRow({ point }) : ""}
        </tr>`;
      })
      .join("")}
  </tbody>
</table>`;

export { makeTable };
