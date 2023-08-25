import { DAYS_IN_WEEK } from "constants";
import dayjs from "dayjs";

const localeData = require("dayjs/plugin/localeData");
dayjs.extend(localeData);

export const getMonthYearDateText = (date) => {
  return {
    month: dayjs(date).format("MMMM"),
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

export const getCurrentMonthCalendarizableDays = (date) => {
  /*
   * A general functional approach is prefered so the function was refactored
   * to be consistent with it, since it was using different approaches at
   * different points, this benchmarks can be seen as an extra argument for
   * this, since the new versions are also faster (unexpected in some cases):
   * Ranged mapping: https://www.measurethat.net/Benchmarks/ShowResult/454245
   * Array union: https://www.measurethat.net/Benchmarks/ShowResult/454246
   */

  const baseDate = dayjs(date);
  const month = Number(baseDate.format("M"));
  const year = Number(baseDate.format("YYYY"));

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
  const { month, year } = getMonthYearDateText(currentDate);

  return {
    date: currentDate,
    month,
    year,
  };
};
