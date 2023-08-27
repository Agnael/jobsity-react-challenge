import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Calendar from "./Calendar";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import reducers from "store/reducers";
import getStore from "store/getStore";

test("Calendar page can create reminder", async () => {
  const today = new Date();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const todayYearStr = String(today.getFullYear());
  const todayMonthStr = String(today.getMonth() + 1).padStart(2, "0");
  const todayDayStr = String(today.getDate()).padStart(2, "0");

  // Reminder time to create
  const REMINDER_TIME = "23:45";
  const REMINDER_MESSAGE = "Test message";

  render(
    <ReduxProvider store={getStore(reducers)}>
      <Calendar />
    </ReduxProvider>
  );

  // There should be no dialog on load
  expect(screen.queryByTestId("reminder-form-dialog")).toBeNull();

  // Clicks on today's date box
  const todayCalendarBox = screen.getByTestId(
    `calendar-day-${todayYear}-${todayMonth}-${todayDay}`
  );

  expect(todayCalendarBox).toBeInTheDocument();
  expect(todayCalendarBox).toHaveTextContent(todayDay);

  // The event we'll create shouldn't exist yet
  expect(
    within(todayCalendarBox).queryByTestId(`reminder-${REMINDER_TIME}`)
  ).toBeNull();

  fireEvent.click(todayCalendarBox);

  // The form dialog should be visible now
  const reminderFormDialog = screen.getByTestId("reminder-form-dialog");
  expect(reminderFormDialog).toBeInTheDocument();

  // Uses the default date (today)
  const dateInput = within(reminderFormDialog).getByTestId("txt-date");
  expect(dateInput).toBeInTheDocument();
  expect(dateInput).toHaveValue(
    `${todayYearStr}-${todayMonthStr}-${todayDayStr}`
  );

  // Sets our custom time
  const timeInput = within(reminderFormDialog).getByTestId("txt-time");
  expect(timeInput).toBeInTheDocument();
  fireEvent.change(timeInput, { target: { value: REMINDER_TIME } });
  expect(timeInput).toHaveValue(REMINDER_TIME);

  // Fills our reminder message in
  const messageInput = within(reminderFormDialog).getByTestId("txt-message");
  expect(messageInput).toBeInTheDocument();
  fireEvent.change(messageInput, { target: { value: REMINDER_MESSAGE } });
  expect(messageInput).toHaveValue(REMINDER_MESSAGE);

  // Looks for a location
  const locationInput = within(reminderFormDialog).getByTestId("cmb-location");
  expect(locationInput).toBeInTheDocument();
  fireEvent.change(locationInput, { target: { value: "new york" } });
  expect(locationInput).toHaveValue("new york");

  // The location search box should be visible
  const locationResultBox = screen.getByTestId("location-picker-result-box");
  expect(locationResultBox).toBeInTheDocument();

  // I don't have to mock responses and whatnot, this is actually executing an
  // API request to GeoCode and getting real results.
  await waitFor(() =>
    expect(
      within(locationResultBox).getByTestId("result-option-0")
    ).toBeInTheDocument()
  );

  // Clicks on the first option found
  const firstLocationOption =
    within(locationResultBox).getByTestId("result-option-0");
  fireEvent.click(firstLocationOption);
  expect(locationInput).toHaveValue("New York, United States");

  // Submits the new reminder
  const submitBtn = within(reminderFormDialog).getByTestId("btn-submit");
  fireEvent.click(submitBtn);

  // The dialog should be gone
  expect(screen.queryByTestId("reminder-form-dialog")).toBeNull();

  // The reminder should exist now
  const createdReminder = within(todayCalendarBox).getByTestId(
    `reminder-${REMINDER_TIME}`
  );
  expect(createdReminder).toBeInTheDocument();

  expect(within(createdReminder).getByTestId("time")).toHaveTextContent(
    REMINDER_TIME
  );

  expect(within(createdReminder).getByTestId("message")).toHaveTextContent(
    REMINDER_MESSAGE
  );
});
