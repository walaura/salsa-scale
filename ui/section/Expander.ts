import { withStyles } from "../../app/styles.ts";

type PivotFilter = { label: string; isActive: boolean; link: URL };

const makePivot = (filters: Array<PivotFilter>) => /* HTML */ `<div
  class="${className}-pivot"
>
  ${filters
    .map(({ label, isActive, link }) => {
      return /* HTML */ `<a
        class="${className}-pivot-link ${isActive
          ? `${className}-pivot-link-active`
          : ""}"
        href="${link.toString()}"
      >
        ${label}
      </a>`;
    })
    .join("")}
</div>`;

const makeExpander = ({
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
    <details
      class="${className}"
      ${name ? `name="${name}"` : ""}
      ${isOpen ? "open" : ""}
    >
      <summary>
        <span class="${className}-title">
          <div class="${className}-title-drop"></div>
          ${title}
        </span>
        ${pivot
          ? /* HTML */ ` <span class="${className}-aside"
              >${makePivot(pivot)}</span
            >`
          : ""}
      </summary>
      <div class="${className}-content">${children}</div>
    </details>
  `;
};

const [className] = withStyles((select) => ({
  "--radius": "1rem",
  borderRadius: "var(--radius)",
  boxShadow: "0 1px 6px 1px rgba(0, 0, 0, 0.25)",
  overflow: "hidden",
  transformOrigin: "center 1rem",
  transition: "transform 0.2s ease",
  ":has(summary:active)": {
    transform: "scale(0.995)",
  },
  summary: {
    padding: "calc(0.75rem + 2px) calc(1rem + 2px)",
    backgroundColor: "var(--pink-600)",
    boxShadow:
      "inset 0 -1px 2px 0 color-mix(in oklab, var(--pink-600), black 10%), inset 0 1px 1px 0 color-mix(in oklab, var(--pink-600), white 50%)",
    background:
      "linear-gradient(to bottom, color-mix(in oklab, var(--pink-600), white 30%) 0%, var(--pink-600) 100%)",
    color: "var(--neutral-0)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  [select("content")]: {
    border: "1px solid var(--pink-300)",
    borderTop: "none",
    borderBottomLeftRadius: "var(--radius)",
    borderBottomRightRadius: "var(--radius)",
    overflow: "hidden",
    contain: "content",
    position: "relative",
  },
  [select("title")]: {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    [select("title-drop")]: {
      width: "16px",
      height: "16px",
      transition: "transform 0.4s ease",
      transform: "rotate(-90deg)",
      maskImage: "url(/static/drop.gif)",
      display: "block",
      background: "var(--neutral-0)",
    },
  },
  [`&[open] ${select("title")} ${select("title-drop")}`]: {
    transform: "rotate(0deg)",
  },
  [select("pivot")]: {
    display: "flex",
    fontSize: "var(--font-secondary)",
    gap: "-0.5rem",
    margin: "-0.25rem",
    [`${select("pivot-link")}`]: {
      textDecoration: "none",
      padding: "0.25rem 1rem",
      borderRadius: "999px",
      color: "var(--pink-200)",
      "&:hover": {
        color: "var(--neutral-0)",
      },
      [`&${select("pivot-link-active")}`]: {
        opacity: 1,
        background: "color-mix(in oklab, var(--pink-700), transparent 20%)",
        color: "var(--neutral-0)",
        boxShadow:
          "inset 0 1px 1px 0 color-mix(in oklab, var(--pink-700), #000 20%)",
      },
    },
  },
}));

export { makeExpander };
