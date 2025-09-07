import { Button } from "@/ui/Button/Button.tsx";
import { rem, withStyles } from "lib/css/css.ts";
import { Route, withPage } from "@/app/setup/routes.ts";
import { JSXNode } from "local-tsx/jsx-runtime";
import { DARK_MODE_DEBUG_CLASS } from "@/app/setup/envStatic.ts";

async function ui() {
  const suite = [
    <Button label="Run" href="/" target="_blank" />,
    <Button label="Run" size="large" href="/" target="_blank" />,
  ];
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      <Tester>{suite}</Tester>
      <div class={DARK_MODE_DEBUG_CLASS}>
        <Tester>{suite}</Tester>
      </div>
    </div>
  );
}

const Tester = ({ children }: { children: JSXNode }) => (
  <div class={className}>{children}</div>
);

const className = withStyles(() => ({
  background: "var(--pink-50)",
  width: "fit-content",
  padding: rem(1),
  borderRadius: rem(0.5),
  display: "flex",
  flexDirection: "column",
  gap: rem(1),
}));

export const uiRoute: Route<"get"> = {
  method: "get",
  path: "/internal/ui",
  handler: withPage(() => {
    return ui();
  }),
};
