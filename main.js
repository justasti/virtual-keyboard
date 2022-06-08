// eslint-disable-next-line import/extensions
import layout from './layout.js';

class Keyboard {
  constructor() {
    this.caps = false;
    this.allButtons = [];
    this.symbolButtons = [];
    this.functionButtons = [];
    this.language = localStorage.getItem('lang');
  }

  init() {
    // Create elements
    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    const inputArea = document.createElement('textarea');
    inputArea.setAttribute('class', 'input-area');
    container.appendChild(inputArea);
    const keyboard = document.createElement('div');
    keyboard.setAttribute('class', 'keyboard');

    container.appendChild(keyboard);
    document.body.appendChild(container);
    inputArea.focus();

    layout.forEach((row) => {
      const keyboardRow = document.createElement('div');
      keyboardRow.setAttribute('class', 'keyboard-row');
      keyboard.appendChild(keyboardRow);

      row.forEach((button) => {
        const key = document.createElement('button');
        key.setAttribute(
          'class',
          `keyboard-key${button.width === undefined ? '' : ` ${button.width}`}`,
        );
        key.setAttribute('id', button.key);
        if (this.language === 'en') {
          key.innerText = button.text.en;
        } else {
          key.innerText = button.text.lt;
        }
        keyboardRow.appendChild(key);
        this.allButtons.push(button);
      });
    });
    this.listenInput();
  }

  listenInput() {
    document.querySelector('.input-area').addEventListener('blur', () => document.querySelector('.input-area').focus());

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      this.selectAction(e);
      const key = document.getElementById(e.code);
      key.classList.toggle('active');
      if (e.shiftKey && e.altKey) {
        this.language = this.language === 'en' ? 'lt' : 'en';
        localStorage.setItem('lang', this.language);
        this.allButtons.forEach((button) => {
          document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.lt : button.text.en;
        });
      }
      if (e.shiftKey) {
        this.allButtons.forEach((button) => {
          document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.ltSpecial : button.text.enSpecial;
        });
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
        document.querySelector('.input-area').focus();
      }
      const key = document.getElementById(e.code);
      key.classList.toggle('active');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.allButtons.forEach((pressedButton) => {
          document.getElementById(pressedButton.key).innerText = this.language === 'lt' ? pressedButton.text.lt : pressedButton.text.en;
        });
      }
    });
    document.querySelectorAll('.keyboard-key').forEach((key) => {
      key.addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        setTimeout(() => {
          e.target.classList.toggle('active');
        }, 100);
        this.selectAction(e);
      });
    });
  }

  selectAction(e) {
    let keyValue = '';
    let keyCode = '';
    if (Object.getPrototypeOf(e).constructor.name === 'KeyboardEvent') {
      keyValue = e.key;
      keyCode = e.code;
    } else {
      keyValue = e.target.textContent;
      keyCode = e.target.id;
    }

    const inputArea = document.querySelector('.input-area');
    const textIsHighlighted = inputArea.selectionStart !== inputArea.selectionEnd;
    const clickedButton = this.allButtons.find((button) => button.key === keyCode);
    let cursorAt = inputArea.selectionStart;

    if (clickedButton.type === 'symbol') {
      if (inputArea.textContent.length === inputArea.selectionEnd && !textIsHighlighted) {
        inputArea.textContent += keyValue;
        inputArea.selectionStart = inputArea.textContent.length;
      } else if (inputArea.textContent.length !== inputArea.selectionEnd && !textIsHighlighted) {
        inputArea.textContent = inputArea.textContent
          .slice(0, cursorAt) + keyValue + inputArea.textContent
          .slice(cursorAt);
        cursorAt += 1;
        inputArea.selectionStart = cursorAt;
      } else if (textIsHighlighted) {
        cursorAt = inputArea.selectionStart + 1;
        inputArea.textContent = inputArea.textContent
          .slice(0, inputArea.selectionStart) + keyValue
          + inputArea.textContent.slice(inputArea.selectionEnd);
        inputArea.selectionStart = cursorAt;
      }
    } else {
      switch (keyCode) {
        case 'CapsLock':
          this.caps = !this.caps;
          break;
        case 'Backspace':
          if (inputArea.textContent.length === inputArea.selectionEnd
            && !textIsHighlighted && cursorAt !== 0) {
            inputArea.textContent = inputArea.textContent.slice(0, -1);
            inputArea.selectionStart = inputArea.textContent.length;
          } else if (inputArea.textContent.length !== inputArea.selectionEnd
            && !textIsHighlighted && cursorAt !== 0) {
            inputArea.textContent = inputArea.textContent
              .slice(0, cursorAt - 1) + inputArea.textContent.slice(cursorAt);
            cursorAt -= 1;
            inputArea.selectionStart = cursorAt;
          } else if (textIsHighlighted) {
            cursorAt = inputArea.selectionStart + 1;
            inputArea.textContent = inputArea.textContent
              .slice(0, inputArea.selectionStart)
              + inputArea.textContent.slice(inputArea.selectionEnd);
            inputArea.selectionStart = cursorAt - 1;
          }
          break;
        case 'Delete':
          if (inputArea.selectionEnd !== inputArea.textContent.length
            && !textIsHighlighted) {
            inputArea.textContent = inputArea.textContent.slice(0, inputArea.selectionStart)
              + inputArea.textContent.slice(inputArea.selectionEnd + 1);
            inputArea.selectionStart = cursorAt;
          } else if (textIsHighlighted) {
            inputArea.textContent = inputArea.textContent.slice(0, inputArea.selectionStart)
              + inputArea.textContent.slice(inputArea.selectionEnd);
            inputArea.selectionStart = cursorAt;
          }
          break;
        default:
          break;
      }
    }
  }
}

const keyboard = new Keyboard();
keyboard.init();
