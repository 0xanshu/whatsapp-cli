import { createCliRenderer, Box, Text } from "@opentui/core";

async function createOpenTuiApp() {
  try {
    const renderer = await createCliRenderer({
      useMouse: true,
      enableMouseMovement: true,
    });

    return renderer;
  } catch (error) {
    console.error(">>> Error creating OpenTuiApp:", error);
    throw error;
  }
}

export { createOpenTuiApp };
