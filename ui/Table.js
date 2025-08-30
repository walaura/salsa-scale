const { DELETE_PATH } = require("../app/routes.js");
const { formatGrams, formatTimeHtml } = require("../app/format.js");

const makeWeightRow = ({ point, index, val }) => {
  if (point.isFeedingEvent !== true) {
    return /* HTML */ `<td class="weight">${formatGrams(point.weight)}</td>`;
  }

  return /* HTML */ ` <td class="weight">
    <div class="row-with-icon">
      <img src="/static/cake.gif" alt="Cake" />
      <div>
        ${formatGrams(point.weight)}<br />
        <strong>
          Feeding event at ${formatTimeHtml(point.timestamp)} –
          ${formatGrams(Math.abs(point.weight - val[index + 2].weight))}
        </strong>
      </div>
    </div>
  </td>`;
};

const makeTable = ({ points, showActions = false }) => /* HTML */ ` <table
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
      .map((point, index, val) => {
        return /* HTML */ ` <tr id=${point._id.toString()}>
          ${makeWeightRow({ point, index, val })}
          <td class="timestamp">${formatTimeHtml(point.timestamp)}</td>
          ${showActions
            ? /* HTML */ `<td class="actions">
                <a
                  title="delete record"
                  target="_blank"
                  href="${DELETE_PATH.replace(":id", point._id.toString())}"
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

exports.makeTable = makeTable;
