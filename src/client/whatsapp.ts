import ww from "whatsapp-web.js";
import qr from "qrcode-terminal";

let client: ww.Client;
try {
  client = new ww.Client({
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

        // --- HIGH IMPACT ---
        "--disable-extensions",
        "--disable-software-rasterizer",
        "--disable-features=site-per-process",
        "--single-process",
        "--disable-renderer-backgrounding",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",

        // --- MEDIUM IMPACT ---
        "--mute-audio",
        "--hide-scrollbars",
        "--disable-ipc-flooding-protection",
        "--disable-default-apps",
        "--disable-hang-monitor",
        "--disable-prompt-on-repost",
        "--disable-translate",
        "--disable-component-update",
        "--metrics-recording-only",
        "--no-default-browser-check",

        // --- LOW IMPACT ---
        "--disable-domain-reliability",
        "--disable-client-side-phishing-detection",
        "--disable-sync",
        "--disable-features=TranslateUI",

        // --- MEMORY LIMIT ---
        '--js-flags="--max-old-space-size=512"',
      ],
    },
  });
} catch (error) {
  console.error(">>> [whatsapp.ts] Error initializing WhatsApp client:", error);
  throw error;
}

client.on("qr", (qrCode) => {
  console.log(">>> [whatsapp.ts] QR Code received, please scan...");
  qr.generate(qrCode, { small: true });
});

client.on("authenticated", () => {
  console.log(">>> [whatsapp.ts] Authentication successful!");
});

client.on("ready", () => {
  console.log(">>> [whatsapp.ts] WhatsApp client is ready!");
});

client.on("disconnected", (reason) => {
  console.log(">>> [whatsapp.ts] Client disconnected:", reason);
});

client.on("auth_failure", (message) => {
  console.error(">>> [whatsapp.ts] Authentication failure:", message);
});

export default client;

export function startConnectionWatchdog(isReady: () => boolean) {
  setTimeout(() => {
    if (!isReady()) {
      console.error(
        ">>> [index.ts] WhatsApp client failed to initialize within 60 seconds, TRY AGAIN!"
      );
      process.exit(1);
    }
  }, 120000);
}
