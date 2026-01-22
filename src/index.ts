import wsp from "./client/whatsapp.ts";
import prompts from "prompts";

wsp.initialize();

async function sendInteractiveMessage() {
  const phoneResponse = await prompts({
    type: "text",
    name: "value",
    message: "Enter your phone no",
  });
  const msgResponse = await prompts({
    type: "text",
    name: "value",
    message: "Enter your message",
  });
  try {
    await wsp.sendMessage(
      "91" + phoneResponse.value + "@c.us",
      msgResponse.value,
    );
    console.log("Message Sent!!");
  } catch (error) {
    console.log("Failed to send message: ", error);
  }
}

wsp.on("ready", async () => {
  let sendAnotherMessage = {
    value: "true",
  };
  while (sendAnotherMessage.value) {
    await sendInteractiveMessage();

    sendAnotherMessage = await prompts({
      type: "confirm",
      name: "value",
      message: "Do you want to send another message?",
    });
  }
  await wsp.destroy();
  process.exit(0);
});

console.log("Whatsapp CLI starting...");
