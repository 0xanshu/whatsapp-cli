import type WAWebJS from "whatsapp-web.js";

let messageCache = new Map<string, WAWebJS.Message[]>();
let allMessages: WAWebJS.Message[] | undefined;

async function initializeChat(chatID: string, message: WAWebJS.Message[]) {
  messageCache.set(chatID, message);
}

async function addMessageToCache(message: WAWebJS.Message, chatID: string) {
  allMessages = messageCache.get(chatID);
  if (allMessages) {
    allMessages.push(message);
  } else {
    messageCache.set(chatID, [message]);
  }
}

async function getChatMessages(chatID: string) {
  return allMessages ?? [];
}

export { initializeChat, addMessageToCache, getChatMessages };
