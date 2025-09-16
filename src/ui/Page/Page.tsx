import { type IRoute } from "express";
import { withStyles } from "local-css/css";
import { Nav } from "./Nav.tsx";
import { getRegisteredStyles } from "local-css/helpers";

const Page = async ({
  children,
  forceMode,
  currentRoute,
  shouldSeeSecrets,
}: {
  children: string;
  forceMode: "dark" | "light" | undefined;
  currentRoute: IRoute;
  shouldSeeSecrets: boolean;
}) => {
  const styles = await getRegisteredStyles();

  const isDarkMode =
    forceMode === "light"
      ? false
      : forceMode === "dark" ||
        new Date().getHours() >= 20 ||
        new Date().getHours() < 8;

  const page = (
    <html lang="en" class={isDarkMode ? "dark-mode" : ""}>
      <head>
        <meta charSet="UTF-8" />
        <title>Is Salsa starving</title>
        <link rel="stylesheet" href="/static/css/colors.css" />
        <link rel="stylesheet" href="/static/css/styles.css" />
        <link rel="icon" href="/static/favicon.png" />
        <style type="text/css">{styles.join("\n")}</style>
      </head>
      <body class={className}>
        <Nav currentRoute={currentRoute} shouldSeeSecrets={shouldSeeSecrets} />
        {children}
      </body>
    </html>
  );

  return "<!DOCTYPE html>" + page;
};

const className = withStyles(() => ({
  "& > *": {
    maxWidth: "var(--max-width)",
    margin: "auto",
    "& + *": {
      marginTop: "calc(var(--margin-page) * 0.75)",
    },
  },
}));

export { Page };
