import { Card, CardContent, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

const CalendarDay = ({ day, month, year, height, isEnabled = false }) => (
  <Card
    variant="outlined"
    style={{ height }}
    className={
      isEnabled
        ? "calendar-day-card"
        : "calendar-day-card calendar-day-card--disabled"
    }
    onClick={() => {}}
  >
    <CardContent className="calendar-day-content">
      <Grid item>
        <div className="calendar-day-header">
          <p className="calendar-day-text">{day}</p>
        </div>
      </Grid>
    </CardContent>
  </Card>
);

CalendarDay.propTypes = {
  day: PropTypes.number.isRequired,
  month: PropTypes.number,
  year: PropTypes.number,
  height: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool,
};

export default CalendarDay;
