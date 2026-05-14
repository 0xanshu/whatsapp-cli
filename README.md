# whatsapp-cli

A command-line interface for WhatsApp built with TypeScript and [Bun](https://bun.com). Send and manage WhatsApp messages programmatically with an intuitive terminal UI.

## Prerequisites

- [Bun](https://bun.com) v1.2.21 or higher
- Node.js 18+ (for compatibility)
- A WhatsApp account, signed in on a phone

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/whatsapp-cli.git
cd whatsapp-cli
bun install
bun run dev
```

The application will open an interactive TUI where you can:

- View your chat list
- Send messages
- Receive real-time message updates

## Project Structure

```
src/
├── index.ts              # Application entry point
├── chat.ts               # Chat management logic
├── client/
│   └── whatsapp.ts       # WhatsApp Web client wrapper
├── types/                # TypeScript type definitions
├── ui/
│   ├── screen.ts         # Main UI screen manager
│   └── components/
│       ├── chatList.ts    # Chat list component
│       ├── keyboard.ts    # Keyboard input handler
│       └── layout.ts      # UI layout manager
└── utils/
    └── messageCache.ts   # Message caching utilities
```

## Known Issues & Fixes

### WhatsApp Message Send Error

If you encounter the following error:

```
Failed to send message: Error [TypeError]: Cannot read properties of undefined (reading 'markedUnread')
```

**Solution:** Add the following code to line 16 of `node_modules/whatsapp-web.js/src/util/Util.js`:

```javascript
if (
  window.compareWwebVersions(window.Debug.VERSION, "<=", "2.3000.1031980585")
) {
  await window.Store.SendSeen.sendSeen(chat);
} else {
  await window.Store.SendSeen.sendSeen({
    chat: chat,
    threadId: undefined,
  });
}
```

This ensures compatibility with newer versions of WhatsApp Web.

## Configuration

Configuration options can be set via environment variables or a `.env` file in the project root.

## Development

### Build

```bash
bun build src/index.ts --outfile dist/index.js
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This project is unofficial and not affiliated with WhatsApp or Meta Platforms, Inc. Use at your own risk and ensure you comply with WhatsApp's Terms of Service.

## Acknowledgments

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web client library
- [Bun](https://bun.com) - JavaScript runtime
