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
      .map((point, index, val) => {
        const up2 = val[index + 2] ? val[index + 2].weight : 0;
        const up1 = val[index + 1] ? val[index + 1].weight : 0;

        const diff = point.weight - up1 + up1 - up2;
        let weightRow = /* HTML */ `<td class="weight">
          ${formatGrams(point.weight)}
        </td>`;
        if (diff <= -5 && point.__consumed !== true) {
          val[index + 1].__consumed = true;
          weightRow = /* HTML */ `<td class="weight weight-highlight">
            <img src="/static/cake.gif" alt="Cake" />&nbsp;&nbsp;
            ${formatGrams(point.weight)} - Feeding event?
            (${formatGrams(Math.abs(diff))})
          </td>`;
        }
        return `
        <tr id=${point._id.toString()}>
          ${weightRow}
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
        </tr>`;
      })
      .join("")}
  </tbody>
</table>`;
exports.makeTable = makeTable;
