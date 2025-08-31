const makeDetails = ({
  title,
  children,
  isOpen,
  name,
}: {
  title: string;
  children: string;
  isOpen: boolean;
  name?: string;
}) => /* HTML */ `
  <details ${name ? `name="${name}"` : ""} ${isOpen ? "open" : ""}>
    <summary>${title}</summary>
    <div class="details-content">${children}</div>
  </details>
`;

export { makeDetails };
