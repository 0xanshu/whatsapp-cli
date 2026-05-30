import type WAWebJS from "whatsapp-web.js";
import { type InputRenderable, InputRenderableEvents } from "@opentui/core";
import { updateConvoList } from "../ui/components/chatList.ts";
import { addMessageToCache } from "../utils/messageCache.ts";
import { sendMessages } from "../chat.ts";
import type { state as AppState } from "../state/appState.ts";

export function registerMessageEvents(
  wsp: WAWebJS.Client,
  chats: WAWebJS.Chat[],
  state: typeof AppState
) {
  wsp.on("message_create", async (message) => {
    const chatMessageId = message.fromMe ? message.to : message.from;

    if (!message.fromMe) {
      await addMessageToCache(message, chatMessageId);
    }

    const currentChatId = chats[state.currentIdx]?.id._serialized;
    const isRelevant = chatMessageId === currentChatId;

    if (isRelevant) {
      const chat = chats[state.currentIdx];
      if (chat && state.currentConvoComponent?.convoListContent) {
        await updateConvoList(
          state.currentConvoComponent.convoListContent,
          chat,
          currentChatId
        );
      }
    }
  });
}

export function registerUIEvents(
  inputField: InputRenderable,
  chats: WAWebJS.Chat[],
  state: typeof AppState
) {
  // input activates when pressed enter, triggers an activity to send the message
  inputField.on(InputRenderableEvents.ENTER, async () => {
    const value = inputField.value;
    const chat = chats[state.currentIdx];

    if (!chat) {
      throw new Error(`Chat at index ${state.currentIdx} not found`);
    }
    if (value !== "" && state.currentConvoComponent?.convoListContent) {
      await sendMessages(chat, value);
      await updateConvoList(
        state.currentConvoComponent.convoListContent,
        chat,
        chat.id._serialized
      );
      inputField.value = "";
    }
  });
}
