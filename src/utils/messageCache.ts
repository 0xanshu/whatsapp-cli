import type WAWebJS from "whatsapp-web.js";

let messageCache = new Map<string, WAWebJS.Message[]>();
let newMessage: WAWebJS.Message;

function initializeChat(chatID: string, message: WAWebJS.Message[]) {
  messageCache.set(chatID, message);
}

function createCachedMessage(message: WAWebJS.Message) {
  newMessage = message;
}

function addMessageToCache(chatID: string) {
  let allMessages = messageCache.get(chatID);
  allMessages?.push(newMessage);
}

function getChatMessages(chatID: string) {
  return messageCache.get(chatID) ?? [];
}

export {
  initializeChat,
  createCachedMessage,
  addMessageToCache,
  getChatMessages,
};
