import { withStyles } from "lib/css/css.ts";

const Icon = ({ icon }: { icon: string }) => (
  <img src={`./static/${icon}.gif`} alt="" class={className} />
);

const className = withStyles(() => ({
  display: "inline-block",
  verticalAlign: "middle",
}));

export { Icon };
