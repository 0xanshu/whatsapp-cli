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
  return Promise.all(
    messages.map(async (msg) => {
      let sender: string;

      if (msg.fromMe) {
        sender = "Me";
      } else if (chat.isGroup) {
        const contact = await msg.getContact();
        sender =
          contact.pushname ||
          contact.name ||
          contact.number ||
          msg.author ||
          msg.from;
      } else {
        sender = chat.name;
      }

      const body = msg.hasMedia ? "Image here.." : msg.body;

      return t`${bold(fg(sender === "Me" ? blue : green)(sender as string))}: \n${dim(body ?? "")}\n\n`;
    })
  );
}

export async function updateConvoList(
  textComponent: TextRenderable,
  chat: WAWebJS.Chat,
  chatID: string
): Promise<void> {
  const cachedMessages = await getChatMessages(chatID);
  const styledMessages = await formatMessages(cachedMessages, chat);
  textComponent.clear();
  for (const styledMsg of styledMessages) {
    textComponent.add(styledMsg);
  }
}
