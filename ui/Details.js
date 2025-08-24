const makeDetails = ({ title, children, isOpen, name }) => /* HTML */ `
  <details ${name ? `name="${name}"` : ""} ${isOpen ? "open" : ""}>
    <summary>${title}</summary>
    <div class="details-content">${children}</div>
  </details>
`;
exports.makeDetails = makeDetails;
