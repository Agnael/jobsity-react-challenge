/**
 * @param {object} remindersMap The central reminders nested map, as it
 * is present in redux state.
 *
 * @returns
 * A Map's mutable reference.
 *
 * If there was already a map for this day in
 * state, it returns it.
 *
 * If it's unexisting then it get's created and returned. All necessary
 * maps such as year or month maps might also get created along the way.
 */
const getOrCreateDayMap = (remindersMap, year, month, day) => {
  if (!remindersMap.has(year)) {
    remindersMap.set(year, new Map());
  }

  const yearMap = remindersMap.get(year);

  if (!yearMap.has(month)) {
    yearMap.set(month, new Map());
  }

  const monthMap = yearMap.get(month);

  if (!monthMap.has(day)) {
    monthMap.set(day, new Map());
  }

  return monthMap.get(day);
};

/**
 * @param {object} remindersMap The central reminders nested map, as it
 * is present in redux state.
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
const makeReminderFetchFn = (remindersMap) => (year, month, day, time) => {
  const hasYear = year !== undefined;
  const hasMonth = month !== undefined;
  const hasDay = day !== undefined;
  const hasTime = time !== undefined;

  // A month value of zero is valid yet falsy, so it checks for definition
  // and not for thruthiness. Does it the same way for the rest of
  // parameters, for consistency's sake.
  if (hasYear && hasMonth && hasDay && hasTime) {
    // Looking for a specific reminder
    return remindersMap.get(year)?.get(month)?.get(day)?.get(time) ?? undefined;
  } else if (hasYear && hasMonth && hasDay) {
    // All reminders within a day, indexed by their time string
    return remindersMap.get(year)?.get(month)?.get(day) ?? new Map();
  } else if (hasYear && hasMonth) {
    // All reminders within a month, indexed by their day number
    return remindersMap.get(year)?.get(month) ?? new Map();
  } else if (hasYear) {
    // All reminders within a year, indexed by their month value (0-11).
    return remindersMap.get(year) ?? new Map();
  } else {
    // Returns all reminders, indexed by their year number.
    return remindersMap;
  }
};

export { getOrCreateDayMap, makeReminderFetchFn };
