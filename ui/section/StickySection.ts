import { withStyles, css } from "../../app/setup/styles.ts";

const makeStickySection = ({ children }: { children: string }) => /* HTML */ `
  <div class="${className}">${children}</div>
`;

const [className] = withStyles(
  (root) => css`
    @keyframes stick-first {
      to {
        transform: scale(0.3) translateY(calc(var(--margin-page) * -2));
        box-shadow: var(--shadow-large);
        backdrop-filter: blur(1rem);
      }
    }

    ${root} {
      position: sticky;
      top: calc(var(--margin-page));
      animation: ease stick-first both;
      animation-timeline: scroll(nearest block);
      animation-range: 0 400px;
      transform-origin: top center;
      z-index: 999;
      will-change: transform;
    }
  `
);

export { makeStickySection };
