import type WAWebJS from "whatsapp-web.js";

const MAX_RETRIES = 20;
const RETRY_DELAY_MS = 2000;

async function listChats(wsp: WAWebJS.Client): Promise<WAWebJS.Chat[] | null> {
  let retries = MAX_RETRIES;

  try {
    while (retries > 0) {
      console.log(
        `Fetching chats... (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`,
      );
      const chatsData = await wsp.getChats();

      if (chatsData && chatsData.length > 0) {
        return chatsData;
      }

      retries--;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    console.error(">>> Failed to fetch chats after maximum retries");
    return null;
  } catch (error) {
    console.error(">>> Error fetching chats:", error);
    throw error;
  }
}

async function sendMessages(chat: WAWebJS.Chat[], idx: number, value: string) {
  chat[idx]?.sendMessage(value);
}

export { listChats, sendMessages };
