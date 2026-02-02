import wsp from "./client/whatsapp.ts";
import { listChats } from "./chat.ts";
import { createOpenTuiApp } from "./ui/screen.ts";
import { Box, Text } from "@opentui/core";
import { renderWhatsAppUI } from "./ui/components/layout.ts";

let readyFired = false;

// IMPORTANT: Attach event listeners BEFORE calling initialize()
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

    await renderWhatsAppUI(renderer, chats);
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
