import { px, rem, withStyles } from "local-css/css";

export type PivotFilter = {
  label: string;
  isActive: boolean;
  link: URL;
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
        {label}
      </a>
    ))}
  </div>
);

const linkClassname = withStyles((select) => ({
  textDecoration: "none",
  color: "var(--pink-100)",
  transition: "all 1s ease",
  opacity: 0.75,
  boxShadow: "0 0 0 0 transparent",
  background: "transparent",
  willChange: "auto",
  position: "relative",

  ["&::after"]: {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: px(9999),
    zIndex: -1,
    transition: "opacity 1s linear",
    opacity: 0,
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
    "&::after": {
      opacity: 1,
    },
    color: "var(--neutral-0)",
  },
  [`:has(:hover) &:hover`]: {
    opacity: 1,
    background: "color-mix(in hwb, var(--pink-700), transparent 50%)",
    scale: "1.02",
    "&:active": {
      scale: "0.98",
    },
  },
}));

const className = withStyles((select) => ({
  display: "flex",
  fontSize: "var(--font-secondary)",
  gap: rem(-0.5),
  margin: rem(-0.25),
}));

export { Pivot };
