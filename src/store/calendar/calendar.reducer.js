import { calendarActionTypes } from "./calendar.actions";
import initialState from "./calendar.state";
import { getOrCreateDayMap, makeReminderFetchFn } from "utils/reminderUtils";

const calendarReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case calendarActionTypes.ADD_REMINDER: {
      const { year, month, day, time, text, location } = payload;

      const dayMap = getOrCreateDayMap(state.reminders, year, month, day);

      // Since this is a reminder creation process, overriding existing
      // entries is avoided. This should've been validated beforehand so
      // no application errors are raised at this point.
      if (dayMap.has(time)) {
        console.error(
          `Can't create a new reminder for "${year}-${month}-${day} ${time}",
          that would override an existing entry.`
        );
      }

      dayMap.set(time, { text, location });

      return {
        ...state,
        reminders: state.reminders,
      };
    }
    case calendarActionTypes.UPDATE_REMINDER: {
      const { originalTarget, newTarget, newLocation, newText } = payload;

      // For simplicity's sake, ALWAYS deletes the previous entry and creates
      // a new one. This spares the system of having to act differently based
      // on whether the original and new dates and times are diferent or not.
      const originalDayMap = getOrCreateDayMap(
        state.reminders,
        originalTarget.year,
        originalTarget.month,
        originalTarget.day
      );

      originalDayMap.delete(originalTarget.time);

      const newDayMap = getOrCreateDayMap(
        state.reminders,
        newTarget.year,
        newTarget.month,
        newTarget.day
      );

      newDayMap.set(newTarget.time, { text: newText, location: newLocation });

      return {
        ...state,
        reminders: state.reminders,
      };
    }
    case calendarActionTypes.DELETE_REMINDER: {
      const { year, month, day, time } = payload;

      const dayMap = getOrCreateDayMap(state.reminders, year, month, day);
      dayMap.delete(time);

      return {
        ...state,
        reminders: state.reminders,
      };
    }
    default:
      return state;
  }
};

export default calendarReducer;
