import { rem, withStyles } from "local-css/css";
import { JSXNode } from "local-tsx/jsx-runtime";

const TableRowWithIcon = ({
  icon,
  title,
  sub,
}: {
  icon: string;
  title: JSXNode;
  sub: JSXNode;
}) => {
  return (
    <div class={className}>
      <img src={`/static/${icon}.gif`} alt="" />
      <div class={className("rowWithIconInner")}>
        {title}
        <strong>{sub}</strong>
      </div>
    </div>
  );
};

const className = withStyles((select) => ({
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "row",
  gap: "1rem",
  [select("rowWithIconInner")]: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: rem(1 / 8),
  },
}));

export { TableRowWithIcon };
