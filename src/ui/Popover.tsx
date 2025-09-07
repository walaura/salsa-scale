import { JSX } from "local-tsx/jsx-runtime";
import {
  px,
  withDynamicStyles,
  withKeyframes,
  withStyles,
} from "local-css/css";

const Popover = ({
  id,
  children,
  anchor = "--popover",
}: {
  id: string;
  children: JSX.Element;
  anchor?: string;
}) => {
  const popover = (
    <div
      {...popoverStyle({
        anchor,
        area: "center top",
      })}
      popover="auto"
      id={id}
    >
      {children}
    </div>
  );

  return popover;
};

const popoverOpenAnimation = withKeyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.5rem) scale(0.8)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});
const popoverStyle = withDynamicStyles(
  ({ anchor, area }: { anchor: string; area: string }) =>
    () => ({
      positionAnchor: anchor,
      positionArea: area,
      transformOrigin: area,
      position: "absolute",
      margin: 0,
      color: "var(--neutral-1000)",
      borderRadius: "calc(var(--margin-page) / 2)",
      padding: "calc(var(--margin-page) / 2)",
      backgroundColor: "var(--pink-50)",
      alignItems: "stretch",
      textAlign: "center",
      flexDirection: "column",
      gap: "calc(var(--margin-page) / 4)",
      border: "none",
      boxShadow:
        "var(--shadow-large), inset 0 -1px 0 0 color-mix(in oklab, var(--pink-50), black 5%), inset 0 1px 0 0 color-mix(in oklab, var(--pink-50), white 15%), inset 0 0 0 1px color-mix(in oklab, var(--pink-50), white 5%)",
      minWidth: "12em",
      "&::backdrop": {
        backgroundColor: "color-mix(in srgb, var(--pink-100), transparent 20%)",
      },
      "&:popover-open": {
        animation: `${popoverOpenAnimation} 0.1s ease both`,
        display: "flex",
      },
    })
);

const makePopoverWithTrigger = ({
  id,
  popover: popoverProps,
}: {
  id: string;
  popover: Omit<Parameters<typeof Popover>[0], "id" | "trigger">;
}) => {
  const anchorName = "--a-" + id;

  const popover = <Popover id={id} anchor={anchorName} {...popoverProps} />;

  const triggerProps = {
    styles: triggerStyleProps({
      anchorName,
    }),
    popoverTarget: id,
  };

  return [popover, triggerProps] as const;
};

const triggerStyleProps = withDynamicStyles(
  ({ anchorName }: { anchorName: string }) =>
    () => ({
      anchorName,
      display: "block",
    })
);

export { Popover, makePopoverWithTrigger };
