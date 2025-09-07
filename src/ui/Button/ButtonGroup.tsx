import { rem, withStyles } from "lib/css/css.ts";
import { JSXNode } from "local-tsx/jsx-runtime";
import { buttonClassName } from "./Button.tsx";

const ButtonGroup = ({ children }: { children: Array<JSXNode> }) => {
  return <div class={className}>{children}</div>;
};

const className = withStyles(() => ({
  display: "flex",
  justifyContent: "end",
  gap: "1px",
  position: "relative",
  [`& > .${buttonClassName}`]: {
    borderRadius: 0,
    color: "rebeccapurple",
  },
  [`& > .${buttonClassName}:first-of-type`]: {
    borderTopLeftRadius: rem(1),
    borderBottomLeftRadius: rem(1),
  },
  [`& > .${buttonClassName}:last-of-type`]: {
    borderTopRightRadius: rem(1),
    borderBottomRightRadius: rem(1),
  },
}));

export { ButtonGroup };
