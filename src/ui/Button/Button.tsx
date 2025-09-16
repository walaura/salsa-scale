import { joinStyles, px, rem, StyleProp, withStyles } from "local-css/css";
import { JSXNode } from "local-tsx/jsx-runtime";

type BaseButtonProps = {
  label: JSXNode;
  target?: string;
  styles?: StyleProp;
  popoverTarget?: string;
  size?: "large" | "regular";
  type?: "primary" | "secondary";
};

type HrefButtonProps = BaseButtonProps & {
  href: string;
  target?: undefined | "_blank";
};

type FormButtonProps = BaseButtonProps & {
  action?: "submit";
};

const Button = ({
  label,
  styles = [],
  size = "regular",
  type = "secondary",
  popoverTarget,
  ...otherProps
}: HrefButtonProps | FormButtonProps) => {
  const sharedElementProps = {
    ...joinStyles(className, styles),
    "data-size": size,
    "data-type": type,
    popoverTarget,
  };

  if ("href" in otherProps) {
    const { target, href } = otherProps;
    return <a {...sharedElementProps} href={href} target={target} />;
  }

  return (
    <button {...sharedElementProps} type={otherProps.action}>
      {label}
    </button>
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
  transition: "all 0.1s ease-in-out",
  ['&[data-type="primary"]']: {
    color: "var(--pink-50)",
    boxShadow: [
      `inset 0 -1px 1px 0 color-mix(in hwb, var(--pink-600), black 20%)`,
      `inset 0 1px 1px 0 color-mix(in hwb, var(--pink-600), white 60%)`,
      `inset 0 -3px 6px 0 color-mix(in hwb, var(--pink-600), black 10%)`,
      `inset 0 3px 6px 0 color-mix(in hwb, var(--pink-600), white 30%)`,
    ].join(","),
    background: `linear-gradient(
      to bottom, 
      color-mix(in hwb, var(--pink-600), white 30%) 0%, 
      var(--pink-600) 100%
    )`,
  },
  ['&[data-type="secondary"]']: {
    color: "var(--pink-800)",
    boxShadow: [
      `inset 0 -1px 1px 0 color-mix(in hwb, var(--pink-100), black 10%)`,
      `inset 0 1px 1px 0 color-mix(in hwb, var(--pink-100), white 20%)`,
      `inset 0 -3px 6px 0 color-mix(in hwb, var(--pink-100), black 5%)`,
      `inset 0 3px 6px 0 color-mix(in hwb, var(--pink-100), white 10%)`,
    ].join(","),
    background: `linear-gradient(
      to bottom, 
      color-mix(in hwb, var(--pink-100), white 10%), 
      color-mix(in hwb, var(--pink-100), black 5%) 
    )`,
  },
  ['&[data-size="large"]']: {
    fontWeight: 800,
    fontSize: "var(--font-primary)",
    padding: rem(0.5, 1),
  },
  ['&[data-size="regular"]']: {
    padding: rem(0.33, 0.5),
    fontSize: "var(--font-secondary)",
  },
  "&:hover": {
    scale: 1.02,
    filter: "brightness(1.02)",
  },
  "&:active": {
    filter: "brightness(.98)",
    scale: 0.98,
  },
  img: {
    display: "block",
  },
}));

export { Button, className as buttonClassName };
