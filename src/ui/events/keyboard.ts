import type {
  BoxRenderable,
  CliRenderer,
  InputRenderable,
  KeyEvent,
} from "@opentui/core";

type KeyboardContext = {
  inputField: InputRenderable;
  chatListContainer: BoxRenderable;
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
      ctx.chatListContainer.focus();
      console.log("the focus is on chat list now..");
    }

    if (key.name === "right") {
      ctx.inputField.focus();
      console.log("the focus is on input field now..");
    }

    if (key.name === "left") {
      ctx.chatListContainer.focus();
      console.log("the focus is on chat list now..");
    }
  });
}
