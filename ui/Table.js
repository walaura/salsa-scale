const { DELETE_PATH } = require("../app/routes.js");
const { formatGrams } = require("../app/formatGrams.js");

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
        <tr>
          <td class="weight">${formatGrams(point.weight)}</td>
          <td class="timestamp">${new Date(
            point.timestamp
          ).toLocaleTimeString()}</td>
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
