import {
  renderChatList,
  renderConvoList,
  convoInput,
  updateConvoList,
} from "./chatList.ts";
import {
  BoxRenderable,
  type CliRenderer,
  type SelectRenderable,
  SelectRenderableEvents,
  InputRenderableEvents,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { setupKeyboardInput } from "./keyboard.ts";
import { sendMessages } from "../../chat.ts";
import { initializeChat, addMessageToCache } from "../../utils/messageCache.ts";

export async function renderWhatsAppUI(
  wsp: WAWebJS.Client,
  renderer: CliRenderer,
  chats: WAWebJS.Chat[],
) {
  // making the whole window
  const container = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
    flexDirection: "row",
  });

  // making the conversation window
  const convoContainer = new BoxRenderable(renderer, {
    width: "70%",
    height: "100%",
    flexDirection: "column",
  });

  const chatListComponent = renderChatList(renderer, chats);
  chatListComponent.focus();
  container.add(chatListComponent);

  let initialIndex = 8096;
  try {
    const si = (chatListComponent as SelectRenderable).selectedIndex;
    if (typeof si === "number") initialIndex = si;
  } catch {
    initialIndex = 0;
  }

  if (Array.isArray(chats) && chats.length > 0) {
    initialIndex = Math.max(0, Math.min(initialIndex, chats.length - 1));
  } else {
    initialIndex = 0;
  }

  let currentConvoComponent = await renderConvoList(
    renderer,
    chats,
    initialIndex,
  );

  convoContainer.add(currentConvoComponent.scrollComponent);

  let currentIdx = initialIndex;
  const inputField = await convoInput(renderer);

  // re-rendering the whole convo component
  wsp.on("message_create", async (message) => {
    // Add incoming message to the cache first so it's fresh
    const chatMessageId = message.fromMe ? message.to : message.from;

    // Skip caching our own messages here since `sendMessages` already cached it on ENTER
    if (!message.fromMe) {
      await addMessageToCache(message, chatMessageId);
    }

    const currentChatId = chats[currentIdx]?.id._serialized;
    const isRelevant = chatMessageId === currentChatId;

    if (isRelevant) {
      const chat = chats[currentIdx];
      if (chat) {
        await updateConvoList(
          currentConvoComponent.convoListContent,
          chat,
          currentChatId,
        );
      }
    }
  });

  // input activates when pressed enter, triggers an activity to send the message
  inputField.on(InputRenderableEvents.ENTER, async (value) => {
    console.log("Input value:", value, "idx value:", currentIdx);
    const chat = chats[currentIdx];
    if (!chat) {
      throw new Error(`Chat at index ${currentIdx} not found`);
    }
    if (value != "") {
      await sendMessages(chat, value);
      await updateConvoList(
        currentConvoComponent.convoListContent,
        chat,
        chat.id._serialized,
      );
      inputField.value = "";
    }
  });

  // changing the chat that is selected
  chatListComponent.on(
    SelectRenderableEvents.ITEM_SELECTED,
    async (index: number) => {
      console.log(">>> SELECT EVENT FIRED with index:", index);

      convoContainer.remove("scrollComponent");
      convoContainer.remove("convoInput");

      currentIdx =
        typeof index === "number"
          ? Math.max(0, Math.min(index, chats.length - 1))
          : 0;

      const chat = chats[currentIdx];
      if (!chat) {
        console.log(">>> SELECTED CHAT IS NOT DEFINED");
        return;
      }

      currentConvoComponent = await renderConvoList(
        renderer,
        chats,
        currentIdx,
      );
      await initializeChat(chat.id._serialized, currentConvoComponent.messages);

      // adds the convo component and the input again in order so that input is added down only
      convoContainer.add(currentConvoComponent.scrollComponent);
      convoContainer.add(inputField);
    },
  );

  container.add(convoContainer);
  renderer.root.add(container);

  setupKeyboardInput(renderer, { inputField, chatListComponent });
}
