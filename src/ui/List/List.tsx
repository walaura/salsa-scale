import { rem, withStyles } from "lib/css/css.ts";
import { Icon } from "../Icon.tsx";

type LinkCell = {
  key: string;
  href: string;
  label: string;
  sublabel?: string;
};

const List = ({ items }: { items: LinkCell[] }) => {
  return (
    <div class={className}>
      {items.map((item) => (
        <a href={item.href} class={className("cell")}>
          <div class={className("cell-interior")}>
            <strong>{item.label}</strong>
            {item.sublabel && <em>{item.sublabel}</em>}
          </div>
          <Icon icon="chevron" tint="var(--pink-300)" />
        </a>
      ))}
    </div>
  );
};

export { List };

const className = await withStyles((select) => ({
  display: "flex",
  flexDirection: "column",
  ["& > * + *"]: {
    borderTop: "1px solid var(--pink-100)",
  },
  [select("cell")]: {
    padding: rem(0.5, 1),
    backgroundColor: "var(--neutral-0)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    color: "var(--neutral-1000)",
    textDecoration: "none",
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "var(--pink-50)",
    },
    [select("cell-interior")]: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: rem(0.125),
    },
    strong: {
      fontSize: "var(--font-primary)",
      fontWeight: "bold",
      color: "var(--neutral-1000)",
    },
    em: {
      display: "block",
      fontSize: "var(--font-secondary)",
      color: "var(--neutral-400)",
    },
  },
}));
