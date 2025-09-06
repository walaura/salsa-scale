import { type IRoute } from "express";
import { withStyles } from "local-css/css";
import { Nav } from "./Nav.tsx";
import { getRegisteredStyles } from "local-css/helpers";

const Page = ({
  children,
  forceMode,
  currentRoute,
}: {
  children: string;
  forceMode: "dark" | "light" | undefined;
  currentRoute: IRoute;
}) => {
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
        <link rel="stylesheet" href="./static/css/colors.css" />
        <link rel="stylesheet" href="./static/css/styles.css" />
        <link rel="icon" href="./static/favicon.png" />
        <style type="text/css">{getRegisteredStyles().join("")}</style>
      </head>
      <body class={className}>
        <Nav currentRoute={currentRoute} />
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
