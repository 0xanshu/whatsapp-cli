import wsp from "./client/whatsapp.ts";

wsp.initialize();

wsp.on("ready", async () => {
  try {
    await wsp.sendMessage("918920228276@c.us", "Hello from my CLI!");
  } catch (error) {
    console.log("Failed to send message: ", error);
  }
});

console.log("Whatsapp CLI starting...");
