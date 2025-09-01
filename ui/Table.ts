import { ROUTES } from "../router.ts";
import { formatGrams, formatTimeHtml } from "../app/format.ts";
import type { LogEntry } from "../app/db.ts";
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
      <th>Timestamp</th>
      ${showActions ? "<th>Actions</th>" : ""}
    </tr>
  </thead>
  <tbody>
    ${points
      .map((point) => {
        return /* HTML */ ` <tr id=${point._id.toString()}>
          ${makeWeightRow({ point })}
          <td class="timestamp">${formatTimeHtml(point.timestamp)}</td>
          ${showActions
            ? /* HTML */ `<td class="actions">
                <a
                  title="delete record"
                  target="_blank"
                  href="${ROUTES.delet.path.replace(
                    ":id",
                    point._id.toString()
                  )}"
                >
                  <img src="/static/bomb.gif" alt="Delete" />
                </a>
              </td>`
            : ""}
        </tr>`;
      })
      .join("")}
  </tbody>
</table>`;

export { makeTable };
