import { makePopoverAndTrigger } from "../Popover.ts";
import { makeButton } from "../Button.ts";
import { randomBytes } from "node:crypto";
import { css, withStyles } from "../../app/setup/styles.ts";

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

const [className] = withStyles(
  (root) => css`
    ${root} {
      display: flex;
      justify-content: end;
      gap: 1px;
      position: relative;

      ${root("action")} {
        & > button {
          cursor: pointer;
          appearance: none;
          border: none;
          padding: 0.5rem;
          background: var(--pink-100);
          text-decoration: none;
          img {
            display: block;
          }
          &:hover {
            background: var(--pink-300);
          }
        }
        &:has(:popover-open) > button {
          opacity: 0.1;
        }
        &:first-of-type button {
          border-top-left-radius: 0.25em;
          border-bottom-left-radius: 0.25em;
        }
        &:last-of-type button {
          border-top-right-radius: 0.25em;
          border-bottom-right-radius: 0.25em;
        }
      }
    }
  `
);

export { makeTableActionsRow };
