import React from "react";

import { Card, Grid } from "@material-ui/core";
import { getWeekDays } from "utils/dateUtils";

const CalendarHeader = () => {
  return (
    <Grid container>
      {getWeekDays().map((day) => (
        <Grid item xs key={day.longName}>
          <Card variant="outlined" className="calendar-header-card">
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              alignContent="center"
            >
              <Grid item className="calendar-header-text--large">
                {day.longName}
              </Grid>
              <Grid item className="calendar-header-text--small">
                {day.shortName}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CalendarHeader;
