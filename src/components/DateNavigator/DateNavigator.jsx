import React, { useMemo } from "react";

import { Grid, IconButton, Link } from "@material-ui/core";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  SkipNext,
  SkipPrevious,
} from "@material-ui/icons";
import PropTypes from "prop-types";
import { months } from "dayjs";

const DateNavigatorProps = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func,
  onYearChange: PropTypes.func,
  today: PropTypes.object,
  onReset: PropTypes.func,
};

const DateNavigator = ({
  year,
  month,
  onMonthChange,
  onYearChange,
  today,
  onReset,
}) => {
  const monthNames = months();

  const [prevMonth, prevMonthYear] = useMemo(() => {
    // If the current month is january, so the previous month is the last month
    // of the previous year.
    if (month === 0) {
      return [11, year - 1];
    } else {
      return [month - 1, year];
    }
  }, [month, year]);

  const [nextMonth, nextMonthYear] = useMemo(() => {
    // If the current month is december, so the next month is the first month
    // of the next year.
    if (month === 11) {
      return [0, year + 1];
    } else {
      return [month + 1, year];
    }
  }, [month, year]);

  const handlePrevMonthClick = (e) => {
    onMonthChange?.(prevMonth);
    onYearChange?.(prevMonthYear);
  };

  const handleNextMonthClick = (e) => {
    onMonthChange?.(nextMonth);
    onYearChange?.(nextMonthYear);
  };

  const handlePrevYearClick = (e) => {
    onYearChange?.(year - 1);
  };

  const handleNextYearClick = (e) => {
    onYearChange?.(year + 1);
  };

  const handleGoToCurrentMonthClick = () => {
    if (today) {
      onYearChange?.(today.getFullYear());
      onMonthChange?.(today.getMonth());
    }
  };

  const handleResetClick = () => onReset?.();

  return (
    <Grid container className="date-navigator-container">
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              title={`See previous year (${monthNames[month]} ${year - 1})`}
              onClick={handlePrevYearClick}
            >
              <SkipPrevious />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              title={`See previous month (${monthNames[prevMonth]} ${prevMonthYear})`}
              onClick={handlePrevMonthClick}
            >
              <ChevronLeftRounded />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <p className="date-navigator-text">
              {monthNames[month]} {year}{" "}
            </p>
          </Grid>

          {(today || onReset) && (
            <Grid item>
              <Grid container spacing={2}>
                {today && (
                  <Grid item>
                    <Link
                      href="#"
                      onClick={handleGoToCurrentMonthClick}
                      title="Go to the current month"
                    >
                      See current
                    </Link>
                  </Grid>
                )}

                {onReset && (
                  <Grid item>
                    <Link
                      href="#"
                      onClick={handleResetClick}
                      title="Undo navigations"
                    >
                      Reset
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <IconButton
              title={`See next month (${monthNames[nextMonth]} ${nextMonthYear})`}
              onClick={handleNextMonthClick}
            >
              <ChevronRightRounded />
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              title={`See next year (${monthNames[month]} ${year + 1})`}
              onClick={handleNextYearClick}
            >
              <SkipNext />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

DateNavigator.propTypes = DateNavigatorProps;

export default DateNavigator;
