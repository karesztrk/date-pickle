import { html, LitElement } from "lit";
import DatePickle from ".";

class DatePickleTime extends LitElement {
  render() {
    return html`
      <div class="timeSelector">
        <slot />
      </div>
    `;
  }
}

customElements.define("date-pickle-time", DatePickleTime);

export default DatePickleTime;
