import prompts from "prompts";

async function listChats(wsp) {
  let chatsData;
  try {
    chatsData = await wsp.getChats();
  } catch (error) {
    console.log("Error: ", error);
  }
  return chatsData;
}

async function displayChats(chats) {
  for (let i = 0; i < Math.min(15, chats.length); i++) {
    console.log(
      `${i + 1}. ${chats[i].name} => ${chats[i].lastMessage?.body || "No messages"} \n`,
    );
  }
}

async function selectChats(wsp, chats) {
  let chatSelection = await prompts({
    type: "number",
    name: "value",
    message: "Enter the chat number: ",
    min: 1,
    max: chats.length,
  });

  console.log("Selected:", chats[chatSelection.value - 1].name);

  const msgResponse = await prompts({
    type: "text",
    name: "value",
    message: "Enter your message: ",
  });

  try {
    await wsp.sendMessage(
      chats[chatSelection.value - 1].id._serialized,
      msgResponse.value,
    );
    console.log("Message Sent!!");
  } catch (error) {
    console.log("Failed to send message: ", error);
  }
}

export { listChats, displayChats, selectChats };
