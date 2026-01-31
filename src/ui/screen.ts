import { createCliRenderer, Box, Text } from "@opentui/core";

async function createOpenTuiApp() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });

  return renderer;
}

export { createOpenTuiApp };
