import type {
  CliRenderer,
  InputRenderable,
  KeyEvent,
  SelectRenderable,
} from "@opentui/core";
import wsp from "../../client/whatsapp.ts";

type KeyboardContext = {
  inputField: InputRenderable;
  chatListComponent: SelectRenderable;
};

export function setupKeyboardInput(
  renderer: CliRenderer,
  ctx: KeyboardContext,
) {
  const keyHandler = renderer.keyInput;
  keyHandler.on("keypress", async (key: KeyEvent) => {
    if (key.ctrl && key.name === "c") {
      await wsp.destroy();
      process.exit(0);
    }

    if (key.ctrl && key.name === "s") {
      ctx.inputField.focus();
      console.log("the focus is on input field now..");
    }

    if (key.ctrl && key.name === "d") {
      ctx.chatListComponent.focus();
      console.log("the focus is on chat list now..");
    }

    if (key.name === "right") {
      ctx.inputField.focus();
      console.log("the focus is on input field now..");
    }

    if (key.name === "left") {
      ctx.chatListComponent.focus();
      console.log("the focus is on chat list now..");
    }
  });
}
