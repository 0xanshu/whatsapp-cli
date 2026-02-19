import { renderChatList, renderConvoList } from "./chatList.ts";
import {
  BoxRenderable,
  CliRenderer,
  SelectRenderableEvents,
  type SelectOption,
} from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";
import { setupKeyboardInput } from "./keyboard.ts";

async function renderWhatsAppUI(renderer: CliRenderer, chats: WAWebJS.Chat[]) {
  const container = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
    flexDirection: "row",
  });

  const chatListComponent = renderChatList(renderer, chats);
  chatListComponent.focus();
  container.add(chatListComponent);

  let initialIndex = 0;
  try {
    const si = (chatListComponent as any).selectedIndex;
    if (typeof si === "number") initialIndex = si;
  } catch {
    initialIndex = 0;
  }

  // if (Array.isArray(chats) && chats.length > 0) {
  //   initialIndex = Math.max(0, Math.min(initialIndex, chats.length - 1));
  // } else {
  initialIndex = 0;
  // }

  let currentConvoComponent = await renderConvoList(
    renderer,
    chats,
    initialIndex,
  );
  container.add(currentConvoComponent);
  renderer.root.add(container);

  chatListComponent.on(
    SelectRenderableEvents.ITEM_SELECTED,
    async (index: number, option: SelectOption) => {
      console.log(">>> SELECT EVENT FIRED with index:", index);

      // removes the existing convo window
      container.remove("scrollComponent");
      const idx =
        typeof index === "number"
          ? Math.max(0, Math.min(index, chats.length - 1))
          : 0;
      currentConvoComponent = await renderConvoList(renderer, chats, idx);
      container.add(currentConvoComponent);
    },
  );

  setupKeyboardInput(renderer, {});
}

export { renderWhatsAppUI };
