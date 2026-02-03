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

  console.log("selectComponent type:", typeof selectComponent);
  console.log("selectComponent keys:", Object.keys(selectComponent));
  console.log(
    "selectComponent.selectedIndex:",
    (selectComponent as any).selectedIndex,
  );

  return selectComponent;
}

async function renderConvoList(
  chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>,
  chatIndex: number,
) {
  const idx =
    typeof chatIndex === "number"
      ? Math.max(0, Math.min(chatIndex, (chats?.length ?? 0) - 1))
      : 0;
  const chat = chats[idx];

  if (!chat) {
    const isLoading = Array.isArray(chats) && chats.length === 0;
    const scrollComponent = ScrollBox(
      {
        width: "70%",
        height: "100%",
      },
      Text({ content: isLoading ? "Loading chats..." : "Chat not found" }),
    );
    return scrollComponent;
  }

  const messages = await chat.fetchMessages({ limit: 100 });
  const chatContent = messages
    .map((msg) => `${msg.from}: ${msg.body}`)
    .join("\n");

  const scrollComponent = ScrollBox(
    {
      width: "70%",
      height: "100%",
    },
    Text({ content: chatContent || "No messages in this chat" }),
  );
  return scrollComponent;
}

export { renderChatList, renderConvoList };
