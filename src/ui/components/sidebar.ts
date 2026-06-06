import { SelectRenderable, type CliRenderer } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";

export function renderChatList(
  renderer: CliRenderer,
  chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>
) {
  const selectComponent = new SelectRenderable(renderer, {
    id: "selectComponent",
    width: "100%",
    height: "100%",
    paddingRight: 5,
    paddingTop: 5,
    itemSpacing: 1,
    options: chats.map((chat) => ({
      name: chat.name || chat.id.user || "Unknown",
      description: "",
    })),
  });
  return selectComponent;
}
