// Minimal DOM mock for Node.js testing
// Provides document.getElementById and document.querySelectorAll
// so the calculator's press/update functions can be tested

if (typeof globalThis.document === 'undefined') {
  const elementMap = new Map();

  class MockElement {
    constructor(id) {
      this.id = id;
      this.textContent = '';
      this.innerHTML = '';
      this.classList = new Set(['mode-tab']);
      this.dataset = { mode: 'basic' };
      this._children = [];
      this._style = {};
      this._parentNode = null;
    }

    toggle(className, force) {
      if (force !== undefined) {
        if (force) this.classList.add(className);
        else this.classList.delete(className);
      } else {
        if (this.classList.has(className)) this.classList.delete(className);
        else this.classList.add(className);
      }
    }

    addEventListener(type, handler) {
      this['_on' + type] = handler;
    }

    appendChild(child) {
      this._children.push(child);
      child._parentNode = this;
    }

    get style() { return this._style; }
    get parentNode() { return this._parentNode; }
    get children() { return this._children; }
  }

  const mockDoc = {
    getElementById: (id) => {
      if (!elementMap.has(id)) {
        const el = new MockElement(id);
        elementMap.set(id, el);
      }
      return elementMap.get(id);
    },
    querySelectorAll: (sel) => {
      // Return a minimal array-like with forEach
      const arr = [];
      arr.forEach = Array.prototype.forEach.bind(arr);
      arr.length = 0;
      return arr;
    },
    addEventListener: (type, handler) => {
      // noop for event registration in test env
    }
  };

  Object.defineProperty(globalThis, 'document', { value: mockDoc, writable: false });
}

export function resetDOM() {
  // Reset all mock element content
}
