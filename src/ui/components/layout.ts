import { renderChatList, renderConvoList } from "./chatList.ts";
import { BoxRenderable, CliRenderer } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";

async function renderWhatsAppUI(renderer: CliRenderer, chats: WAWebJS.Chat[]) {
  const container = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
    flexDirection: "row",
  });

  const chatListComponent = renderChatList(chats);
  chatListComponent.focus();
  container.add(chatListComponent);

  let currentConvoComponent = await renderConvoList(
    chats,
    chatListComponent.selectedIndex || 0,
  );
  container.add(currentConvoComponent);

  renderer.root.add(container);

  chatListComponent.on("select", async (index: number) => {
    if (currentConvoComponent.id) {
      container.remove(currentConvoComponent.id);
    }
    currentConvoComponent = await renderConvoList(chats, index);
    container.add(currentConvoComponent);
  });
}

export { renderWhatsAppUI };
