import { LitElement, html, css } from "lit";
import { add, format, cloneDate, startOf, setDay, getDate } from "./date.util";

class DatePickle extends LitElement {
  static get styles() {
    return css`
      :host {
      }

      .date-pickle-body {
        border: 1px solid black;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
      open: { type: Boolean },
      displayDate: { type: Date },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.displayDate = new Date();
  }

  getHeadingText() {
    return format(this.displayDate, "MMM yyyy");
  }

  nextYearClick() {
    this.displayDate = add(this.displayDate, "year", 1);
  }

  nextMonthClick() {
    this.displayDate = add(this.displayDate, "month", 1);
  }

  prevYearClick() {
    this.displayDate = add(this.displayDate, "year", -1);
  }

  prevMonthClick() {
    this.displayDate = add(this.displayDate, "month", -1);
  }

  renderHeader() {
    return html` <div class="heading">
      <button
        class="btn btn-icon prevYear"
        @click=${this.prevYearClick}
        aria-label="Previous year"
        type="button"
      >
        Prev year
      </button>
      <button
        class="prevMonth btn btn-icon"
        @click=${this.prevMonthClick}
        aria-label="Previous month"
        type="button"
      >
        Prev month
      </button>
      <div class="monthDisplay">${this.getHeadingText()}</div>
      <button
        class="nextMonth btn btn-icon"
        @click=${this.nextMonthClick}
        aria-label="Next month"
        type="button"
      >
        Next month
      </button>
      <button
        class="nextYear btn btn-icon"
        @click=${this.nextYearClick}
        aria-label="Next year"
        type="button"
      >
        Next year
      </button>
    </div>`;
  }

  renderCell(day, index) {
    return html` <div class="calendar-date">
      <button type="button">${getDate(day)}</button>
    </div>`;
  }

  renderCalendar() {
    const n = setDay(startOf(cloneDate(this.displayDate), "month"), "Sunday");
    const weeks = [[], [], [], [], []];
    let d = cloneDate(n);
    for (let i = 0; i < 35; i++) {
      d = cloneDate(n);
      const arrayIndex = Math.floor(i / 7);
      d = add(d, "days", i);
      weeks[arrayIndex].push(d);
    }

    return html`
      <div class="calendar">
        <table role="grid" aria-labelledby="calendar">
          <caption id="calendar" class="cxn-visually-hidden">
            Calendar
          </caption>
          <thead role="presentation">
            <tr>
              <th abbr="Sunday" scope="col">Su</th>
              <th abbr="Monday" scope="col">Mo</th>
              <th abbr="Tuesday" scope="col">Tu</th>
              <th abbr="Wednesday" scope="col">We</th>
              <th abbr="Thursday" scope="col">Th</th>
              <th abbr="Friday" scope="col">F</th>
              <th abbr="Saturday" scope="col">Sa</th>
            </tr>
          </thead>
          <tbody role="presentation">
            ${weeks.map(
              (week, weekIndex) =>
                html`<tr key="{weekIndex}" role="row">
                  ${week.map((day, dayIndex) => {
                    const index = weekIndex * 7 + dayIndex;
                    return html`<td role="gridcell">
                      ${this.renderCell(day, index)}
                    </td>`;
                  })}
                </tr>`,
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  renderBody() {
    return html`<div class="date-pickle-body">
      ${this.renderHeader()} ${this.renderCalendar()}
    </div>`;
  }

  renderInput() {
    return html`<div class="date-pickle-input">
      <input type="text" />
    </div>`;
  }

  render() {
    return html` ${this.renderBody()} ${this.renderInput()} `;
  }
}

customElements.define("date-pickle", DatePickle);

export default DatePickle;
