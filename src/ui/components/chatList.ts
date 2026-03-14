import {
  SelectRenderable,
  type CliRenderer,
  ScrollBoxRenderable,
  TextRenderable,
  InputRenderable,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { getChatMessages } from "../../utils/messageCache";

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
  let messages: WAWebJS.Message[] = [];

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

    const convoListContent = new TextRenderable(renderer, {
      id: "convoChats",
      content: "Hello there!",
    });

    scrollComponent.add(convoListContent);
    messages = [];
    return { scrollComponent, convoListContent, messages };
  }

  messages = await chat.fetchMessages({ limit: 100 });
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

  const convoListContent = new TextRenderable(renderer, {
    id: "convoChats",
    content: chatContent || "No messages in here..",
  });
  scrollComponent.add(convoListContent);

  return { scrollComponent, convoListContent, messages };
}

async function updateConvoList(
  textComponent: TextRenderable,
  chat: WAWebJS.Chat,
  isGroup: boolean,
  chatID: string,
): Promise<void> {
  const cachedMessages = getChatMessages(chatID);

  const formattedText = cachedMessages
    .map(
      (msg) =>
        `${msg.fromMe ? "Me" : (chat.isGroup ? msg.author : chat.name) || msg.from}: \n${msg.hasMedia ? "Image here.." : msg.body}\n`,
    )
    .join("\n");

  textComponent.content = formattedText;
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

export { renderChatList, renderConvoList, updateConvoList, convoInput };
