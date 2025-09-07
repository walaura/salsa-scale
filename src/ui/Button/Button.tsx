import { joinStyles, px, rem, StyleSelectors, withStyles } from "local-css/css";
import { JSXNode } from "local-tsx/jsx-runtime";

const Button = ({
  label,
  href,
  target = "_self",
  styles = [],
  size = "regular",
  ...passThroughProps
}: {
  label: JSXNode;
  href?: string;
  target?: string;
  styles?: StyleSelectors;
  popoverTarget?: string;
  size?: "large" | "regular";
}) => {
  const Element = href ? "a" : "button";
  return (
    <Element
      {...joinStyles(className, styles)}
      href={href}
      data-size={size}
      target={target}
      {...passThroughProps}
    >
      {label}
    </Element>
  );
};

const className = withStyles(() => ({
  cursor: "pointer",
  display: "block",
  borderRadius: px(9999),
  textDecoration: "none",
  fontSize: "var(--font-primary)",
  appearance: "none",
  border: "none",
  textAlign: "center",
  ['&[data-size="large"]']: {
    fontWeight: 800,
    fontSize: "var(--font-primary)",
    color: "var(--neutral-0)",
    padding: rem(0.5, 1),
    boxShadow: `inset 0 -1px 2px 0 color-mix(in oklab, var(--pink-600), black 10%), 
    inset 0 1px 1px 0 color-mix(in oklab, var(--pink-600), white 50%)`,
    background: `linear-gradient(
    to bottom, 
    color-mix(in oklab, var(--pink-600), white 30%) 0%, 
    var(--pink-600) 100%
  )`,
  },
  ['&[data-size="regular"]']: {
    padding: rem(0.33, 0.5),
    fontSize: "var(--font-primary)",
    color: "var(--neutral-1000)",
    boxShadow: `inset 0 -1px 2px 0 color-mix(in oklab, var(--pink-100), black 10%), 
    inset 0 1px 1px 0 color-mix(in oklab, var(--pink-100), white 5%)`,
    background: `linear-gradient(
    to top, 
    color-mix(in oklab, var(--pink-100), transparent 20%) 0%, 
    var(--pink-100) 100%
  )`,
  },
  "&:active": {
    opacity: 0.8,
    scale: 0.98,
  },
  img: {
    display: "block",
  },
}));

export { Button, className as buttonClassName };
