import {
  isToday as fnsIsToday,
  differenceInMilliseconds,
  isValid as fnsIsValid,
  lightFormat,
  addMonths,
  addYears,
  addDays,
  addHours,
  constructFrom,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth as fnsIsSameMonth,
  startOfMonth,
  startOfDay,
  setDay as fnsSetDay,
  getDate as fnsGetDate,
  parse as fnsParse,
  getHours as fnsGetHours,
  setHours as fnsSetHours,
  getMinutes as fnsGetMinutes,
  setMinutes as fnsSetMinutes,
} from "date-fns";

/**
 * @param {Date} date
 * @param {string} format
 * @returns {string}
 */
export const format = (date, format) => {
  return lightFormat(date, format);
};

/**
 * @param {Date} date
 * @param {'days' | 'month' | 'year'} type
 * @param {number} amount
 * @returns {Date}
 */
export const add = (date, type, amount) => {
  switch (type) {
    case "year":
      return addYears(date, amount);
    case "month":
      return addMonths(date, amount);
    case "days":
      return addDays(date, amount);
    case "hour":
      return addHours(date, amount);
    default:
      throw new Error("Not implemented");
  }
};

/**
 * @param {Date| undefined} date
 * @returns {Date | undefined}
 */
export const cloneDate = (date) => {
  if (!date) {
    return undefined;
  }
  return constructFrom(date, date.getTime());
};

/**
 * @param {Date} selected
 * @param {Date|undefined} start
 * @param {Date|undefined} end
 * @returns {boolean}
 */
export const isBetweenInclusive = (selected, start, end) => {
  if (!start || !end) {
    return false;
  }
  if (isSameDay(selected, start) || isSameDay(selected, end)) {
    return true;
  }
  return isBefore(selected, end) && isAfter(selected, start);
};

/**
 * @param {Date} left
 * @param {Date | undefined} right
 * @returns {boolean}
 */
export const isSame = (left, right) => {
  if (!right) {
    return false;
  }
  return isSameDay(left, right);
};

/**
 * @param {Date} left
 * @param {Date | undefined} right
 * @returns {boolean}
 */
export const isSameMonth = (left, right) => {
  if (!right) {
    return false;
  }
  return fnsIsSameMonth(left, right);
};

/**
 * @param {Date} date
 * @param {'day' | 'month'} type
 * @returns {Date}
 */
export const startOf = (date, type) => {
  switch (type) {
    case "month":
      return startOfMonth(date, type);
    case "day":
      return startOfDay(date, type);
    default:
      throw new Error("Not implemented");
  }
};

/**
 * @param {Date} date
 * @param {'Sunday'} value
 * @returns {Date}
 */
export const setDay = (date, value) => {
  if (value !== "Sunday") {
    throw new Error("Not implemented");
  }
  return fnsSetDay(date, 0);
};

/**
 * @param {Date} date
 * @returns {number}
 */
export const getDate = (date) => {
  return fnsGetDate(date);
};

/**
 * @param {string} date
 * @param {string} format
 * @returns {Date}
 */
export const parse = (date, format) => {
  return fnsParse(date, format);
};

/**
 * @param {unknown} date
 * @returns {boolean}
 */
export const isValid = (date) => {
  if (!date) {
    return false;
  }
  return fnsIsValid(date);
};

/**
 * @type {(left: Date, right: Date) => number}
 * @returns {number}
 */
export const sortedDates = (left, right) =>
  differenceInMilliseconds(left, right);

/**
 * @param {Date} date
 * @param {number} amount
 * @returns {Date}
 */
export const setHours = (date, amount) => {
  if (!date) {
    return date;
  }
  return fnsSetHours(date, amount);
};

/**
 * @param {Date} date
 * @param {number} amount
 * @returns {Date}
 */
export const setMinutes = (date, amount) => {
  if (!date) {
    return date;
  }
  return fnsSetMinutes(date, amount);
};

/**
 * @param {Date} date
 * @returns {number}
 */
export const getHours = (date) => {
  return fnsGetHours(date);
};

/**
 * @param {Date} date
 * @returns {number}
 */
export const getMinutes = (date) => {
  return fnsGetMinutes(date);
};

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isToday = (date) => {
  return fnsIsToday(date);
};
