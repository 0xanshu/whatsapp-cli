import type { CliRenderer, BoxRenderable, InputRenderable } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { renderConvoList } from "../components/conversationBox.ts";
import { initializeChat } from "../../utils/messageCache.ts";

export async function handleChatSelectionChange(
  index: number,
  renderer: CliRenderer,
  chats: WAWebJS.Chat[],
  state: any,
  convoContainer: BoxRenderable,
  inputField: InputRenderable
) {
  convoContainer.remove("scrollComponent");
  convoContainer.remove("convoInput");

  const currentIdx =
    typeof index === "number"
      ? Math.max(0, Math.min(index, chats.length - 1))
      : 0;

  state.currentIdx = currentIdx;

  const chat = chats[currentIdx];
  if (!chat) {
    console.log(">>> SELECTED CHAT IS NOT DEFINED");
    return;
  }

  const currentConvoComponent = await renderConvoList(
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
