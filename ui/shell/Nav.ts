import { type IRoute } from "express";
import { css, withStyles } from "../../app/setup/styles.ts";
import { ROUTES } from "../../router.ts";

export const makeNav = ({ currentRoute }: { currentRoute: IRoute }) => {
  const LINKS = [
    {
      label: "Home",
      path: ROUTES.landing.path,
      isActive: currentRoute.path === ROUTES.landing.path,
    },
    {
      label: "Records",
      path: ROUTES.records.path,
      isActive: currentRoute.path === ROUTES.records.path,
    },
  ];

  return `
    <nav class="${className}">
        <ul>
            ${LINKS.map(
              (link) => /* HTML */ `
                <li>
                  <a data-is-active="${link.isActive}" href="${link.path}">
                    ${link.label}
                  </a>
                </li>
              `
            ).join("")}
        </ul>
    </nav>
`;
};

const [className] = withStyles(
  (root) => css`
    ${root} {
      position: fixed;
      box-shadow: var(--shadow-large),
        inset 0 -1px 0 0 color-mix(in oklab, var(--pink-50), black 5%),
        inset 0 1px 0 0 color-mix(in oklab, var(--pink-50), white 15%),
        inset 0 0 0 1px color-mix(in oklab, var(--pink-50), white 5%);
      border-radius: 9999px;
      padding: 1rem;
      background: linear-gradient(
        to bottom,
        color-mix(in oklab, var(--pink-50), white 5%),
        color-mix(in oklab, var(--pink-50), transparent 50%)
      );
      backdrop-filter: blur(10px);
      contain: content;
      width: max-content;
      bottom: calc(var(--margin-page) / 2);
      left: 0;
      right: 0;
      z-index: 999;
      display: flex;
      gap: 0.5rem;

      ul,
      li {
        display: contents;
      }

      a {
        font-weight: 600;
        color: var(--neutral-600);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        transition: background 0.2s linear;
      }

      &:not(:has(:hover)) a[data-is-active="true"],
      a:hover {
        --bg: color-mix(in oklab, var(--pink-400), transparent 60%);
        color: var(--pink-600);
        background: var(--bg);
        box-shadow: inset 0 2px 1px 0 color-mix(in oklab, var(--bg), black 2.5%),
          0 0 0 1px color-mix(in oklab, var(--pink-50), white 10%);
      }
    }
  `
);
