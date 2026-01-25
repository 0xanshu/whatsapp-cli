function renderChatList(box, chats) {
  let chatListString = "";
  for (let i = 0; i < Math.min(15, chats.length); i++) {
    chatListString += `${i + 1}. ${chats[i].name} \n ${chats[i].lastMessage?.body}\n\n`;
  }
  box.setContent(chatListString || "No chats found");
}

export { renderChatList };
