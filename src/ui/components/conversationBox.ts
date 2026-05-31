import {
  type CliRenderer,
  ScrollBoxRenderable,
  TextRenderable,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { formatMessages } from "./chatList";

export async function renderConvoList(
  renderer: CliRenderer,
  chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>,
  chatIndex: number
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
  const chatContent = formatMessages(messages, chat);

  const scrollComponent = new ScrollBoxRenderable(renderer, {
    id: "scrollComponent",
    width: "100%",
    height: "auto",
    stickyScroll: true,
    stickyStart: "bottom",
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 2,
    paddingTop: 1,
  });

  const convoListContent = new TextRenderable(renderer, {
    id: "convoChats",
    content: chatContent || "No messages in here..",
  });
  scrollComponent.add(convoListContent);

  return { scrollComponent, convoListContent, messages };
}
