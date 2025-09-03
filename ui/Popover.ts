import { css, withStyles } from "../app/setup/styles.ts";

const makePopover = ({
  id,
  children,
  anchor = "--popover",
}: {
  id: string;
  children: string;
  anchor?: string;
}) => {
  const popover = /* HTML */ `<div
    class="${className}"
    style="${styleProps({
      anchor,
    })}"
    popover
    id="${id}"
  >
    ${children}
  </div>`;

  return popover;
};
const [className, styleProps] = withStyles(
  (root, { anchor, area }) => css`
    @keyframes popover-open {
      from {
        opacity: 0;
        transform: translateY(0.5rem) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    ${root} {
      position-anchor: ${anchor};
      position-area: ${area};
      transform-origin: ${area};
      position: absolute;
      margin: 0;
      color: var(--neutral-1000);
      border-radius: calc(var(--margin-page) / 2);
      padding: calc(var(--margin-page) / 2);
      background-color: var(--pink-50);
      align-items: stretch;
      text-align: center;
      flex-direction: column;
      gap: calc(var(--margin-page) / 4);
      border: none;
      box-shadow: var(--shadow-large),
        inset 0 -1px 0 0 color-mix(in oklab, var(--pink-50), black 5%),
        inset 0 1px 0 0 color-mix(in oklab, var(--pink-50), white 15%),
        inset 0 0 0 1px color-mix(in oklab, var(--pink-50), white 5%);
      min-width: 12em;

      &::backdrop {
        background-color: color-mix(in srgb, var(--pink-100), transparent 20%);
      }

      &:popover-open {
        animation: popover-open 0.1s ease both;
        display: flex;
      }
    }
  `,
  { anchor: ":root", area: "center top" }
);

const makePopoverAndTrigger = ({
  id,
  trigger,
  popover,
}: {
  id: string;
  trigger: {
    children: string;
    title: string;
  };
  popover: Omit<Parameters<typeof makePopover>[0], "id" | "trigger">;
}) => {
  const anchor = "--a-" + id;
  const popoverEl = makePopover({
    id,
    anchor,
    ...popover,
  });
  const triggerEl = /* HTML */ `<button
    class="${triggerClassName}"
    style="${triggerStyleProps({ anchorName: anchor })}"
    title="${trigger.title}"
    popovertarget="${id}"
  >
    ${trigger.children}
  </button>`;

  return [popoverEl, triggerEl];
};

const [triggerClassName, triggerStyleProps] = withStyles(
  (root, { anchorName }) => css`
    ${root} {
      anchor-name: ${anchorName};
    }
  `,
  {
    anchorName: ":root",
  }
);

export { makePopover, makePopoverAndTrigger };
