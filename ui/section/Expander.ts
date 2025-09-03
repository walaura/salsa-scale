import { css, withStyles } from "../../app/setup/styles.ts";

type PivotFilter = { label: string; isActive: boolean; link: URL };

const makePivot = (filters: Array<PivotFilter>) => /* HTML */ `<div
  class="${className}-pivot"
>
  ${filters
    .map(({ label, isActive, link }) => {
      return /* HTML */ `<a
        class="${className}-pivot-link ${isActive
          ? `${className}-pivot-link-active`
          : ""}"
        href="${link.toString()}"
      >
        ${label}
      </a>`;
    })
    .join("")}
</div>`;

const makeExpander = ({
  title,
  children,
  isOpen,
  name,
  pivot,
}: {
  title: string;
  children: string;
  isOpen: boolean;
  name?: string;
  pivot?: Array<PivotFilter>;
}) => {
  return /* HTML */ `
    <details
      class="${className}"
      ${name ? `name="${name}"` : ""}
      ${isOpen ? "open" : ""}
    >
      <summary>
        <span class="${className}-title">
          <div class="${className}-title-drop"></div>
          ${title}
        </span>
        ${pivot
          ? /* HTML */ ` <span class="${className}-aside"
              >${makePivot(pivot)}</span
            >`
          : ""}
      </summary>
      <div class="${className}-content">${children}</div>
    </details>
  `;
};

const [className] = withStyles(
  (root) => css`
    @keyframes details-stick-first {
      to {
        transform: scale(0.3) translateY(calc(var(--margin-page) * -2));
        box-shadow: var(--shadow-large);
        backdrop-filter: blur(1rem);
      }
    }
    ${root} {
      --radius: 1rem;
      border-radius: var(--radius);
      box-shadow: 0 1px 6px 1px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      transform-origin: center 1rem;
      transition: transform 0.2s ease;

      &:has(summary:active) {
        transform: scale(0.995);
      }

      &:first-child {
        position: sticky;
        top: calc(var(--margin-page));
        animation: ease details-stick-first both;
        animation-timeline: scroll(nearest block);
        animation-range: 0 400px;
        transform-origin: top center;
        z-index: 999;
        will-change: transform;
      }

      summary {
        padding: calc(0.75rem + 2px) calc(1rem + 2px);
        background-color: var(--pink-600);
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
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      ${root}-content {
        border: 1px solid var(--pink-300);
        border-top: none;
        border-bottom-left-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
        overflow: hidden;
        contain: content;
        position: relative;
      }

      ${root}-title {
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        ${root}-title-drop {
          width: 16px;
          height: 16px;
          transition: transform 0.4s ease;
          transform: rotate(-90deg);
          mask-image: url(/static/drop.gif);
          display: block;
          background: var(--neutral-0);
        }
      }

      &[open] ${root}-title ${root}-title-drop {
        transform: rotate(0deg);
      }

      ${root}-pivot {
        display: flex;
        font-size: var(--font-secondary);
        gap: -0.5rem;
        margin: -0.25rem;
        ${root}-pivot-link {
          color: inherit;
          text-decoration: none;
          padding: 0.25rem 1rem;
          border-radius: 999px;
          color: var(--pink-200);

          &:hover {
            color: var(--neutral-0);
          }

          &${root}-pivot-link-active {
            opacity: 1;
            background: color-mix(in oklab, var(--pink-700), transparent 20%);
            color: var(--neutral-0);
            box-shadow: inset 0 1px 1px 0
              color-mix(in oklab, var(--pink-700), #000 20%);
          }
        }
      }
    }
  `
);

export { makeExpander };
