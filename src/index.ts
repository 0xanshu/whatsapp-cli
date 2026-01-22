import wsp from "./client/whatsapp.ts";

wsp.initialize();

wsp.on("ready", async () => {
  try {
    await wsp.sendMessage("916353300979@c.us", "Hello from my CLI!");
    console.log("Message Sent");
  } catch (error) {
    console.log("Failed to send message: ", error);
  }
});

console.log("Whatsapp CLI starting...");
