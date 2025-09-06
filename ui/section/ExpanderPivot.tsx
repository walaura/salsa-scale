import { px, rem, withStyles } from "../../app/styles.ts";

type PivotFilter = {
  label: string;
  isActive: boolean;
  link: URL;
};

const ExpanderPivot = ({ filters }: { filters: Array<PivotFilter> }) => (
  <div class={className}>
    {filters.map(({ label, isActive, link }) => (
      <a
        data-is-active={isActive}
        class={className("link")}
        href={link.toString()}
      >
        {label}
      </a>
    ))}
  </div>
);

const [className] = withStyles((select) => ({
  display: "flex",
  fontSize: "var(--font-secondary)",
  gap: rem(-0.5),
  margin: rem(-0.25),
  [select("link")]: {
    textDecoration: "none",
    padding: rem(0.25, 1),
    borderRadius: px(9999),
    color: "var(--pink-200)",
    transition: "all .2s ease",
  },
  [`&:not(:has(:hover)) ${select("link")}[data-is-active="true"], ${select(
    "link"
  )}:hover`]: {
    opacity: 1,
    background: "color-mix(in oklab, var(--pink-700), transparent 20%)",
    color: "var(--neutral-0)",
    boxShadow:
      "inset 0 1px 1px 0 color-mix(in oklab, var(--pink-700), #000 20%)",
  },
}));

export { ExpanderPivot };
