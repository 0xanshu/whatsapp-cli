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
  TextRenderable,
  InputRenderable,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { setupKeyboardInput } from "./keyboard.ts";
import { sendMessages } from "../../chat.ts";
import { initializeChat, addMessageToCache } from "../../utils/messageCache.ts";

function buildLayout(renderer: CliRenderer, chats: WAWebJS.Chat[]) {
  const container = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
    flexDirection: "row",
  });

  const convoContainer = new BoxRenderable(renderer, {
    width: "70%",
    height: "100%",
    marginLeft: 1,
    border: true,
    borderColor: "gray",
    borderStyle: "rounded",
    title: "",
    titleAlignment: "left",
    flexDirection: "column",
  });

  const chatListContainer = new BoxRenderable(renderer, {
    width: "30%",
    height: "100%",
    border: true,
    borderColor: "gray",
    borderStyle: "rounded",
    title: "Chat List",
    titleAlignment: "left",
  });

  const chatListComponent = renderChatList(renderer, chats);
  chatListComponent.focus();
  chatListContainer.add(chatListComponent);
  container.add(chatListContainer);

  return { container, chatListComponent, convoContainer };
}

function registerMessageEvents(
  wsp: WAWebJS.Client,
  chats: WAWebJS.Chat[],
  state: {
    currentIdx: number;
    currentConvoComponent: { convoListContent: TextRenderable };
  }
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
      if (chat) {
        await updateConvoList(
          state.currentConvoComponent.convoListContent,
          chat,
          currentChatId
        );
      }
    }
  });
}

function registerUIEvents(
  inputField: InputRenderable,
  chats: WAWebJS.Chat[],
  state: {
    currentIdx: number;
    currentConvoComponent: { convoListContent: TextRenderable };
  }
) {
  // input activates when pressed enter, triggers an activity to send the message
  inputField.on(InputRenderableEvents.ENTER, async () => {
    const value = inputField.value;
    const chat = chats[state.currentIdx];

    if (!chat) {
      throw new Error(`Chat at index ${state.currentIdx} not found`);
    }
    if (value != "") {
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

export async function renderWhatsAppUI(
  wsp: WAWebJS.Client,
  renderer: CliRenderer,
  chats: WAWebJS.Chat[]
) {
  const { container, chatListComponent, convoContainer } = buildLayout(
    renderer,
    chats
  );

  let initialIndex = -1;
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
    initialIndex
  );

  const initialChat = chats[initialIndex];
  if (initialChat) {
    await initializeChat(
      initialChat.id._serialized,
      currentConvoComponent.messages
    );
  }

  convoContainer.add(currentConvoComponent.scrollComponent);

  let currentIdx = initialIndex;
  const inputField = await convoInput(renderer);

  const state = {
    currentIdx: initialIndex,
    currentConvoComponent,
  };

  registerMessageEvents(wsp, chats, state);

  registerUIEvents(inputField, chats, state);

  // changing the chat that is selected
  chatListComponent.on(
    SelectRenderableEvents.ITEM_SELECTED,
    async (index: number) => {
      convoContainer.remove("scrollComponent");
      convoContainer.remove("convoInput");

      currentIdx =
        typeof index === "number"
          ? Math.max(0, Math.min(index, chats.length - 1))
          : 0;

      state.currentIdx = currentIdx;

      const chat = chats[currentIdx];
      if (!chat) {
        console.log(">>> SELECTED CHAT IS NOT DEFINED");
        return;
      }

      currentConvoComponent = await renderConvoList(
        renderer,
        chats,
        currentIdx
      );
      state.currentConvoComponent = currentConvoComponent;
      await initializeChat(chat.id._serialized, currentConvoComponent.messages);

      // adds the convo component and the input again in order so that input is added down only
      convoContainer.add(currentConvoComponent.scrollComponent);
      convoContainer.add(inputField);
    }
  );

  container.add(convoContainer);
  renderer.root.add(container);

  setupKeyboardInput(renderer, {
    inputField,
    chatListComponent,
    onExit: async () => wsp.destroy(),
  });
}
