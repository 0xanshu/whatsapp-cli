import prompts from "prompts";
import type WAWebJS from "whatsapp-web.js";

async function listChats(wsp: WAWebJS.Client) {
  let chatsData: Awaited<ReturnType<WAWebJS.Client["getChats"]>>;
  try {
    while (true) {
      console.log("Fetching chats...");
      chatsData = await wsp.getChats();
      if (chatsData) return chatsData;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

async function displayChats(
  chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>,
) {
  if (!chats) {
    console.log("No chats available to display.");
    return;
  }
  for (let i = 0; i < Math.min(15, chats.length); i++) {
    const chatContact = await chats[i]?.getContact();
    const chat = await chatContact?.getChat();
    const chatName =
      chatContact?.name ||
      chatContact?.pushname ||
      chatContact?.number ||
      "Unnamed Chat";
    console.log(
      `${i + 1}. ${chatName} => ${chat?.lastMessage?.body || "No messages"} \n`,
    );
  }
}

// async function selectChats(
//   wsp: WAWebJS.Client,
//   chats: Awaited<ReturnType<WAWebJS.Client["getChats"]>>,
// ) {
//   let chatSelection = await prompts({
//     type: "number",
//     name: "value",
//     message: "Enter the chat number: ",
//     min: 1,
//     max: chats.length,
//   });

//   const chatContact = await chats[chatSelection.value - 1]?.getContact();
//   const chatName =
//     chatContact?.name ||
//     chatContact?.pushname ||
//     chatContact?.number ||
//     "Unnamed Chat";

//   console.log("Selected:", chatName);

//   const msgResponse = await prompts({
//     type: "text",
//     name: "value",
//     message: "Enter your message: ",
//   });

//   try {
//     if (!chatSelection.value) {
//       throw new Error("No chat selected");
//     }
//     await wsp.sendMessage(chats.id._serialized, msgResponse.value);
//     console.log("Message Sent!!");
//   } catch (error) {
//     console.log("Failed to send message: ", error);
//   }
// }

export { listChats, displayChats };
