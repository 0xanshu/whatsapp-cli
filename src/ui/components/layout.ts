import { renderChatList, renderConvoList, convoInput } from "./chatList.ts";
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

async function renderWhatsAppUI(
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

  let initialIndex = 0;
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
  let cacheConvoComponent = currentConvoComponent;
  convoContainer.add(currentConvoComponent);

  let currentIdx = initialIndex;
  const inputField = await convoInput(renderer);

  // re-rendering the whole convo component
  wsp.on("message_create", async (message) => {
    const currentChatId = chats[currentIdx]?.id._serialized;

    const isRelevant = message.fromMe
      ? message.to === currentChatId
      : message.from === currentChatId;

    if (isRelevant) {
      convoContainer.remove("scrollComponent");
      convoContainer.remove("inputField");

      currentConvoComponent = await renderConvoList(
        renderer,
        chats,
        currentIdx,
      );

      convoContainer.add(currentConvoComponent);
      convoContainer.add(inputField);
    }
  });

  // input activates when pressed enter, triggers an activity to send the message
  inputField.on(InputRenderableEvents.ENTER, async (value) => {
    console.log("Input value:", value, "idx value:", currentIdx);

    // awaiting till the message is sent
    await sendMessages(chats, currentIdx, value);

    let currentMessageSent = value;
    cache.getCurrentMessage(value);

    // clearing the input field after return is pressed
    inputField.value = "";
  });

  // changing the chat that is selected
  chatListComponent.on(
    SelectRenderableEvents.ITEM_SELECTED,
    async (index: number) => {
      console.log(">>> SELECT EVENT FIRED with index:", index);

      // removes the existing convo window
      convoContainer.remove("scrollComponent");
      convoContainer.remove("inputField");

      currentIdx =
        typeof index === "number"
          ? Math.max(0, Math.min(index, chats.length - 1))
          : 0;

      currentConvoComponent = await renderConvoList(
        renderer,
        chats,
        currentIdx,
      );

      // adds the convo component and the input again in order so that input is added down only
      convoContainer.add(currentConvoComponent);
      convoContainer.add(inputField);
    },
  );

  container.add(convoContainer);
  renderer.root.add(container);

  setupKeyboardInput(renderer, { inputField, chatListComponent });
}

export { renderWhatsAppUI };
