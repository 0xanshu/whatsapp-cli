import wsp from "./client/whatsapp.ts";
import { listChats, displayChats, selectChats } from "./chat.ts";
import prompts from "prompts";
import {
  createScreen,
  createChatListBox,
  createConversationBox,
} from "./ui/screen.ts";
import { renderChatList } from "./ui/components/chatList.ts";

wsp.initialize();

wsp.on("ready", async () => {
  const screen = createScreen();
  const chatListBox = createChatListBox(screen);
  const convoBox = createConversationBox(screen);

  try {
    chatListBox.setContent("Loading chats...");
    screen.render();

    const chats = await listChats(wsp);

    chatListBox.setContent(`Found ${chats?.length || 0} chats. Rendering...`);
    screen.render();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!chats || chats.length === 0) {
      chatListBox.setContent("No chats found");
    } else {
      renderChatList(chatListBox, chats);
    }

    screen.render();
  } catch (err) {
    chatListBox.setContent(`Error: ${err.message}`);
    screen.render();
  }

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
});

// console.log("Whatsapp CLI starting...");
``;
