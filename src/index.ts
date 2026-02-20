import wsp from "./client/whatsapp.ts";
import { listChats } from "./chat.ts";
import { createOpenTuiApp } from "./ui/screen.ts";
import { renderWhatsAppUI } from "./ui/components/layout.ts";

let readyFired = false;

wsp.on("ready", async () => {
  console.log(">>> [INDEX.TS] Ready event fired!");
  readyFired = true;

  try {
    console.log(">>> About to fetch chats...");
    const chats = await listChats(wsp);

    if (!chats || chats.length === 0) {
      console.error(">>> No chats found or failed to fetch chats");
      return;
    }

    console.log(">>> Chats loaded:", chats.length);

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
    console.error(">>> Error during setup:", error);
    console.error(">>> Stack trace:", (error as Error).stack);
    throw error;
  }
});

wsp.initialize();

setTimeout(() => {
  if (!readyFired) {
    console.error(">>> WhatsApp client failed to initialize within 60 seconds");
    process.exit(1);
  }
}, 60000);
