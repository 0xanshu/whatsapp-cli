import { type CliRenderer, InputRenderable } from "@opentui/core";

export async function convoInput(renderer: CliRenderer) {
  const input = new InputRenderable(renderer, {
    id: "convoInput",
    width: "100%",
    marginLeft: 5,
    marginBottom: 1,
    placeholder: "Enter your message..",
  });

  return input;
}
