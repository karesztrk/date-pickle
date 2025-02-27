import {
  lightFormat,
  addMonths,
  addYears,
  addDays,
  addHours,
  constructFrom,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfDay,
  setDay as fnsSetDay,
  getDate as fnsGetDate,
} from "date-fns";

/**
 * @param {Date} date
 * @param {string} format
 */
export const format = (date, format) => {
  return lightFormat(date, format);
};

/**
 * @param {Date} date
 * @param {'days' | 'month' | 'year'} type
 * @param {number} amount
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
 * @param {Date} date
 */
export const cloneDate = (date) => {
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
 * @param {Date} day
 * @param {Date | undefined} moment
 * @returns {boolean}
 */
export const isSame = (day, moment) => {
  if (!moment) {
    return false;
  }
  return isSameDay(day, moment);
};

/**
 * @param {Date} date
 * @param {'day' | 'month'} type
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
 */
export const setDay = (date, value) => {
  if (value !== "Sunday") {
    throw new Error("Not implemented");
  }
  return fnsSetDay(date, 0);
};

/**
 * @param {Date} date
 */
export const getDate = (date) => {
  return fnsGetDate(date);
};
