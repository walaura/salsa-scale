import { ROUTES } from "../../../router.ts";
import { formatGrams, formatTimeHtml } from "../../../app/format.ts";
import type { LogEntry } from "../../../app/setup/db.ts";
import type { WithId } from "mongodb";
import { TableActionsRow } from "../../../ui/Table/TableActions.tsx";

import { TableRowWithIcon } from "@/ui/Table/TableRowWithIcon.tsx";
import { Table } from "@/ui/Table/Table.tsx";

const WeightRow = ({ point }: { point: LogEntry }) => {
  if (point.feedingEventOfSize == null) {
    return formatGrams(point.weight);
  }

  return (
    <TableRowWithIcon
      icon="cake"
      title={formatGrams(point.weight)}
      sub={
        <>
          Feeding event at {formatTimeHtml(point.timestamp)} –{" "}
          {formatGrams(point.feedingEventOfSize)}
        </>
      }
    />
  );
};

const ActionsRow = ({ point }: { point: WithId<LogEntry> }) => (
  <TableActionsRow
    actions={[
      {
        title: "Delete record",
        icon: "bomb",
        href: ROUTES.delet.path.replace(":id", point._id.toString()),
      },
      {
        title: "Mark as LV3 feeding event",
        icon: "fe-add",
        href: ROUTES.markEvent.path
          .replace(":id", point._id.toString())
          .replace(":size", "3"),
      },
      {
        title: "Unset feeding event",
        icon: "fe-rm",
        href: ROUTES.unMarkEvent.path.replace(":id", point._id.toString()),
      },
    ]}
  />
);

const RecordsTable = ({
  points,
  showActions = false,
}: {
  points: WithId<LogEntry>[];
  showActions?: boolean;
}) => {
  const COLUMNS = [
    { title: "Weight", key: "weight" },
    { title: "Time", key: "time" },
    { title: "Actions", key: "actions", isHidden: !showActions },
  ] as const;
  const cells = points.map((point) => {
    return {
      key: point._id.toString(),
      weight: () => <WeightRow point={point} />,
      time: () => formatTimeHtml(point.timestamp),
      actions: () => <ActionsRow point={point} />,
    };
  });

  return <Table columns={COLUMNS} data={cells} />;
};

export { RecordsTable };
