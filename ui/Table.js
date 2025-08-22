const makeTable = ({ points }) => /* HTML */ `<table class="container">
  <thead>
    <tr>
      <th>Weight</th>
      <th>Timestamp</th>
    </tr>
  </thead>
  <tbody>
    ${points
      .map(
        (point) => `
        <tr>
          <td class="weight">${point.weight}g</td>
          <td class="timestamp">${new Date(
            point.timestamp
          ).toLocaleTimeString()}</td>
        </tr>`
      )
      .join("")}
  </tbody>
</table>`;
exports.makeTable = makeTable;
