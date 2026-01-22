import ww from "whatsapp-web.js";
import qr from "qrcode-terminal";

// console.log(ww);

let client = new ww.Client({
  authStrategy: new ww.LocalAuth(),
});

const largeArt = `\x1b[32m
 ___       __   ___  ___  ________  _________  ________  ________  ________  ________
|\\  \\     |\\  \\|\\  \\|\\  \\|\\   __  \\|\\___   ___\\\\   ____\\|\\   __  \\|\\   __  \\|\\   __  \\
\\ \\  \\    \\ \\  \\ \\  \\\\\\  \\ \\  \\|\\  \\|___ \\  \\_\\ \\  \\___|\\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\|\\  \\
 \\ \\  \\  __\\ \\  \\ \\   __  \\ \\   __  \\   \\ \\  \\ \\ \\_____  \\ \\   __  \\ \\   ____\\ \\   ____\\
  \\ \\  \\|\\__\\_\\  \\ \\  \\ \\  \\ \\  \\ \\  \\   \\ \\  \\ \\|____|\\  \\ \\  \\ \\  \\ \\  \\___|\\ \\  \\___|
   \\ \\____________\\ \\__\\ \\__\\ \\__\\ \\__\\   \\ \\__\\  ____\\_\\  \\ \\__\\ \\__\\ \\__\\    \\ \\__\\
    \\|____________|\\|__|\\|__|\\|__|\\|__|    \\|__| |\\_________\\|__|\\|__|\\|__|     \\|__|
                                                 \\|_________|
 ________  ___       ___
|\\   ____\\|\\  \\     |\\  \\
\\ \\  \\___|\\ \\  \\    \\ \\  \\
 \\ \\  \\    \\ \\  \\    \\ \\  \\
  \\ \\  \\____\\ \\  \\____\\ \\  \\
   \\ \\_______\\ \\_______\\ \\__\\
    \\|_______|\\|_______|\\|__|
\x1b[0m`;

const smallArt = `\x1b[32m
╔════════════════════════════════════════╗
║        WELCOME TO WHATSAPP CLI         ║
╚════════════════════════════════════════╝
\x1b[0m`;

const MIN_WIDTH = 92;

if (process.stdout.columns && process.stdout.columns < MIN_WIDTH) {
  console.log(smallArt);
} else {
  console.log(largeArt);
}

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
});

export default client;
