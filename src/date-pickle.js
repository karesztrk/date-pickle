import { LitElement, html, css } from "lit";
import {
  isBetweenInclusive,
  isToday,
  isSameMonth,
  isSame,
  add,
  format,
  cloneDate,
  startOf,
  setDay,
  getDate,
} from "./date.util";
import { computePosition, offset, flip } from "@floating-ui/dom";
import { createRef, ref } from "lit/directives/ref.js";
import SelectionController from "./selection-controller";
import { classMap } from "lit/directives/class-map.js";

class DatePickle extends LitElement {
  static get styles() {
    return css`
      :host {
      }

      table {
        table-layout: fixed;
        border-collapse: separate;
        border: 0;
      }

      th,
      td {
        width: 2rem;
      }

      .date-pickle-body {
        border: 1px solid black;
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;
        background-color: white;
      }

      .heading,
      .actionbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      button {
        font: inherit;
      }

      .selected button,
      .start button,
      .end button {
        background-color: burlywood;
      }

      .range:not(.start):not(.end) button {
        background-color: hotpink;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Date },
      range: { type: Boolean },
      presets: { type: Object | undefined },
      format: { type: String },
    };
  }

  inputRef = createRef();

  bodyRef = createRef();

  controller;

  constructor() {
    super();
    this.value = undefined;
    this.open = true;
    this.displayDate = new Date();
    this.range = false;
    this.presets = undefined;
    this.format = "yyyy-MM-dd HH:mm";
    this.activeIndex = -1;
    this.controller = new SelectionController(this);
  }

  get selectedDate() {
    return this.controller.selectedDate;
  }

  get selectedEndDate() {
    return this.controller.selectedEndDate;
  }

  getForattedDate() {
    const start = this.selectedDate
      ? format(this.selectedDate, this.format)
      : "";
    return `${start}${this.range && this.selectedEndDate ? ` - ${format(this.selectedEndDate, this.format)}` : ""}`;
  }

  positionBody() {
    if (!this.inputRef.value || !this.bodyRef.value) {
      return;
    }

    computePosition(this.inputRef.value, this.bodyRef.value, {
      placement: "bottom-start",
      middleware: [offset(6), flip()],
    }).then(({ x, y }) => {
      if (!this.bodyRef.value) {
        return;
      }
      Object.assign(this.bodyRef.value.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }

  update(changedProperties) {
    super.update(changedProperties);
    this.positionBody();
  }

  getHeadingText() {
    return format(this.displayDate, "MMM yyyy");
  }

  nextYearClick() {
    this.displayDate = add(this.displayDate, "year", 1);
    this.requestUpdate();
  }

  nextMonthClick() {
    this.displayDate = add(this.displayDate, "month", 1);
    this.requestUpdate();
  }

  prevYearClick() {
    this.displayDate = add(this.displayDate, "year", -1);
    this.requestUpdate();
  }

  prevMonthClick() {
    this.displayDate = add(this.displayDate, "month", -1);
    this.requestUpdate();
  }

  renderHeader() {
    return html` <div class="heading">
      <button
        class="btn btn-icon prevYear"
        @click=${this.prevYearClick}
        aria-label="Previous year"
        type="button"
      >
        «
      </button>
      <button
        class="prevMonth btn btn-icon"
        @click=${this.prevMonthClick}
        aria-label="Previous month"
        type="button"
      >
        ‹
      </button>
      <div class="monthDisplay">${this.getHeadingText()}</div>
      <button
        class="nextMonth btn btn-icon"
        @click=${this.nextMonthClick}
        aria-label="Next month"
        type="button"
      >
        ›
      </button>
      <button
        class="nextYear btn btn-icon"
        @click=${this.nextYearClick}
        aria-label="Next year"
        type="button"
      >
        »
      </button>
    </div>`;
  }

  today() {
    const now = new Date();
    this.displayDate = now;

    if (this.range) {
      this.controller.selectRange(now, now);
    } else {
      this.controller.select(now);
    }
  }

  tomorrow() {
    const tomorrow = add(new Date(), "days", 1);
    this.displayDate = tomorrow;
    if (this.range) {
      this.controller.selectRange(tomorrow, tomorrow);
    } else {
      this.controller.select(tomorrow);
    }
  }

  clear() {
    this.controller.clear();
  }

  onChange(value) {
    if (!value || !presets) {
      return;
    }

    if (!presets[value]) {
      return;
    }

    const [start, end] = presets[value];

    this.controller.selectRange(start, end);
  }

  /**
   * @param e {Event}
   */
  onTimeChage(e) {
    const newValue = e.target?.value;
    if (!newValue) {
      return;
    }

    const [hours, minutes] = newValue.split(":").map(Number);
    this.controller.selectTime({ hours, minutes });
  }

  onEndTimeChage(e) {
    const newValue = e.target?.value;
    if (!newValue) {
      return;
    }

    const [hours, minutes] = newValue.split(":").map(Number);
    this.controller.selectEndTime({ hours, minutes });
  }

  renderPreset() {
    return html`
      <select $change=${onChange} label="Presets" placeholder="Select period">
        ${Object.entries(this.presets).map(
          ([key]) => html` <option value=${key}>${key}</option> `,
        )}
      </select>
    `;
  }

  renderActionbar() {
    return html`
      <div class="actionbar">
        ${this.presets
          ? this.renderPreset()
          : html`
              <div>
                <button @click=${this.today}>Today</button>
                <button @click=${this.tomorrow}>Tomorrow</button>
              </div>
            `}
        <button @click=${this.clear}>Clear</button>
      </div>
    `;
  }

  renderTimeRangeSelector() {
    const selectedTime = this.selectedDate
      ? format(this.selectedDate, "HH:mm")
      : "";
    const selectedEndTime = this.selectedDate
      ? format(this.selectedEndDate, "HH:mm")
      : "";
    return html`
      <div class="timeRangeSelector">
        <date-pickle-time>
          <input
            type="time"
            value=${selectedTime}
            aria-label="Start time"
            @change=${this.onTimeChage}
          />
        </date-pickle-time>
        -
        <date-pickle-time>
          <input
            type="time"
            aria-label="End time"
            value=${selectedEndTime}
            @change=${this.onEndTimeChage}
          />
        </date-pickle-time>
      </div>
    `;
  }

  renderTimeSelector() {
    const selectedTime = this.selectedDate
      ? format(this.selectedDate, "HH:mm")
      : "";
    return this.range
      ? this.renderTimeRangeSelector()
      : html`
          <date-pickle-time>
            <input
              type="time"
              aria-label="Time"
              value=${selectedTime}
              @change=${this.onTimeChage}
            />
          </date-pickle-time>
        `;
  }

  onDaySelectClick(day) {
    return () => {
      this.controller.select(day);
    };
  }

  /**
   * @param {Date} day
   * @param {number} index
   */
  renderCell(day, index) {
    const active = this.activeIndex === index;
    const disabled = !isSameMonth(day, this.displayDate);
    const start = isSame(day, this.selectedDate);
    const end = isSame(day, this.selectedEndDate);
    const selected = start || end;
    const today = isToday(day);
    const between = this.range
      ? isBetweenInclusive(day, this.selectedDate, this.selectedEndDate)
      : false;

    const classes = {
      selected,
      today,
      disabled,
      active,
      range: between,
      start: between && start,
      end: between && end,
    };
    return html` <div class=${classMap(classes)} class="calendar-date">
      <button type="button" @click=${this.onDaySelectClick(day)}>
        ${getDate(day)}
      </button>
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
          <caption id="calendar" class="visually-hidden">
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
                html`<tr role="row">
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
    return html`<div
      class="date-pickle-body"
      ${ref(this.bodyRef)}
      aria-label="Date Selector"
    >
      ${this.renderHeader()} ${this.renderCalendar()}
      ${this.renderTimeSelector()} ${this.renderActionbar()}
    </div>`;
  }

  renderInput() {
    return html`<div class="date-pickle-input">
      <input
        type="text"
        readonly
        value=${this.getForattedDate()}
        ${ref(this.inputRef)}
      />
    </div>`;
  }

  render() {
    return html` ${this.renderInput()} ${this.open ? this.renderBody() : ""} `;
  }
}

customElements.define("date-pickle", DatePickle);

export default DatePickle;
