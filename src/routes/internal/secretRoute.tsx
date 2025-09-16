import { Expander } from "../../ui/Page/Expander.tsx";
import { Route, withPage } from "@/app/setup/routes.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { ROUTES } from "@/router.ts";
import { List } from "@/ui/List/List.tsx";
import { Button } from "@/ui/Button/Button.tsx";

async function secret({ shouldSeeSecrets }: { shouldSeeSecrets: boolean }) {
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
    <>
      <SignIn shouldSeeSecrets={shouldSeeSecrets} />
      <Expander title={"Routes"} isOpen={true}>
        <List items={items} />
      </Expander>
    </>
  );
}

const SignIn = ({ shouldSeeSecrets }: { shouldSeeSecrets: boolean }) => {
  const sublabel = shouldSeeSecrets
    ? "Log out to lose access to admin tools, come back to re-enable"
    : "Save your access to admin tools";

  const action = shouldSeeSecrets
    ? ROUTES.logoutRoute.path
    : ROUTES.loginRoute.path;

  const actionLabel = shouldSeeSecrets ? "Log out" : "Log in";
  const row = [
    {
      key: "sck",
      label: "Secret cookie",
      sublabel,
      action: (
        <form method="POST" action={action}>
          <Button action="submit" size="large" label={actionLabel} />
        </form>
      ),
    },
  ];
  return (
    <Expander title={"Cookees"} isOpen={true}>
      <List items={row} />
    </Expander>
  );
};

export const secretRoute: Route<"get"> = {
  method: "get",
  path: "/" + TOP_SECRET_PATH,
  handler: withPage((req) => {
    const shouldSeeSecrets = req.cookies?.[TOP_SECRET_PATH] === TOP_SECRET_PATH;
    return secret({ shouldSeeSecrets });
  }),
};
