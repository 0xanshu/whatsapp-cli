import { TextRenderable } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { getChatMessages } from "../utils/messageCache";

export function formatMessages(
  messages: WAWebJS.Message[],
  chat: WAWebJS.Chat
) {
  return messages
    .map(
      (msg) =>
        `${msg.fromMe ? "Me" : (chat.isGroup ? msg.author : chat.name) || msg.from}: \n${msg.hasMedia ? "Image here.." : msg.body}\n`
    )
    .join("\n");
}

export async function updateConvoList(
  textComponent: TextRenderable,
  chat: WAWebJS.Chat,
  chatID: string
): Promise<void> {
  const cachedMessages = await getChatMessages(chatID);
  const chatContent = formatMessages(cachedMessages, chat);
  textComponent.content = chatContent;
}
