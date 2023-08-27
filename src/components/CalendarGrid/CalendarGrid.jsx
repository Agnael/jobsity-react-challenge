import React, { useMemo, useState } from "react";
import { Grid } from "@material-ui/core";
import { CalendarHeader, CalendarDay } from "components";
import PropTypes from "prop-types";
import { getCurrentMonthCalendarizableDays } from "utils/dateUtils";
import { getRowHeightFromCurrentMonth } from "./helpers";
import ReminderFormDialog from "components/ReminderFormDialog";
import useReminders from "hooks/useReminders";

const CalendarGrid = ({ year, month, today }) => {
  const [reminderFormMode, setReminderFormMode] = useState(undefined);
  const [reminderFormTarget, setReminderFormTarget] = useState(undefined);

  const [calendarDayRows, gridRowHeight] = useMemo(() => {
    const calendarDays = getCurrentMonthCalendarizableDays(year, month);
    const gridRowHeight = getRowHeightFromCurrentMonth(calendarDays?.length);

    // We're guaranteed to receive a list of days with a lenght that's
    // multiple of 7
    let calendarDayRows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarDayRows.push(calendarDays.slice(i, i + 7));
    }

    return [calendarDayRows, gridRowHeight];
  }, [year, month]);

  const getReminders = useReminders();
  const monthEventMap = getReminders(year, month);

  const handleDayClick = (year, month, day) => (e) => {
    setReminderFormMode("create");
    setReminderFormTarget({ year, month, day });
  };

  const handleReminderFormClose = (reason) => {
    setReminderFormMode(undefined);
    setReminderFormTarget(undefined);
  };

  const handleReminderClick = (day) => (e, time) => {
    e.stopPropagation();

    setReminderFormMode("update");
    setReminderFormTarget({ year, month, day: day.number, time });
  };

  return (
    <Grid container direction="column" spacing={0}>
      <Grid item>
        <CalendarHeader />
      </Grid>

      <Grid item>
        <Grid container direction="column">
          {calendarDayRows.map((rowDays, idx) => (
            <Grid item xs key={`${rowDays[0].number}-${rowDays[6].number}`}>
              <Grid container>
                {rowDays.map((day) => (
                  <Grid item xs key={`${day.number}.${day.month}.${day.year}`}>
                    <CalendarDay
                      day={day.number}
                      month={day.month}
                      year={day.year}
                      isEnabled={day.isEnabled}
                      height={gridRowHeight}
                      onClick={
                        day.isEnabled
                          ? handleDayClick(day.year, day.month, day.number)
                          : undefined
                      }
                      onReminderClick={handleReminderClick(day)}
                      reminders={
                        month === day.month && year === day.year
                          ? monthEventMap?.get(day.number)
                          : new Map()
                      }
                      active={
                        today &&
                        today.getMonth() === day.month &&
                        today.getDate() === day.number &&
                        today.getFullYear() === day.year
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Because of the same model being used for more than a single "mode", it
      avoids some headaches to destroy it when not needed. */}
      {reminderFormMode && reminderFormTarget && (
        <ReminderFormDialog
          open={true}
          mode={reminderFormMode}
          target={reminderFormTarget}
          onClose={handleReminderFormClose}
        />
      )}
    </Grid>
  );
};

CalendarGrid.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  today: PropTypes.object,
};

export default CalendarGrid;
