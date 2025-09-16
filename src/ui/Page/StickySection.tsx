import { JSX } from "local-tsx/jsx-runtime";
import { withStyles, withKeyframes } from "local-css/css";

const StickySection = ({ children }: { children: JSX.Element }) => (
  <div class={className} data-test="dffgdfg">
    {children}
  </div>
);

const stickFirstAnimation = await withKeyframes({
  to: {
    transform: "scale(0.3) translateY(calc(var(--margin-page) * -2))",
    boxShadow: "var(--shadow-large)",
    backdropFilter: "blur(1rem)",
  },
});

const className = withStyles(() => ({
  position: "sticky",
  top: "calc(var(--margin-page))",
  animation: `ease ${stickFirstAnimation} both`,
  animationTimeline: "scroll(nearest block)",
  animationRange: "0 400px",
  transformOrigin: "top center",
  zIndex: 999,
  willChange: "transform",
}));

export { StickySection };
