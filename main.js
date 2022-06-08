// eslint-disable-next-line import/extensions
import layout from './layout.js';

class Keyboard {
  constructor() {
    this.caps = false;
    this.shift = false;
    this.allButtons = [];
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
    const notifier = document.createElement('p');
    notifier.textContent = 'To change input language press Shift + Alt';

    container.appendChild(keyboard);
    container.appendChild(notifier);
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
      if (this.allButtons.some((el) => el.key === e.code)) {
        e.preventDefault();
        this.selectAction(e);
        const key = document.getElementById(e.code);
        if (e.code !== 'CapsLock') {
          key.classList.toggle('active');
        }
        if (e.shiftKey && e.altKey) {
          this.language = this.language === 'en' ? 'lt' : 'en';
          localStorage.setItem('lang', this.language);
          this.allButtons.forEach((button) => {
            document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.lt : button.text.en;
          });
        }
        if (e.code === 'CapsLock') {
          this.toggleCaps();
        }
        if (e.shiftKey) {
          this.toggleShift();
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        e.preventDefault();
        document.querySelector('.input-area').focus();
      }
      const key = document.getElementById(e.code);
      if (e.code !== 'CapsLock') {
        key.classList.toggle('active');
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.allButtons.forEach((pressedButton) => {
          document.getElementById(pressedButton.key).innerText = this.language === 'lt' ? pressedButton.text.lt : pressedButton.text.en;
        });
      }
    });
    document.querySelectorAll('.keyboard-key').forEach((key) => {
      key.addEventListener('mousedown', (e) => {
        if (e.target.id === 'CapsLock') {
          this.caps = !this.caps;
          this.toggleCaps();
        } else if (e.target.id === 'ShiftLeft' || e.target.id === 'ShiftRight') {
          this.toggleShift();
        } else {
          e.target.classList.toggle('active');
          setTimeout(() => {
            e.target.classList.toggle('active');
          }, 100);
          this.selectAction(e);
        }
      });
    });
  }

  toggleShift() {
    this.shift = !this.shift;
    this.allButtons.forEach((button) => {
      if (this.shift) {
        document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.ltSpecial
          : button.text.enSpecial;
      } else {
        document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.lt
          : button.text.en;
      }
    });
  }

  toggleCaps() {
    this.allButtons.forEach((button) => {
      if (this.caps) {
        document.getElementById('CapsLock').classList.add('active');
        document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.ltCapital : button.text.enCapital;
      } else {
        document.getElementById('CapsLock').classList.remove('active');
        document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.lt : button.text.en;
      }
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
        case 'ArrowUp':
          inputArea.selectionStart = 0;
          inputArea.selectionEnd = 0;
          break;
        case 'ArrowDown':
          inputArea.selectionStart = inputArea.textContent.length;
          inputArea.selectionEnd = inputArea.textContent.length;
          break;
        case 'ArrowLeft':
          if (cursorAt !== 0) {
            inputArea.selectionStart = cursorAt - 1;
            inputArea.selectionEnd = cursorAt - 1;
          }
          break;
        case 'ArrowRight':
          if (cursorAt !== inputArea.textContent.length) {
            inputArea.selectionStart = cursorAt + 1;
            inputArea.selectionEnd = cursorAt + 1;
          }
          break;
        case 'Enter':
          inputArea.textContent = `${inputArea.textContent.slice(0, inputArea.selectionStart)}\n${
            inputArea.textContent.slice(inputArea.selectionEnd)}`;
          inputArea.selectionStart = cursorAt + 1;
          inputArea.selectionEnd = cursorAt + 1;
          break;
        case 'Tab':
          inputArea.textContent = `${inputArea.textContent.slice(0, inputArea.selectionStart)}    ${
            inputArea.textContent.slice(inputArea.selectionEnd)}`;
          inputArea.selectionStart = cursorAt + 4;
          inputArea.selectionEnd = cursorAt + 4;
          break;
        default:
          break;
      }
    }
  }
}

const keyboard = new Keyboard();
keyboard.init();
