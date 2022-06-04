import layout from "./layout.js";
class Keyboard {
  constructor() {
    this.caps = false;
  }

  init() {
    this.container = document.createElement("div");
    this.container.setAttribute("class", "container");
    this.elements = layout.forEach((row) => {
      const keyboardRow = document.createElement("div");
      keyboardRow.setAttribute("class", "keyboard-row");
      this.container.appendChild(keyboardRow);

      row.forEach((button) => {
        const key = document.createElement("button");
        key.setAttribute(
          "class",
          `keyboard-key${button.width === undefined ? "" : " " + button.width}`
        );
        key.innerText = button.text;
        keyboardRow.appendChild(key);
      });
    });
    document.body.appendChild(this.container);
  }
}

const keyboard = new Keyboard();
keyboard.init();
