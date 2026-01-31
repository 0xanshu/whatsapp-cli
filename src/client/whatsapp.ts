import ww from "whatsapp-web.js";
import qr from "qrcode-terminal";

let client = new ww.Client({
  authStrategy: new ww.LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
  webVersionCache: {
    type: "none",
  },
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
  console.log(">>> QR Code received, please scan...");
  qr.generate(qrCode, { small: true });
});

client.on("authenticated", () => {
  console.log(">>> [CLIENT] Authentication successful!");
});

client.on("ready", () => {
  console.log(">>> [CLIENT] WhatsApp client is ready!");
});

client.on("loading_screen", (percent, message) => {
  console.log(`>>> [CLIENT] Loading: ${percent}% - ${message}`);
});

client.on("disconnected", (reason) => {
  console.log(">>> Client disconnected:", reason);
});

client.on("auth_failure", (message) => {
  console.error(">>> Authentication failure:", message);
});

client.on("message", (message) => {
  let status = "Unread";
  if (message.ack >= 3) {
    status = "Read";
  }
});

const events = [
  "qr",
  "authenticated",
  "ready",
  "loading_screen",
  "disconnected",
  "auth_failure",
  "change_state",
];
console.log(`>>> [CLIENT] Monitoring events: ${events.join(", ")}`);

client.on("change_state", (state) => {
  console.log(`>>> [CLIENT] State changed to: ${state}`);
});

export default client;
