import { Client, LocalAuth } from "whatsapp-web.js";
import qr from "qrcode-terminal";

let client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qrCode) => {
  qr.generate(qrCode, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.on("authenticated", () => {
  console.log("Authentication successful!");
});

client.on("message", (message) => {
  console.log(
    `From: ${message._data.notifyName || message.from} => ${message.body}`,
  );
});

export default client;
