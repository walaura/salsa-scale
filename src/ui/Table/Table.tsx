import { withStyles } from "local-css/css";
import { JSXNode } from "local-tsx/jsx-runtime";

type Columns<ColumnName extends string> = {
  title: string;
  key: ColumnName;
  isHidden?: boolean;
};

type TableData<ColumnName extends string> = {
  [key in ColumnName]: () => JSXNode;
} & {
  key: string;
};

const Table = <ColumnName extends string>({
  columns,
  data,
}: {
  columns: readonly Columns<ColumnName>[];
  data: TableData<ColumnName>[];
}) => {
  return (
    <table class={className}>
      <thead>
        <tr>
          {columns.map((column) =>
            column.isHidden ? null : <th>{column.title}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.key}>
            {columns.map((column) =>
              column.isHidden ? null : <td>{row[column.key]()}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const className = withStyles((select) => ({
  contain: "strict",
  overflow: "hidden",
  borderCollapse: "collapse",
  background: "var(--neutral-0)",
  width: "100%",
  ":is(th, td):last-child": {
    textAlign: "end",
  },
  "thead th, tr td": {
    padding: "0.5rem 1rem",
  },
  thead: {
    borderBottom: "1px solid var(--pink-200)",
    th: {
      background: "var(--pink-100)",
      color: "var(--pink-600)",
      fontSize: "var(--font-secondary)",
      fontWeight: "normal",
      fontStyle: "italic",
      textAlign: "start",
    },
  },
  tr: {
    "&:hover": {
      background: "var(--pink-50)",
    },
    td: {
      color: "var(--neutral-400)",
      borderBottom: "1px solid var(--pink-100)",
      fontSize: "var(--font-secondary)",
      strong: {
        fontWeight: "bold",
        color: "var(--neutral-1000)",
        fontSize: "var(--font-primary)",
      },
    },
  },
}));

export { Table };
