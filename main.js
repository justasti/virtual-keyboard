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
      this.allButtons.forEach((button) => {
        if (button.key === e.code) {
          const key = document.getElementById(e.code);
          key.classList.toggle('active');
        }
      });
      if (e.shiftKey && e.altKey) {
        this.language = this.language === 'en' ? 'lt' : 'en';
        localStorage.setItem('lang', this.language);
        this.allButtons.forEach((button) => {
          document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.lt : button.text.en;
        });
      }
      if (e.shiftKey) {
        this.allButtons.forEach((button) => {
          document.getElementById(button.key).innerText = this.language === 'lt' ? button.text.ltCapital : button.text.enCapital;
        });
      }
    });
    document.addEventListener('keyup', (e) => {
      this.allButtons.forEach((button) => {
        if (button.key === e.code) {
          const key = document.getElementById(e.code);
          key.classList.toggle('active');
        }
      });
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
      });
    });
  }
}

const keyboard = new Keyboard();
keyboard.init();
