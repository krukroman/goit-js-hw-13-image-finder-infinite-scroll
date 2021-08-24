export default class OnTopBtn {
  constructor({ selector, hidden = false }) {
    this.selector = selector;
    this.refs = this.getRefs(this.selector);

    hidden && this.hide();
  }

  getRefs() {
    const refs = {
      button: document.querySelector(this.selector),
    };

    return refs;
  }
  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
