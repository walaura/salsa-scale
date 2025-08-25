const { DELETE_PATH } = require("../app/routes.js");
const { formatGrams, formatTimeHtml } = require("../app/format.js");

const makeTable = ({ points, showActions = false }) => /* HTML */ `<table
  class="container"
>
  <thead>
    <tr>
      <th>Weight</th>
      <th>Timestamp</th>
      ${showActions ? "<th>Actions</th>" : ""}
    </tr>
  </thead>
  <tbody>
    ${points
      .map(
        (point) => `
        <tr id=${point._id.toString()}>
          <td class="weight">${formatGrams(point.weight)}</td>
          <td class="timestamp">${formatTimeHtml(point.timestamp)}</td>
          ${
            showActions
              ? /* HTML */ `<td class="actions">
                  <a
                    title="delete record"
                    target="_blank"
                    href="${DELETE_PATH.replace(":id", point._id.toString())}"
                  >
                    <img src="/static/bomb.gif" alt="Delete" />
                  </a>
                </td>`
              : ""
          }
        </tr>`
      )
      .join("")}
  </tbody>
</table>`;
exports.makeTable = makeTable;
