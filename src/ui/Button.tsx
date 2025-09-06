import { px, rem, withStyles } from "local-css/css";

const Button = ({
  label,
  href,
  target = "_self",
}: {
  label: string;
  href: string;
  target?: string;
}) => (
  <a class={className} href={href} target={target}>
    {label}
  </a>
);

const className = withStyles(() => ({
  boxShadow: `inset 0 -1px 2px 0 color-mix(in oklab, var(--pink-600), black 10%), 
    inset 0 1px 1px 0 color-mix(in oklab, var(--pink-600), white 50%)`,
  background: `linear-gradient(
    to bottom, 
    color-mix(in oklab, var(--pink-600), white 30%) 0%, 
    var(--pink-600) 100%
  )`,
  color: "var(--neutral-0)",
  cursor: "pointer",
  display: "block",
  fontWeight: 800,
  padding: rem(0.5, 1),
  borderRadius: px(9999),
  textDecoration: "none",
  fontSize: "var(--font-primary)",
}));

export { Button };
