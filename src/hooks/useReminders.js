import { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeReminderFetchFn } from "utils/reminderUtils";

/**
 * Accesses the state and returns a reminder fetching function.
 *
 * @returns
 * A function that accepts a year, a month, a day and a time as optional
 * positional parameters and returns a map of maps, unless all parameters
 * are set, in which case it returns the specific reminder object (if any).
 *
 * The only scenario for an undefined value to be returned is when all 4
 * parameters are provided but no reminder was found.
 *
 * Note that there can be no undefined parameters between defined ones.
 */
const useReminders = () => {
  const reminders = useSelector((state) => state.calendar.reminders);
  const getReminders = makeReminderFetchFn(reminders);

  return getReminders;
};

export default useReminders;
