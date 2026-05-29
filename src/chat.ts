import type WAWebJS from "whatsapp-web.js";
import { addMessageToCache } from "./utils/messageCache";

const MAX_RETRIES = 5;
const TIMEOUT = 60000;

export async function listChats(
  wsp: WAWebJS.Client
): Promise<WAWebJS.Chat[] | null> {
  let retries = MAX_RETRIES;

  while (retries > 0) {
    console.log(
      `>>> [chat.ts] Fetching chats... (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`
    );

    try {
      const chatsPromise = wsp.getChats();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject("Timeout");
        }, TIMEOUT);
      });

      const chatsData = await Promise.race([chatsPromise, timeoutPromise]);

      if (Array.isArray(chatsData) && chatsData.length > 0) {
        return chatsData;
      }
    } catch (error) {
      console.log(
        `>>> [chat.ts] Attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES} failed: ${error}`
      );
    }

    retries--;
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  console.error(">>> Failed to fetch chats after maximum retries");
  return null;
}

export async function sendMessages(
  chat: WAWebJS.Chat,
  value: string
): Promise<void> {
  const sentMessage = await chat.sendMessage(value);
  await addMessageToCache(sentMessage, chat.id._serialized);
}
