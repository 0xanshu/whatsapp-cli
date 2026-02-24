import {
  SelectRenderable,
  type CliRenderer,
  ScrollBoxRenderable,
  TextRenderable,
  InputRenderable,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";

function renderChatList(
  renderer: CliRenderer,
  chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>,
) {
  const selectComponent = new SelectRenderable(renderer, {
    id: "selectComponent",
    width: "30%",
    height: "100%",
    paddingRight: 5,
    paddingTop: 5,
    itemSpacing: 1,
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
    const scrollComponent = new ScrollBoxRenderable(renderer, {
      id: "scrollComponent",
      width: "70%",
      height: "95%",
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
  const chatContact = chat.name;
  const chatContent = messages
    .map(
      (msg) =>
        `${msg.fromMe ? "Me" : (chat.isGroup ? msg.author : chatContact) || msg.from}: \n${msg.hasMedia ? "Image here.." : msg.body}\n`,
    )
    .join("\n");

  const scrollComponent = new ScrollBoxRenderable(renderer, {
    id: "scrollComponent",
    width: "100%",
    height: "auto",
    stickyScroll: true,
    stickyStart: "bottom",
    paddingLeft: 5,
    paddingBottom: 1,
  });

  scrollComponent.add(
    new TextRenderable(renderer, {
      id: "convoChats",
      content: chatContent || "No messages in here..",
    }),
  );

  return scrollComponent;
}

async function convoInput(renderer: CliRenderer) {
  const input = new InputRenderable(renderer, {
    id: "convoInput",
    width: "100%",
    marginLeft: 5,
    marginBottom: 2,
    placeholder: "Enter your message..",
  });

  return input;
}

export { renderChatList, renderConvoList, convoInput };
