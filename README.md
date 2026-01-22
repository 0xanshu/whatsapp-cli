# whatsapp-cli

To solve the ```Failed to send message:  Error [TypeError]: Cannot read properties of undefined (reading 'markedUnread')``` bug: we add this to line 16 of ```node_modules/whatsapp-web.js/src/util/Util.js```
```
if (window.compareWwebVersions(window.Debug.VERSION, "<=", "2.3000.1031980585")) {
                await window.Store.SendSeen.sendSeen(chat);
            } else {
                await window.Store.SendSeen.sendSeen({
                    chat: chat,
                    threadId: undefined
                });
            }
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
