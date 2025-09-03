import {
  css,
  getRegisteredStyles,
  withStyles,
} from "../../app/setup/styles.ts";

const makePage = ({
  children,
  forceMode,
}: {
  children: string;
  forceMode: "dark" | "light" | undefined;
}) => {
  const isDarkMode =
    forceMode === "light"
      ? false
      : forceMode === "dark" ||
        new Date().getHours() >= 20 ||
        new Date().getHours() < 8;

  return /* HTML */ `<!DOCTYPE html>
    <html lang="en" class="${isDarkMode ? "dark-mode" : ""}">
      <head>
        <meta charset="UTF-8" />
        <title>Is Salsa starving</title>
        <link rel="stylesheet" href="./static/css/colors.css" />
        <link rel="stylesheet" href="./static/css/styles.css" />
        <link rel="icon" href="./static/favicon.png" />
        <style type="text/css">
          ${getRegisteredStyles().join("")}
        </style>
      </head>
      <body class="${className}">
        ${children}
      </body>
    </html>`;
};

const [className] = withStyles(
  (root) => css`
    ${root} {
      & > * {
        max-width: var(--max-width);
        margin: auto;
        & + * {
          margin-top: calc(var(--margin-page) * 0.75);
        }
      }
    }
  `
);

export { makePage };
