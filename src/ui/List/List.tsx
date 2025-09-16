import { rem, withStyles } from "lib/css/css.ts";
import { Icon } from "../Icon.tsx";
import { JSXNode } from "local-tsx/jsx-runtime";

type BaseCell = {
  key: string;
  label: string;
  sublabel?: string;
};

type LinkCell = BaseCell & {
  href: string;
};
type ActionCell = BaseCell & {
  action: JSXNode;
};

type Cell = LinkCell | ActionCell;

const List = <TCell extends Cell>({ items }: { items: TCell[] }) => {
  return (
    <div class={className}>
      {items.map((item) => {
        if ("action" in item) {
          return <ListCell {...item} endCap={item.action} />;
        }
        if ("href" in item) {
          return (
            <ListCell
              {...item}
              endCap={<Icon icon="chevron" tint="var(--pink-300)" />}
            />
          );
        }
      })}
    </div>
  );
};

const ListCell = ({
  href,
  label,
  sublabel,
  endCap,
}: {
  href?: string;
  label: string;
  sublabel?: string;
  endCap: JSXNode;
}) => {
  const interior = (
    <>
      <div class={className("cell-interior")}>
        <strong>{label}</strong>
        {sublabel && <em>{sublabel}</em>}
      </div>
      {endCap}
    </>
  );
  if (href) {
    return (
      <a href={href} class={className("cell")}>
        {interior}
      </a>
    );
  }
  return <div class={className("cell")}>{interior}</div>;
};

export { List };

const className = withStyles((select) => ({
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
