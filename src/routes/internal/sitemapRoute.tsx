import { Icon } from "@/ui/Icon.tsx";
import { isFeedingEvent } from "../../app/feedingEvent.ts";
import { getAllData } from "../../app/getData.ts";
import { Expander } from "../../ui/section/Expander.tsx";
import { Table } from "@/ui/Table/Table.tsx";
import { makePopoverWithTrigger } from "@/ui/Popover.tsx";
import { Button } from "@/ui/Button/Button.tsx";
import { px } from "lib/css/css.ts";
import { Route, withPage } from "@/app/setup/routes.ts";
import { TOP_SECRET_PATH } from "@/app/setup/env.ts";
import { ROUTES } from "@/router.ts";

async function sitemap() {
  const allRoutes = ROUTES;

  const data = Object.keys(allRoutes).map((key) => {
    const route = (allRoutes as Record<string, Route<string>>)[key];
    return {
      method: () => route.method.toUpperCase(),
      path: () => route.path,
      travel: () => <Button href={route.path} label="Go"></Button>,
      key,
    };
  });

  const COLUMNS = [
    { title: "Method", key: "method" },
    { title: "Path", key: "path" },
    { title: "Travel", key: "travel" },
  ] as const;

  return (
    <Expander title={"Routes"} isOpen={true}>
      <Table columns={COLUMNS} data={data} />
    </Expander>
  );
}

export const sitemapRoute: Route<"get"> = {
  method: "get",
  path: "/internal/" + TOP_SECRET_PATH + "/sitemap",
  handler: withPage(() => {
    return sitemap();
  }),
};
