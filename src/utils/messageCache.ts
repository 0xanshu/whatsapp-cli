import type WAWebJS from "whatsapp-web.js";

let messageCache = new Map<string, WAWebJS.Message[]>();
let newMessage: WAWebJS.Message;

async function initializeChat(chatID: string, message: WAWebJS.Message[]) {
  messageCache.set(chatID, message);
}

async function createCachedMessage(message: WAWebJS.Message) {
  newMessage = message;
}

async function addMessageToCache(chatID: string) {
  let allMessages = messageCache.get(chatID);
  allMessages?.push(newMessage);
}

async function getChatMessages(chatID: string) {
  return messageCache.get(chatID) ?? [];
}

export {
  initializeChat,
  createCachedMessage,
  addMessageToCache,
  getChatMessages,
};
