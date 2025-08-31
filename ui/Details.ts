type PivotFilter = { label: string; isActive: boolean; link: URL };

const makePivot = (filters: Array<PivotFilter>) => /* HTML */ `<div
  class="details-pivot"
>
  ${filters
    .map(({ label, isActive, link }) => {
      return /* HTML */ `<a
        class="details-pivot-link ${isActive
          ? "details-pivot-link-active"
          : ""}"
        href="${link.toString()}"
      >
        ${label}
      </a>`;
    })
    .join("")}
</div>`;

const makeDetails = ({
  title,
  children,
  isOpen,
  name,
  pivot,
}: {
  title: string;
  children: string;
  isOpen: boolean;
  name?: string;
  pivot?: Array<PivotFilter>;
}) => {
  return /* HTML */ `
    <details ${name ? `name="${name}"` : ""} ${isOpen ? "open" : ""}>
      <summary>
        <span class="details-title">
          <img src="./static/drop.gif" alt="" />
          ${title}</span
        >${pivot
          ? /* HTML */ ` <span class="details-aside">${makePivot(pivot)}</span>`
          : ""}
      </summary>
      <div class="details-content">${children}</div>
    </details>
  `;
};

export { makeDetails };
