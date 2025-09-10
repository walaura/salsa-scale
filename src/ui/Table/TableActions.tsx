import { makePopoverWithTrigger } from "../Popover.tsx";
import { Button } from "../Button/Button.tsx";
import { randomBytes } from "node:crypto";
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
                  type="primary"
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
            <Button
              type="secondary"
              label={<Icon icon={action.icon} />}
              {...triggerProps}
            />
          </>
        );
      })}
    </ButtonGroup>
  );
};

export { TableActionsRow };
