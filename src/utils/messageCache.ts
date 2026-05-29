import type WAWebJS from "whatsapp-web.js";

let messageCache = new Map<string, WAWebJS.Message[]>();
const MAX_CACHED_CHATS = 20;
const MAX_MESSAGES_PER_CHAT = 200;

export function initializeChat(chatID: string, messages: WAWebJS.Message[]) {
  if (messageCache.size >= MAX_CACHED_CHATS && !messageCache.has(chatID)) {
    const oldestKey = messageCache.keys().next().value;
    if (oldestKey) messageCache.delete(oldestKey);
  }
  messageCache.set(chatID, messages.slice(-MAX_MESSAGES_PER_CHAT));
}

export function addMessageToCache(message: WAWebJS.Message, chatID: string) {
  const existing = messageCache.get(chatID);
  if (existing) {
    existing.push(message);
    if (existing.length > MAX_MESSAGES_PER_CHAT) {
      existing.splice(0, existing.length - MAX_MESSAGES_PER_CHAT);
    }
  } else {
    messageCache.set(chatID, [message]);
  }
}

export function getChatMessages(chatID: string) {
  return messageCache.get(chatID) ?? [];
}
