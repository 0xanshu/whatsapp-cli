import wsp from "./client/whatsapp.ts";
import { listChats } from "./chat.ts";
import { createOpenTuiApp } from "./ui/screen.ts";
import { renderChatList, renderConvoList } from "./ui/components/chatList.ts";
import { Box, Text } from "@opentui/core";

console.log(">>> [INDEX] Module loaded, setting up event listeners...");

wsp.on("ready", async () => {
  console.log(">>> [INDEX.TS] Ready event fired!");
  console.log(">>> Starting TUI setup...");

  try {
    console.log(">>> About to fetch chats...");
    const chats = await listChats(wsp);
    console.log(">>> Chats loaded:", chats?.length);

    console.log(">>> Creating renderer...");
    const renderer = await createOpenTuiApp();
    console.log(">>> Renderer created");

    console.log(">>> Rendering chat list...");
    const chatListComponent = renderChatList(chats);
    console.log(">>> Chat list component created");

    console.log(">>> Adding component to renderer...");
    renderer.root.add(chatListComponent);
    console.log(">>> Component added to renderer");
    console.log(">>> TUI setup complete!");
  } catch (error) {
    console.error(">>> Error during setup:", error);
    console.error(">>> Stack trace:", (error as Error).stack);
    throw error;
  }
});

console.log(">>> [INDEX] Ready listener attached, now initializing client...");
wsp.initialize();

// Timeout check: if ready doesn't fire in 60 seconds, something is wrong
let readyFired = false;
wsp.on("ready", () => {
  readyFired = true;
});

setTimeout(() => {
  if (!readyFired) {
    console.error(
      ">>> [INDEX] WARNING: 'ready' event has not fired after 60 seconds!",
    );
    console.error(">>> This usually means:");
    console.error(">>>   1. WhatsApp Web failed to load in the browser");
    console.error(">>>   2. Network connectivity issues");
    console.error(">>>   3. WhatsApp service is down");
    console.error(">>> Try restarting the application.");
  }
}, 60000);

// let sendAnotherMessage = {
//   value: "true",
// };
// while (sendAnotherMessage.value) {
//   await displayChats(chats);
//   await selectChats(wsp, chats);
//   sendAnotherMessage = await prompts({
//     type: "confirm",
//     name: "value",
//     message: "Do you want to send another message?",
//   });
// }
// await wsp.destroy();
// process.exit(0);
