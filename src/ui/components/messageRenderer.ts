import type { TextRenderable } from "@opentui/core";
import { t, bold, dim, fg, parseColor } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { getChatMessages } from "../../utils/messageCache";

const green = parseColor("#a3e635");
const blue = parseColor("#38bdf8");

export async function formatMessages(
  messages: WAWebJS.Message[],
  chat: WAWebJS.Chat
) {
  const contactMap = new Map<string, WAWebJS.Contact>();
  if (chat.isGroup) {
    const uniqueJids = [
      ...new Set(
        messages
          .filter((msg) => !msg.fromMe && (msg.author || msg.from))
          .map((msg) => msg.author || msg.from)
      ),
    ];

    await Promise.all(
      uniqueJids.map(async (jid) => {
        const msg = messages.find(
          (m) => !m.fromMe && (m.author || m.from) === jid
        )!;
        const contact = await msg.getContact();
        contactMap.set(jid, contact);
      })
    );
  }

  return messages.map((msg) => {
    let sender: string;

    if (msg.fromMe) {
      sender = "Me";
    } else if (chat.isGroup) {
      const jid = msg.author || msg.from;
      const contact = contactMap.get(jid);
      sender =
        contact?.pushname ||
        contact?.name ||
        contact?.number ||
        msg.author ||
        msg.from;
    } else {
      sender = chat.name;
    }

    const body = msg.hasMedia ? "Image here.." : msg.body;

    return t`${bold(fg(sender === "Me" ? blue : green)(sender as string))}: \n${dim(body ?? "")}\n\n`;
  });
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
