import { Button } from "@/ui/Button/Button.tsx";
import { rem, withStyles } from "lib/css/css.ts";
import { Route, withPage } from "@/app/setup/routes.ts";
import { JSXNode } from "local-tsx/jsx-runtime";
import { DARK_MODE_DEBUG_CLASS } from "@/app/setup/envStatic.ts";
import { Pivot } from "@/ui/Pivot.tsx";

const SILLY_PIVOT_FILTERS = [
  { label: "All", isActive: true, link: new URL("https://example.com") },
  { label: "Active", isActive: false, link: new URL("https://example.com") },
  { label: "Closed", isActive: false, link: new URL("https://example.com") },
];

async function ui() {
  const buttonSuite = [
    <Button label="Run" href="#" type="primary" />,
    <Button label="Run" size="large" href="#" type="primary" />,
    <Button label="Run" href="#" />,
    <Button label="Run" size="large" href="#" />,
  ];
  const pivotSuite = (
    <>
      <div
        style={{
          padding: "1rem",
          background: "var(--pink-600)",
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <Pivot filters={SILLY_PIVOT_FILTERS} backdrop="dark" size="regular" />
        <Pivot filters={SILLY_PIVOT_FILTERS} backdrop="dark" size="large" />
      </div>
      <Pivot filters={SILLY_PIVOT_FILTERS} backdrop="light" size="regular" />
      <Pivot filters={SILLY_PIVOT_FILTERS} backdrop="light" size="large" />
    </>
  );
  return (
    <>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <Tester>{buttonSuite}</Tester>
        <div class={DARK_MODE_DEBUG_CLASS}>
          <Tester>{buttonSuite}</Tester>
        </div>
      </div>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <Tester>{pivotSuite}</Tester>
        <div class={DARK_MODE_DEBUG_CLASS}>
          <Tester>{pivotSuite}</Tester>
        </div>
      </div>
    </>
  );
}

const Tester = ({ children }: { children: JSXNode }) => (
  <div class={className}>{children}</div>
);

const className = await withStyles(() => ({
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
