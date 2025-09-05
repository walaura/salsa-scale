import { makePopoverAndTrigger } from "../Popover.ts";
import { makeButton } from "../Button.ts";
import { randomBytes } from "node:crypto";
import { withStyles } from "../../app/styles.ts";

const generateId = (length = 24) => {
  return Buffer.from(randomBytes(length)).toString("hex");
};

type Action = { title: string; icon: string; href: string };

const makeTableActionsRow = ({ actions }: { actions: Array<Action> }) => {
  return /* HTML */ `<div class="${className}">
    ${actions
      .map((action) => {
        const popoverId = `${generateId()}-${action.icon}`;
        return /* HTML */ `
          <div class="${className("action")}">
            ${makePopoverAndTrigger({
              id: popoverId,
              trigger: {
                children: /* HTML */ `<img
                  src="/static/${action.icon}.gif"
                  alt="${action.title}"
                />`,
                title: action.title,
              },
              popover: {
                children: /* HTML */ `<span>${action.title}?</span>
                  ${makeButton({
                    label: "Confirm",
                    href: action.href,
                    target: "_blank",
                  })}`,
              },
            }).join("")}
          </div>
        `;
      })
      .join("")}
  </div>`;
};

const [className] = withStyles((select) => ({
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

export { makeTableActionsRow };
