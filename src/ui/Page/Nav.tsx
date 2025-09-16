import { type IRoute } from "express";
import { rem, withStyles } from "local-css/css";
import { ROUTES } from "../../router.ts";
import { Pivot } from "../Pivot.tsx";

export const Nav = ({
  currentRoute,
  shouldSeeSecrets,
}: {
  currentRoute: IRoute;
  shouldSeeSecrets: boolean;
}) => {
  const LINKS = [
    {
      label: "Overview",
      link: ROUTES.landingRoute.path,
      isActive: currentRoute.path === ROUTES.landingRoute.path,
    },
    {
      label: "All data",
      link: ROUTES.recordsRoute.path,
      isActive: currentRoute.path === ROUTES.recordsRoute.path,
    },
    shouldSeeSecrets && {
      label: "Ssh",
      link: ROUTES.secretRoute.path,
      isActive: currentRoute.path === ROUTES.secretRoute.path,
    },
  ].filter(Boolean) as Parameters<typeof Pivot>[0]["filters"];

  return (
    <nav class={className}>
      <Pivot backdrop="light" size="large" filters={LINKS} />
    </nav>
  );
};

const className = withStyles(() => ({
  boxShadow:
    "var(--shadow-large), inset 0 -1px 0 0 color-mix(in oklab, var(--pink-50), black 5%), inset 0 1px 0 0 color-mix(in oklab, var(--pink-50), white 15%), inset 0 0 0 1px color-mix(in oklab, var(--pink-50), white 5%)",
  position: "fixed",
  borderRadius: "9999px",
  padding: "1rem",
  background: `linear-gradient(
    to bottom, 
    var(--neutral-0), 
    color-mix(in oklab, var(--pink-50), transparent 12.5%)
  )`,
  backdropFilter: "blur(10px)",
  contain: "content",
  width: "max-content",
  bottom: "calc(var(--margin-page) / 2)",
  left: 0,
  right: 0,
  zIndex: 999,
  display: "flex",
  gap: rem(1 / 8),
}));
