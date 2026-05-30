import {
  BoxRenderable,
  type CliRenderer,
  type SelectRenderable,
  SelectRenderableEvents,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { setupKeyboardInput } from "../events/keyboard.ts";
import { sendMessages } from "../../chat.ts";
import { initializeChat, addMessageToCache } from "../../utils/messageCache.ts";
import { renderChatList } from "./sidebar.ts";
import { renderConvoList } from "./conversationBox.ts";
import { convoInput } from "./messageInput.ts";
import {
  registerMessageEvents,
  registerUIEvents,
} from "../events/messageHandlers.ts";
import { state } from "../../state/appState.ts";
import { handleChatSelectionChange } from "../events/chatSelection.ts";

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

  state.currentIdx = initialIndex;
  state.currentConvoComponent = currentConvoComponent;

  registerMessageEvents(wsp, chats, state);

  registerUIEvents(inputField, chats, state);

  // changing the chat that is selected
  chatListComponent.on(
    SelectRenderableEvents.ITEM_SELECTED,
    async (index: number) => {
      await handleChatSelectionChange(
        index,
        renderer,
        chats,
        state,
        convoContainer,
        inputField
      );
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
