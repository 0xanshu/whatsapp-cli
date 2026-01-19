import { Client, LocalAuth } from "whatsapp-web.js";
import qr from "qrcode-terminal";

let client = new Client({
  authStrategy: new LocalAuth(),
});

// console.log(`
// ╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                                                                                                        ║
// ║   ██     ██ ██  ██   ██████  ████████  ██████   ██████  ███████  ███████         ██████  ██        ██████              ║
// ║   ██  █  ██ ██  ██  ██  __██    ██    ██  __██ ██  __██ ██  __██ ██  __██       ██  __██ ██ |       ░██ _|             ║
// ║   ██ ███ ██ ██  ██  ██ /  ██    ██    ██ /  ░░ ██ /  ██ ██ |  ██ ██ |  ██       ██ /  ░░ ██ |        ██ |              ║
// ║   ██ ██  ██ ██████  ████████    ██     ██████  ████████ ███████  ███████        ██ |     ██ |        ██ |              ║
// ║   ██   ████ ██  ██  ██  __██    ██    ██  __██ ██  __██ ██  ____  ██  ____      ██ |     ██ |        ██ |              ║
// ║   ██  / ░██ ██  ██  ██ |  ██    ██    ██ |  ██ ██ |  ██ ██ |      ██ |          ██ |  ██ ██ |        ██ |              ║
// ║   ██ /   ██ ██  ██  ██ |  ██    ██     ██████  ██ |  ██ ██ |      ██ |           ██████  ████████  ██████              ║
// ║   ░░     ░░ ░░  ░░  ░░ |  ░░    ░░      ░░░░░░  ░░ |  ░░ ░░ |      ░░ |            ░░░░░░  ░░░░░░░░ ░░░░░░░            ║
// ║                                                                                                                        ║
// ║                                         W H A T S A P P   C L I                                                        ║
// ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
// `);

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
  let status = "Unread";
  if (message.ack >= 3) {
    status = "Read";
  }
  console.log(
    `From: ${message._data.notifyName || message.from} => ${message.body} => Status: ${status}`,
  );
  console.log(`To ${message.fromMe} => ${message.body}`);
});

export default client;
