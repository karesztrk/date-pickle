import { html, LitElement } from "lit";

class DatePickleButton extends LitElement {
  render() {
    return html`
      <button>
        <slot />
      </button>
    `;
  }
}

customElements.define("date-pickle-button", DatePickleButton);

export default DatePickleButton;
