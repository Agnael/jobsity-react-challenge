import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { calendarActions } from "store/calendar";
import { LocationShape } from "components/LocationPicker";
// import "./CalendarDay.styles.scss";

const CalendarDay = ({
  day,
  month,
  year,
  height,
  active = false,
  reminders = new Map(),
  isEnabled = false,
  onClick = () => {},
  onReminderClick = () => {},
}) => {
  const handleReminderClick = (time) => (e) => {
    onReminderClick?.(e, time);
  };

  return (
    <Card
      square
      variant="outlined"
      style={{ height }}
      data-testid={`calendar-day-${year}-${month}-${day}`}
      className={
        isEnabled
          ? `calendar-day-card ${active ? "active" : ""}`
          : `calendar-day-card calendar-day-card--disabled ${
              active ? "active" : ""
            }`
      }
      onClick={onClick}
    >
      <CardContent className={`calendar-day-content`}>
        <Grid container direction="column">
          <Grid item>
            <div className="calendar-day-header">
              <p className="calendar-day-text">{day}</p>
            </div>
          </Grid>
          <Grid item>
            <List dense style={{ oferflowY: "scroll" }}>
              {[...reminders.entries()].map(([time, reminder]) => {
                const {
                  text,
                  location: { geoCode_placeId },
                } = reminder;

                return (
                  <ListItem
                    dense
                    key={`${geoCode_placeId}.${text}`}
                    onClick={handleReminderClick(time)}
                    className="calendar-day-reminder"
                    data-testid={`reminder-${time}`}
                  >
                    <ListItemText
                      primary={time}
                      secondary={text}
                      primaryTypographyProps={{
                        "data-testid": "time",
                      }}
                      secondaryTypographyProps={{
                        "data-testid": "message",
                      }}
                    ></ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

CalendarDay.propTypes = {
  day: PropTypes.number.isRequired,
  month: PropTypes.number,
  year: PropTypes.number,
  height: PropTypes.string.isRequired,
  reminders: PropTypes.instanceOf(Map),
  isEnabled: PropTypes.bool,
  onClick: PropTypes.func,
  onReminderClick: PropTypes.func,
};

export default CalendarDay;
