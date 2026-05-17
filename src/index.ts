import wsp from "./client/whatsapp.ts";
import { listChats } from "./chat.ts";
import { createOpenTuiApp } from "./ui/screen.ts";
import { renderWhatsAppUI } from "./ui/components/layout.ts";

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
    renderer.keyInput.on("keypress", (key) => {
      if (key.name === "`") {
        renderer.console.toggle();
      }

      if (key.ctrl && key.name === "l") {
        renderer.console.toggle();
      }
    });

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

setTimeout(() => {
  if (!readyFired) {
    console.error(
      ">>> [index.ts] WhatsApp client failed to initialize within 60 seconds, TRY AGAIN!",
    );
    process.exit(1);
  }
}, 120000);
