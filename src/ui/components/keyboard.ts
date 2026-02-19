import type { CliRenderer, KeyEvent } from "@opentui/core";
import wsp from "../../client/whatsapp.ts";

type KeyboardContext = {};

function setupKeyboardInput(renderer: CliRenderer, ctx: KeyboardContext) {
  const keyHandler = renderer.keyInput;
  keyHandler.on("keypress", async (key: KeyEvent) => {
    if (key.ctrl && key.name === "c") {
      await wsp.destroy();
      process.exit(0);
    }

    if (key.ctrl && key.name === "z") {
      renderer.console.toggle();
    }
  });
}

export { setupKeyboardInput };
