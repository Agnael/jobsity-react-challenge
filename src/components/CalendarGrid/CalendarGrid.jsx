import React from "react";

import { Grid } from "@material-ui/core";
import { CalendarHeader, CalendarDay } from "components";
import PropTypes from "prop-types";
import { getCurrentMonthCalendarizableDays } from "utils/dateUtils";

import { getRowHeightFromCurrentMonth } from "./helpers";

const CalendarGrid = ({ date = new Date() }) => {
  const calendarDays = getCurrentMonthCalendarizableDays(date);
  const gridRowHeight = getRowHeightFromCurrentMonth(calendarDays?.length);

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0}
    >
      <CalendarHeader />
      {calendarDays?.map((day) => (
        <CalendarDay
          key={`${day.number}.${day.month}.${day.year}`}
          day={day.number}
          month={day.month}
          year={day.year}
          isEnabled={day.isEnabled}
          height={gridRowHeight}
        />
      ))}
    </Grid>
  );
};

CalendarGrid.propTypes = {
  date: PropTypes.instanceOf(Object).isRequired,
};

export default CalendarGrid;
