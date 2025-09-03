import { ROUTES } from "../router.ts";
import { formatGrams, formatTimeHtml } from "../app/format.ts";
import type { LogEntry } from "../app/setup/db.ts";
import type { WithId } from "mongodb";
import { makePopoverAndTrigger } from "./Popover.ts";
import { makeButton } from "./Button.ts";

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
      ${ACTIONS.map((action) => {
        const popoverId = `actions-popover-${point._id}-${action.icon}`;
        return /* HTML */ `
          <div class="actions-action">
            ${makePopoverAndTrigger({
              id: popoverId,
              trigger: {
                children: /* HTML */ `<img
                  src="/static/${action.icon}.gif"
                  alt="${action.title}"
                />`,
                title: action.title,
              },
              popover: {
                children: /* HTML */ `<span>${action.title}?</span>
                  ${makeButton({
                    label: "Confirm",
                    href: action.href,
                    target: "_blank",
                  })}`,
              },
            }).join("")}
          </div>
        `;
      }).join("")}
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
