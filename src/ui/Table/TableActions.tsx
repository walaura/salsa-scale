import { makePopoverWithTrigger } from "../Popover.tsx";
import { Button } from "../Button/Button.tsx";
import { randomBytes } from "node:crypto";
import { withStyles } from "local-css/css";
import { Icon } from "../Icon.tsx";
import { ButtonGroup } from "../Button/ButtonGroup.tsx";

const generateId = (length = 24) => {
  return Buffer.from(randomBytes(length)).toString("hex");
};

type Action = { title: string; icon: string; href: string };

const TableActionsRow = ({ actions }: { actions: Array<Action> }) => {
  return (
    <ButtonGroup>
      {actions.map((action) => {
        const popoverId = `${generateId()}-${action.icon}`;
        const [popover, triggerProps] = makePopoverWithTrigger({
          id: popoverId,
          popover: {
            children: (
              <>
                <span>{action.title}?</span>
                <Button
                  size="large"
                  label="Confirm"
                  href={action.href}
                  target="_blank"
                />
              </>
            ),
          },
        });
        return (
          <>
            {popover}
            <Button label={<Icon icon={action.icon} />} {...triggerProps} />
          </>
        );
      })}
    </ButtonGroup>
  );
};

const className = withStyles((select) => ({
  display: "flex",
  justifyContent: "end",
  gap: "1px",
  position: "relative",
  [select("action")]: {
    "& > button": {
      cursor: "pointer",
      appearance: "none",
      border: "none",
      padding: "0.5rem",
      background: "var(--pink-100)",
      textDecoration: "none",
      img: {
        display: "block",
      },
      "&:hover": {
        background: "var(--pink-300)",
      },
    },
    "&:has(:popover-open) > button": {
      opacity: 0.1,
    },
    "&:first-of-type button": {
      borderTopLeftRadius: "0.25em",
      borderBottomLeftRadius: "0.25em",
    },
    "&:last-of-type button": {
      borderTopRightRadius: "0.25em",
      borderBottomRightRadius: "0.25em",
    },
  },
}));

export { TableActionsRow };
