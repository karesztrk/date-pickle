import {
  parse,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  isValid,
  sortedDates,
  cloneDate,
} from "./date.util";

/**
 * @typedef Range
 * @property {Date} from
 * @property {Date} to
 */

/**
 * @typedef Time
 * @property {number} hours
 * @property {number} minutes
 */

/**
 * Controls the date selection.
 */
class SelectionController {
  /** @type {Array<Date>} */
  #selectedDates;

  /** @type {Date | undefined} */
  parsedValue;

  constructor(host) {
    this.host = host;
    host.addController(this);
    this.#selectedDates = [];
  }

  /**
   * @param {string | Range} value
   * @param {string} format
   */
  parseValue(value) {
    if (!value) {
      return;
    }

    if (typeof value === "object") {
      this.parsedValue = value?.from;
    } else {
      this.parsedValue = parse(value, this.host.format);
    }

    /** @type {Array<Date>} */
    const result = [];
    // Set from date ...
    if (isValid(this.parsedValue)) {
      result.push(parsedValue);
    }
    // ... set end date
    if (this.host.range && value && "to" in value && value.to.isValid()) {
      result.push(value.to);
    }

    this.#selectedDates = result;

    this.host.requestUpdate();
  }

  /**
   * @param {Date} newDate
   */
  select(newDate) {
    if (!this.host.range || this.#selectedDates.length === 2) {
      this.selectRange(newDate);
    } else if (this.host.range && this.#selectedDates.length < 2) {
      const newRange = [...this.#selectedDates, newDate].sort(sortedDates);
      this.selectRange(newRange[0], newRange[this.endIndex]);
    }
  }

  /**
   * @param {Date | undefined} start
   * @param {Date | undefined} end
   */
  selectRange(start, end) {
    let newStart = cloneDate(start);
    if (newStart && this.selectedDate) {
      newStart = setHours(newStart, getHours(this.selectedDate));
      newStart = setMinutes(newStart, getMinutes(this.selectedDate));
    }
    let newEnd = cloneDate(end);
    if (newEnd && this.selectedEndDate) {
      newEnd = setHours(newEnd, getHours(this.selectedEndDate));
      newEnd = setMinutes(newEnd, getMinutes(this.selectedEndDate));
    }

    const updated = [];
    if (newStart) {
      updated[0] = newStart;
      if (newEnd) {
        updated[this.endIndex] = newEnd;
      }
    }
    this.#selectedDates = updated;

    if (this.host.range && newStart && newEnd) {
      this.propagateInputValue(newStart, newEnd);
    } else if (!this.host.range && newStart) {
      this.propagateInputValue(newStart, undefined);
    }
  }

  /**
   * @type {Time} value
   */
  selectTime(value) {
    const { hours = 0, minutes = 0 } = value;
    let newValue = cloneDate(this.selectedDate) ?? startOf(new Date(), "day");
    if (!Number.isNaN(hours)) {
      newValue = setHours(newValue, hours);
    }
    if (!Number.isNaN(minutes)) {
      newValue = setMinutes(newValue, minutes);
    }
    const updated = [...this.#selectedDates];
    updated[0] = newValue;
    this.#selectedDates = updated;
    this.propagateInputValue(newValue, this.selectedEndDate);
  }

  /**
   * @type {Time} value
   */
  selectEndTime(value) {
    const { hours = 0, minutes = 0 } = value;
    let newValue =
      cloneDate(this.selectedEndDate) ??
      parse(this.selectedDate, this.host.format);
    if (!Number.isNaN(hours)) {
      newValue = setHours(newValue, hours);
    }
    if (!Number.isNaN(minutes)) {
      newValue = setMinutes(newValue, minutes);
    }

    const updated = [...this.#selectedDates];
    updated[this.endIndex] = newValue;
    this.#selectedDates = updated;
    this.propagateInputValue(this.selectedDate, newValue);
  }

  clear() {
    this.#selectedDates = [];
    this.propagateInputValue(undefined);
  }

  /**
   * @type {Date | undefined} value
   * @type {Date | undefined} end
   */
  propagateInputValue(value, end) {
    this.host.requestUpdate();
    if (this.host.range) {
      // const { onChange } = props as Props<true>;
      if (value && end) {
        // onChange?.({
        //     from: value,
        //     to: end,
        // });
      } else {
        // onchange?.(undefined);
      }
      return;
    }

    // const { onchange } = props as props<false>;
    // const formatteddate = value ? datetimeservice.format(value) : "";
    // onchange?.(formatteddate);
  }

  /**
   * @type {Date | undefined}
   */
  set selectedDate(date) {
    this.#selectedDates.push(date);
    this.host.requestUpdate();
  }

  get selectedDate() {
    const [selectedDate] = this.#selectedDates;
    return selectedDate;
  }

  /**
   * @type {Date | undefined}
   */
  set selectedEndDate(date) {
    this.#selectedDates.push(date);
    this.host.requestUpdate();
  }

  get selectedEndDate() {
    const selectedEndDate = this.#selectedDates[this.endIndex];
    return selectedEndDate;
  }

  get endIndex() {
    return this.host.range ? Math.max(this.#selectedDates.length - 1, 1) : 0;
  }
}
export default SelectionController;
