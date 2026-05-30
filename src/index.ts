import wsp, { startConnectionWatchdog } from "./client/whatsapp.ts";
import { welcomeArt } from "./client/welcomeScreen.ts";
import { listChats } from "./chat.ts";
import { createOpenTuiApp } from "./ui/screen.ts";
import { renderWhatsAppUI } from "./ui/components/layout.ts";

welcomeArt();

let readyFired = false;

wsp.on("ready", async () => {
  console.log(">>> [index.ts] Ready event fired!");
  readyFired = true;

  try {
    console.log(">>> [index.ts] About to fetch chats...");
    const chats = await listChats(wsp);

    if (!chats || chats.length === 0) {
      console.error(">>> [index.ts] No chats found or failed to fetch chats");
      return;
    }

    console.log(">>> [index.ts] Chats loaded:", chats.length);

    const renderer = await createOpenTuiApp();

    await renderWhatsAppUI(wsp, renderer, chats);
    renderer.start();
  } catch (error) {
    console.error(">>> [index.ts] Error during setup:", error);
    if (error instanceof Error) {
      console.error(">>> [index.ts] Stack trace:", error.stack);
    }
    throw error;
  }
});

wsp.initialize();

startConnectionWatchdog(() => readyFired);
