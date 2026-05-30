import type { TextRenderable, ScrollBoxRenderable } from "@opentui/core";
import type WAWebJS from "whatsapp-web.js";

export const state: {
  currentIdx: number;
  currentConvoComponent:
    | {
        convoListContent: TextRenderable;
        scrollComponent?: ScrollBoxRenderable;
        messages?: WAWebJS.Message[];
      }
    | any;
} = {
  currentIdx: 0,
  currentConvoComponent: null,
};
