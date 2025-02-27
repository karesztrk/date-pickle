class DatePickleController {
  _selectedDate;

  _selectedEndDate;

  constructor(host) {
    this.host = host;
    host.addController(this);
    this._selectedDate = undefined;
    this._selectedEndDate = undefined;
  }

  /**
   * @type {Date | undefined}
   */
  set selectedDate(date) {
    this._selectedDate = date;
    this.host.requestUpdate();
  }

  get selectedDate() {
    return this._selectedDate;
  }

  /**
   * @type {Date | undefined}
   */
  set selectedEndDate(date) {
    this._selectedEndDate = date;
    this.host.requestUpdate();
  }

  get selectedEndDate() {
    return this._selectedEndDate;
  }
}
export default DatePickleController;
