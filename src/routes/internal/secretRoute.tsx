import { Expander } from "../../ui/Page/Expander.tsx";
import { Route, withPage } from "@/app/setup/routes.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { ROUTES } from "@/router.ts";
import { List } from "@/ui/List/List.tsx";

async function secret() {
  const allRoutes = ROUTES;

  const items = Object.keys(allRoutes).map((key) => {
    const route = (allRoutes as Record<string, Route<string>>)[key];
    return {
      sublabel: `[${route.method.toUpperCase()}] ${route.path}`,
      label: key,
      href: route.path,
      key,
    };
  });

  return (
    <Expander title={"Routes"} isOpen={true}>
      <List items={items} />
    </Expander>
  );
}

export const secretRoute: Route<"get"> = {
  method: "get",
  path: "/" + TOP_SECRET_PATH,
  handler: withPage(() => {
    return secret();
  }),
};
