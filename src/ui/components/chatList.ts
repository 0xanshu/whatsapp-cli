import { Select, ScrollBox, Text } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";

function renderChatList(chats: WAWebJS.Chat[]) {
  const selectComponent = Select({
    width: "30%",
    height: "100%",
    options: chats.map((chat) => ({
      name: chat.name || chat.id.user || "Unknown",
      description: chat.lastMessage?.body || "No messages yet",
    })),
  });
  return selectComponent;
}

async function renderConvoList(
  chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>,
  chatIndex: number,
) {
  let chatContact = await chats[chatIndex]?.getContact();
  let chatData = await chatContact?.getChat();
  const chatContent = chatData
    ? `Chat: ${chatData.name || "Unknown"}\n\nLast Message: ${chatData.lastMessage?.body || "No messages"}`
    : "No chat data available";

  const scrollComponent = ScrollBox(
    {
      width: "70%",
      height: "100%",
    },
    Text({ content: chatContent }),
  );

  return scrollComponent;
}

export { renderChatList, renderConvoList };
