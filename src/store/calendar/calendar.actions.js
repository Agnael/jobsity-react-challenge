export const calendarActionTypes = {
  // OPEN_CREATION_FORM: "calendar/openCreationForm",
  // OPEN_UPDATE_FORM: "calendar/openUpdateForm",
  // OPEN_DETAIL: "calendar/openDetail",
  // CLOSE_FORM
  ADD_REMINDER: "calendar/addReminder",
  UPDATE_REMINDER: "calendar/updateReminder",
  DELETE_REMINDER: "calendar/deleteReminder",
};

export const calendarActions = {
  /**
   * Adds a new reminder.
   * @param {number} year Full year number. e.g.: 1994
   * @param {number} month Month index within the year (0 - 11)
   * @param {number} day Day of the month (1 - 31);
   * @param {string} time Time of the day in 'HH:mm' format. e.g.: '02:40'.
   * @param {*} location LocationPicker-created location object.
   * @param {string} text Message for the reminder.
   */
  addReminder: (year, month, day, time, location, text) => ({
    type: calendarActionTypes.ADD_REMINDER,
    payload: { year, month, day, time, location, text },
  }),
  /**
   * Updates an existing reminder.
   * @param {object} originalTarget An identifier object for the ORIGINAL
   * reminder. i.e.: { year, month, day, time }.
   * @param {object} newTarget An identifier object for the NEW
   * reminder. i.e.: { year, month, day, time }.
   * @param {*} newLocation LocationPicker-created location object.
   * @param {string} newText Message for the reminder.
   */
  updateReminder: (originalTarget, newTarget, newLocation, newText) => ({
    type: calendarActionTypes.UPDATE_REMINDER,
    payload: {
      originalTarget,
      newTarget,
      newLocation,
      newText,
    },
  }),
  /**
   * Deletes an existing reminder.
   */
  deleteReminder: (year, month, day, time) => ({
    type: calendarActionTypes.DELETE_REMINDER,
    payload: { year, month, day, time },
  }),
};
