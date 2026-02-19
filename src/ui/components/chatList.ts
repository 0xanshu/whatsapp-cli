import {
  ScrollBox,
  Text,
  SelectRenderable,
  CliRenderer,
  ScrollBoxRenderable,
  TextRenderable,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";

function renderChatList(renderer: CliRenderer, chats: WAWebJS.Chat[]) {
  const selectComponent = new SelectRenderable(renderer, {
    id: "selectComponent",
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
  renderer: CliRenderer,
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
    const scrollComponent = new ScrollBoxRenderable(renderer, {
      id: "scrollComponent",
      width: "70%",
      height: "100%",
    });
    scrollComponent.add(
      new TextRenderable(renderer, {
        id: "convoChats",
        content: "Hello MF",
      }),
    );
    return scrollComponent;
  }

  const messages = await chat.fetchMessages({ limit: 100 });
  const chatContent = messages
    .map((msg) => `${msg.from}: ${msg.body}`)
    .join("\n");

  const scrollComponent = new ScrollBoxRenderable(
    renderer,
    {
      id: "scrollComponent",
      width: "70%",
      height: "100%",
      stickyScroll: true,
      stickyStart: "bottom",
    },
    // Text({ content: chatContent || "No messages in this chat" }),
  );
  scrollComponent.add(
    new TextRenderable(renderer, {
      id: "convoChats",
      content: chatContent || "No messages in here..",
    }),
  );
  return scrollComponent;
}

export { renderChatList, renderConvoList };
