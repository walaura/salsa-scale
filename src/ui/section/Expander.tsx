import { JSX } from "local-tsx/jsx-runtime";
import { px, rem, withStyles } from "local-css/css";
import { Pivot, PivotFilter } from "../Pivot.tsx";

const Expander = ({
  title,
  children,
  isOpen,
  name,
  pivot,
}: {
  title: string;
  children: JSX.Element | string;
  isOpen: boolean;
  name?: string;
  pivot?: Array<PivotFilter>;
}) => (
  <details class={className} name={name} open={isOpen}>
    <summary class={className("summary")}>
      <span class={className("title")}>
        <div class={className("title-drop")}></div>
        {title}
      </span>
      {pivot ? <Pivot filters={pivot} /> : null}
    </summary>
    <div class={className("content")}>{children}</div>
  </details>
);

const className = withStyles((select) => ({
  "--radius": "1rem",
  borderRadius: "var(--radius)",
  boxShadow: "0 1px 6px 1px rgba(0, 0, 0, 0.25)",
  overflow: "hidden",
  transformOrigin: rem("center", 1),
  transition: "transform 0.2s ease",
  "&:has(summary:active)": {
    transform: "scale(0.995)",
  },
  [select("summary")]: {
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
    gap: rem(0.5),
    [select("title-drop")]: {
      width: px(16),
      height: px(16),
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
    gap: rem(-0.5),
    margin: rem(-0.25),
    [select("pivot-link")]: {
      textDecoration: "none",
      padding: rem(0.25, 1),
      borderRadius: px(9999),
      color: "var(--pink-200)",
      transition: "all .2s ease",
    },
    [`&:not(:has(:hover)) ${select(
      "pivot-link"
    )}[data-is-active="true"], ${select("pivot-link")}:hover`]: {
      opacity: 1,
      background: "color-mix(in oklab, var(--pink-700), transparent 20%)",
      color: "var(--neutral-0)",
      boxShadow:
        "inset 0 1px 1px 0 color-mix(in oklab, var(--pink-700), #000 20%)",
    },
  },
}));

export { Expander };
