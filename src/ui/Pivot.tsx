import { px, rem, withStyles } from "local-css/css";

export type PivotFilter = {
  label: string;
  isActive: boolean;
  link: string | URL;
};

const Pivot = ({
  filters,
  backdrop = "light",
  size = "regular",
}: {
  filters: Array<PivotFilter>;
  backdrop: "light" | "dark";
  size: "large" | "regular";
}) => (
  <div class={className}>
    {filters.map(({ label, isActive, link }) => (
      <a
        data-is-active={isActive}
        data-size={size}
        data-backdrop={backdrop}
        class={linkClassname}
        href={link.toString()}
      >
        <span>{label}</span>
      </a>
    ))}
  </div>
);

const linkClassname = await withStyles((select) => ({
  textDecoration: "none",
  transition: "all .2s ease",
  opacity: 0.75,
  boxShadow: "0 0 0 0 transparent",
  background: "transparent",
  willChange: "auto",
  position: "relative",
  borderRadius: px(9999),
  span: {
    zIndex: 1,
    position: "relative",
  },
  ['&[data-backdrop="light"]']: {
    color:
      "color-mix(in oklab, color-mix(in oklab, var(--pink-600), var(--neutral-600) 50%), transparent 25%)",
    [`:not(:has(:hover)) &[data-is-active="true"]`]: {
      color: "var(--pink-600)",
    },
    [`:has(:hover) &:hover`]: {
      color: "var(--pink-600)",
      background: "color-mix(in hwb, var(--pink-100), transparent 50%)",
    },
    "&::before": {
      background: `
      linear-gradient(
        to bottom, 
        var(--pink-200),
        color-mix(in hwb, var(--pink-200), var(--pink-50) 75%)
      )`,
      boxShadow: [
        "inset 0 1px 1px 0 color-mix(in oklab, var(--pink-400), black 20%)",
        "0 1px 1px 0 color-mix(in oklab, var(--pink-200), white 10%)",
      ].join(", "),
    },
  },
  ['&[data-backdrop="dark"]']: {
    color: "var(--pink-100)",
    [`:not(:has(:hover)) &[data-is-active="true"]`]: {
      color: "var(--neutral-0)",
    },
    [`:has(:hover) &:hover`]: {
      color: "var(--neutral-0)",
      background: "color-mix(in hwb, var(--pink-700), transparent 50%)",
    },
    "&::before": {
      background: `
      linear-gradient(
        to bottom, 
        color-mix(in hwb, var(--pink-600), black 25%),
        color-mix(in hwb, color-mix(in hwb, var(--pink-600), black 12.5%), transparent 75%)
      )`,
      boxShadow: [
        "inset 0 1px 1px 0 color-mix(in oklab, var(--pink-600), black 30%)",
        "0 1px 1px 0 color-mix(in oklab, var(--pink-600), white 10%)",
      ].join(", "),
    },
  },
  ['&[data-size="large"]']: {
    fontSize: "var(--font-primary)",
    fontWeight: 600,
    padding: rem(0.5, 1),
  },
  ['&[data-size="regular"]']: {
    fontSize: "var(--font-secondary)",
    padding: rem(0.25, 1),
  },
  [`:not(:has(:hover)) &[data-is-active="true"]`]: {
    opacity: 1,
  },
  [`:not(:has(:hover)) &[data-is-active="true"]::before`]: {
    opacity: 1,
    scale: "1",
  },
  [`:has(:hover) &:hover`]: {
    opacity: 1,
    scale: "1.02",
    "&:active": {
      scale: "0.98",
    },
  },
  ["&::before"]: {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: px(9999),
    zIndex: 0,
    transition: "all .2s linear",
    opacity: 0,
    scale: 0.5,
  },
}));

const className = await withStyles((select) => ({
  display: "flex",
  fontSize: "var(--font-secondary)",
  gap: rem(-0.5),
  margin: rem(-0.25),
}));

export { Pivot };
