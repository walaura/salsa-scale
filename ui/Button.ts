import { css, withStyles } from "../app/setup/styles.ts";

const makeButton = ({
  label,
  href,
  target = "_self",
}: {
  label: string;
  href: string;
  target?: string;
}) => /* HTML */ `<a class="${className}" href="${href}" target="${target}">
  ${label}
</a>`;

const [className] = withStyles(
  (root) => css`
    ${root} {
      box-shadow: inset 0 -1px 2px 0 color-mix(in oklab, var(--pink-600), black
              10%),
        inset 0 1px 1px 0 color-mix(in oklab, var(--pink-600), white 50%);
      background: linear-gradient(
        to bottom,
        color-mix(in oklab, var(--pink-600), white 30%) 0%,
        var(--pink-600) 100%
      );
      color: var(--neutral-0);
      cursor: pointer;
      display: block;
      font-weight: 800;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      text-decoration: none;
      font-size: var(--font-primary);
    }
  `
);

export { makeButton };
