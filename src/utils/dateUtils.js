// import { DAYS_IN_WEEK } from "constants";
import dayjs from "dayjs";

const DAYS_IN_WEEK = 7;

const localeData = require("dayjs/plugin/localeData");
dayjs.extend(localeData);

export const getMonthYearDateText = (date) => {
  return {
    monthName: dayjs(date).format("MMMM"),
    year: dayjs(date).year(),
  };
};

export const getWeekDays = () => {
  const weekdayLongName = dayjs.weekdays();
  const weekdayShortName = dayjs.weekdaysShort();

  return weekdayLongName.map((day, index) => ({
    longName: day,
    shortName: weekdayShortName[index],
  }));
};

export const getCurrentMonthCalendarizableDays = (year, month) => {
  /*
   * A general functional approach is prefered so the function was refactored
   * to be consistent with it, since it was using different approaches at
   * different points, this benchmarks can be seen as an extra argument for
   * this because the new versions are also faster (unexpected though):
   * Ranged mapping: https://www.measurethat.net/Benchmarks/ShowResult/454245
   * Array union: https://www.measurethat.net/Benchmarks/ShowResult/454246
   */

  const baseDate = dayjs(new Date(year, month));
  // const month = Number(baseDate.format("M"));
  // const year = Number(baseDate.format("YYYY"));

  const weekdayOfFirstDayOfCurrentMonth = baseDate.startOf("month").day();

  const lastDayOfPreviousMonth = Number(
    getPreviousMonthDate(baseDate).endOf("month").format("D")
  );

  const lastMonthDays =
    weekdayOfFirstDayOfCurrentMonth > 0
      ? [...Array(weekdayOfFirstDayOfCurrentMonth)]
          .map((_, index) => ({
            isEnabled: false,
            number: lastDayOfPreviousMonth - index,
          }))
          .reverse()
      : [];

  const amountOfDays = baseDate.daysInMonth();

  const currentMonthDays = [...Array(amountOfDays).keys()].map((index) => ({
    number: index + 1,
    isEnabled: true,
    month,
    year,
  }));

  const calendarDays = [...lastMonthDays, ...currentMonthDays];

  const nextMonthAmount = DAYS_IN_WEEK - (calendarDays.length % DAYS_IN_WEEK);

  const nextMonthDays = [...Array(nextMonthAmount).keys()].map((day) => ({
    number: day + 1,
    isEnabled: false,
  }));

  return [...calendarDays, ...nextMonthDays];
};

export const getPreviousMonthDate = (date) => {
  return dayjs(date).subtract(1, "month");
};

export const getNextMonthDate = (date) => {
  return dayjs(date).add(1, "month");
};

export const getCurrentDate = () => {
  const currentDate = dayjs();
  const { monthName, year } = getMonthYearDateText(currentDate);

  return {
    date: currentDate,
    monthName,
    year,
  };
};

const DATE_REGEX = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const TIME_REGEX = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Validates whether the provided string is a valid date with format "YYYY-MM-DD".
 */
export const isDateValid = (dateStr) => {
  // Runs both regex and days because dayjs says takes "1994-10-268983" as valid.
  // Just regex should be enough though.
  if (DATE_REGEX.test(dateStr)) {
    // TODO: Think some alternative for this funkyness. DayJs is kind of bad, if
    // "2023-02-31" get's parsed, dayjs will create a date for MARCH instead of
    // FEBRUARY because of the days overflowing the end of the month, and since
    // march does have 31 days, it thinks the date is valid.

    const date = dayjs(dateStr, "YYYY-MM-DD", true);

    return dayjs(dateStr, "YYYY-MM-DD", true).isValid();
  }

  return false;
};

/**
 * Validates whether the provided string is a valid time with format "HH:mm".
 */
export const isTimeValid = (timeStr = "") => {
  // Dayjs doesn't handle time-only format parsing, so regex only is used.
  return TIME_REGEX.test(timeStr);
};
