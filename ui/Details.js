const makeDetails = ({ title, children, isOpen }) => /* HTML */ `
  <details ${isOpen ? "open" : ""}>
    <summary>${title}</summary>
    <div class="details-content">${children}</div>
  </details>
`;
exports.makeDetails = makeDetails;
