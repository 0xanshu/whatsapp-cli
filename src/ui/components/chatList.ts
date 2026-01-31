import { Select, Box, Text } from "@opentui/core";

function renderChatList(chats: any[]) {
  const selectComponent = Select({
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    options: chats.map((chat) => ({
      name: chat.name || chat.id.user || "Unknown",
      description: chat.lastMessage?.body || "No messages yet",
    })),
  });
  return selectComponent;
}

async function renderConvoList(chats: any[], chatIndex: number) {}

export { renderChatList, renderConvoList };
