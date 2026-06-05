import type { TextRenderable } from "@opentui/core";
import { t, bold, dim, fg, parseColor } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { getChatMessages } from "../../utils/messageCache";

const green = parseColor("#a3e635");
const blue = parseColor("#38bdf8");

export function formatMessages(
  messages: WAWebJS.Message[],
  chat: WAWebJS.Chat
) {
  return messages.map((msg) => {
    const sender = msg.fromMe
      ? "Me"
      : (chat.isGroup ? msg.author : chat.name) || msg.from;

    const body = msg.hasMedia ? "Image here.." : msg.body;

    return t`${bold(fg(sender === "Me" ? blue : green)(sender ?? ""))}: \n${dim(body ?? "")}\n\n`;
  });
}

export async function updateConvoList(
  textComponent: TextRenderable,
  chat: WAWebJS.Chat,
  chatID: string
): Promise<void> {
  const cachedMessages = await getChatMessages(chatID);
  const styledMessages = formatMessages(cachedMessages, chat);
  textComponent.clear();
  for (const styledMsg of styledMessages) {
    textComponent.add(styledMsg);
  }
}
