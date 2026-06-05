import type {
  CliRenderer,
  InputRenderable,
  SelectRenderable,
  KeyEvent,
} from "@opentui/core";

type KeyboardContext = {
  inputField: InputRenderable;
  chatListComponent: SelectRenderable;
  onExit: () => Promise<void>;
};

export function setupKeyboardInput(
  renderer: CliRenderer,
  ctx: KeyboardContext
) {
  const keyHandler = renderer.keyInput;
  keyHandler.on("keypress", async (key: KeyEvent) => {
    if (key.name === "`") {
      renderer.console.toggle();
    }

    if (key.ctrl && key.name === "l") {
      renderer.console.toggle();
    }

    if (key.ctrl && key.name === "c") {
      await ctx.onExit();
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
