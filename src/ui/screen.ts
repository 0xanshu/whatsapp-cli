import blessed from "blessed";

function createScreen() {
  const screen = blessed.screen({
    smartCSR: true,
    title: "WhatsApp CLI",
    // terminal: "xterm-256color",
  });
  screen.key(["q", "C-c"], () => {
    return process.exit(0);
  });
  screen.render();
  return screen;
}

function createChatListBox(screen) {
  const box = blessed.box({
    top: 0,
    left: 0,
    width: "30%",
    height: "100%",
    border: { type: "line" },
    label: "Chats",
  });
  screen.append(box);
  return box;
}

function createConversationBox(screen) {
  const box = blessed.box({
    top: 0,
    left: "30%",
    width: "70%",
    height: "100%",
    border: { type: "line" },
    label: "Conversation",
  });
  screen.append(box);
  return box;
}

export { createScreen, createChatListBox, createConversationBox };
