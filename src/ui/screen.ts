import { createCliRenderer } from "@opentui/core";

export async function createOpenTuiApp() {
  try {
    const renderer = await createCliRenderer({
      useMouse: true,
      enableMouseMovement: true,
      backgroundColor: "transparent",
    });

    return renderer;
  } catch (error) {
    console.error(">>> [OPENTUI] Error creating OpenTuiApp:", error);
    throw error;
  }
}
