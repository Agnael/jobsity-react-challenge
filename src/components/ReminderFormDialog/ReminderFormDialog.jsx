import { useState, useMemo, useEffect } from "react";
import { PropTypes } from "prop-types";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Button,
  IconButton,
  Select,
  Paper,
  Link,
  MenuItem,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import LocationPicker from "components/LocationPicker";
import { useDispatch, useSelector } from "react-redux";
import { calendarActions } from "store/calendar";
import useReminders from "hooks/useReminders";
import { isDateValid, isTimeValid } from "utils/dateUtils";

const MAX_REMINDER_TEXT_LENGTH = 30;
// const EMPTY_ERROR = " ";
const VALIDATION_ERROR_MESSAGE_REQUIRED = "Required.";

const ReminderFormMode = PropTypes.oneOf(["create", "update"]);

const TargetDayShape = PropTypes.shape({
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
  time: PropTypes.string,
});

const ReminderFormDialogProps = {
  open: PropTypes.bool.isRequired,
  mode: ReminderFormMode.isRequired,
  target: TargetDayShape.isRequired,
};

const ReminderFormDialog = ({ open = false, mode, target, onClose }) => {
  const isUpdateMode =
    mode && target && target.time !== undefined && mode === "update";

  const { year, month, day, time } = target;

  const dispatch = useDispatch();

  const [reminderMessage, setReminderMessage] = useState();
  const [reminderMessageErrorMsg, setReminderMessageErrorMsg] = useState();

  const [dateStr, setDateStr] = useState();
  const [dateStrErrorMsg, setDateStrErrorMsg] = useState();

  const [timeStr, setTimeStr] = useState("12:00");
  const [timeStrErrorMsg, setTimeStrErrorMsg] = useState();

  const [reminderLocation, setReminderLocation] = useState();
  const [reminderLocationErrorMsg, setReminderLocationErrorMsg] = useState();

  const [isDeleteCheckModalOpen, setIsDeleteCheckModalOpen] = useState(false);

  const currentLocation = useSelector(
    (state) => state.profile.inferredCurrentUserLocation
  );

  const getReminders = useReminders();
  const originalReminder = useMemo(() => {
    if (isUpdateMode) {
      const reminder = getReminders(
        target.year,
        target.month,
        target.day,
        target.time
      );

      setReminderMessage(reminder.text);
      setReminderLocation(reminder.location);

      return reminder;
    }

    return undefined;
  }, [mode, target]);

  useEffect(() => {
    // +1 because months are stored as zero indexed values (0-11)
    const paddedMonth = String(month + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");

    setDateStr(`${year}-${paddedMonth}-${paddedDay}`);

    if (originalReminder) {
      // We can safely assume the time value is available
      setTimeStr(time);

      setReminderMessage(originalReminder.text);
      setReminderLocation(originalReminder.location);
    }
  }, [originalReminder]);

  const handleTextChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= MAX_REMINDER_TEXT_LENGTH) {
      setReminderMessage(newValue);

      if (!!reminderMessageErrorMsg) {
        setReminderMessageErrorMsg(undefined);
      }
    }
  };

  const validateReminderMessageInput = () => {
    let isValid = true;

    if (!reminderMessage || !reminderMessage.trim()) {
      setReminderMessage("");
      setReminderMessageErrorMsg(VALIDATION_ERROR_MESSAGE_REQUIRED);

      isValid = false;
    }

    if (isValid) {
      setReminderMessageErrorMsg(undefined);
    }

    return isValid;
  };

  const validateReminderLocationInput = () => {
    if (!reminderLocation) {
      setReminderLocationErrorMsg(VALIDATION_ERROR_MESSAGE_REQUIRED);
      return false;
    } else {
      setReminderLocationErrorMsg(undefined);
      return true;
    }
  };

  const validatePage = () => {
    const areInputsValid =
      validateDateInput() &&
      validateTimeInput() &&
      validateReminderMessageInput() &&
      validateReminderLocationInput();

    // TODO: Check for uniqueness (same year, month, day and exact time)

    return areInputsValid;
  };

  const getDatePartsFromInputs = () => {
    const finalDateParts = dateStr.split("-");
    const finalYear = Number(finalDateParts[0]);
    // The action expects a zero indexed month
    const finalMonth = Number(finalDateParts[1]) - 1;
    const finalDay = Number(finalDateParts[2]);

    return [finalYear, finalMonth, finalDay];
  };

  const handleCreate = (e) => {
    if (isUpdateMode || !validatePage()) {
      return;
    }

    let [finalYear, finalMonth, finalDay] = getDatePartsFromInputs();

    dispatch(
      calendarActions.addReminder(
        finalYear,
        finalMonth,
        finalDay,
        timeStr,
        reminderLocation,
        reminderMessage
      )
    );

    onClose?.();
  };

  const handleUpdate = (e) => {
    if (!isUpdateMode || !validatePage()) {
      return;
    }

    let [finalYear, finalMonth, finalDay] = getDatePartsFromInputs();

    dispatch(
      calendarActions.updateReminder(
        target,
        { year: finalYear, month: finalMonth, day: finalDay, time: timeStr },
        reminderLocation,
        reminderMessage
      )
    );

    onClose?.();
  };

  const handleCloseDeleteCheckModal = () => setIsDeleteCheckModalOpen(false);

  const handleDelete = () => {
    if (!isUpdateMode) {
      return;
    }

    dispatch(calendarActions.deleteReminder(year, month, day, time));

    setIsDeleteCheckModalOpen(false);

    onClose?.();
  };

  const dialogTitle = useMemo(() => {
    switch (mode) {
      case "create":
        return "Create reminder";
      case "update":
        return "Update reminder";
      default:
        return "Reminder";
    }
  }, [mode]);

  if (!open) {
    return <></>;
  }

  const handleLocationChange = (newLocation) => {
    setReminderLocationErrorMsg(undefined);
    setReminderLocation(newLocation);
  };

  const handleClose = (e, reason) => {
    if (reason === "backdropClick") {
      return;
    }

    onClose(reason);
  };

  const handleCancelClick = (e) => onClose("cancel-click");

  const handleDateChange = (e) => {
    setDateStr(e.currentTarget.value);
  };

  const validateDateInput = () => {
    if (dateStr === undefined || dateStr.trim() === "") {
      setDateStrErrorMsg(VALIDATION_ERROR_MESSAGE_REQUIRED);
      return false;
    }

    let isValid = true;

    if (!isDateValid(dateStr)) {
      setDateStrErrorMsg("The format should be 'YYYY-MM-DD'.");
      isValid = false;
    }

    if (isValid) {
      setDateStrErrorMsg(undefined);
    }

    return isValid;
  };

  const validateTimeInput = () => {
    if (!timeStr) {
      setTimeStrErrorMsg(VALIDATION_ERROR_MESSAGE_REQUIRED);
      return false;
    }

    let isValid = true;

    if (!isTimeValid(timeStr)) {
      setTimeStrErrorMsg("The format should be 'HH:MM'.");
      isValid = false;
    }

    if (isValid) {
      setTimeStrErrorMsg(undefined);
    }

    return isValid;
  };

  const handleDateBlur = (e) => {
    validateDateInput();
  };

  const handleTimeChange = (e) => {
    setTimeStr(e.currentTarget.value);
  };

  const handleTimeBlur = (e) => {
    validateTimeInput();
  };

  const handleDeleteClick = (e) => setIsDeleteCheckModalOpen(true);

  // Testing seed
  // if (dateStr !== "2023-08-01") setDateStr("2023-08-01");

  // if (timeStr !== "01:05") setTimeStr("01:05");

  // if (reminderMessage !== "Some dummy reminder")
  //   setReminderMessage("Some dummy reminder");

  // if (!reminderLocation) {
  //   setReminderLocation({
  //     geoCode_placeId: 286895215,
  //     name: "Morón, Partido de Morón, Buenos Aires, Argentina",
  //     latitude: -34.6510527,
  //     longitude: -58.6217416,
  //   });
  // }

  return (
    <>
      <Dialog
        className="reminder-form-dialog"
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown
        data-testid="reminder-form-dialog"
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{ paddingRight: 12 }}
        >
          <Grid item>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </Grid>
          <Grid item>
            <IconButton onClick={handleCancelClick}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <DialogContent style={{ paddingBottom: 16 }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <DialogContentText>Some explaination</DialogContentText>
            </Grid>

            <Grid item>
              <Paper variant="outlined" style={{ padding: 8 }}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          InputProps={{
                            inputProps: {
                              "data-testid": "txt-date",
                            },
                          }}
                          value={dateStr ?? ""}
                          margin="dense"
                          label="Date"
                          variant="outlined"
                          placeholder="YYYY-MM-DD"
                          error={!!dateStrErrorMsg}
                          helperText={dateStrErrorMsg ?? "Example: 2023-02-08"}
                          onChange={handleDateChange}
                          onBlur={handleDateBlur}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          InputProps={{
                            inputProps: {
                              "data-testid": "txt-time",
                            },
                          }}
                          value={timeStr ?? ""}
                          margin="dense"
                          label="Time"
                          placeholder="HH:MM"
                          variant="outlined"
                          error={!!timeStrErrorMsg}
                          helperText={timeStrErrorMsg ?? "Example: 22:08"}
                          onChange={handleTimeChange}
                          onBlur={handleTimeBlur}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item>
              <Paper variant="outlined" style={{ padding: 8 }}>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="overline" color="textPrimary">
                      Details
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Message"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        inputProps: {
                          "data-testid": "txt-message",
                        },
                        endAdornment: (
                          <Typography
                            color={
                              !!reminderMessageErrorMsg
                                ? "error"
                                : "textPrimary"
                            }
                          >{`${
                            reminderMessage?.length ?? 0
                          }/${MAX_REMINDER_TEXT_LENGTH}`}</Typography>
                        ),
                      }}
                      value={reminderMessage ?? ""}
                      onChange={handleTextChange}
                      error={!!reminderMessageErrorMsg}
                      helperText={reminderMessageErrorMsg ?? " "}
                      placeholder="Text that the reminder will show"
                    />
                  </Grid>

                  <Grid item>
                    <LocationPicker
                      value={reminderLocation}
                      InputProps={{
                        inputProps: {
                          "data-testid": "cmb-location",
                        },
                      }}
                      margin="dense"
                      label="City"
                      fullWidth
                      variant="outlined"
                      error={!!reminderLocationErrorMsg}
                      helperText={reminderLocationErrorMsg ?? " "}
                      placeholder="City in which the reminder takes place"
                      onChange={handleLocationChange}
                      currentLocationSuggestion={currentLocation}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions style={{ padding: "16px 24px" }}>
          <Grid container spacing={1} justifyContent="space-between">
            <Grid item>
              <Grid container>
                {isUpdateMode && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="text" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    data-testid="btn-submit"
                    variant="contained"
                    color="primary"
                    onClick={isUpdateMode ? handleUpdate : handleCreate}
                  >
                    {isUpdateMode ? "Update" : "Create"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteCheckModalOpen}
        onClose={handleCloseDeleteCheckModal}
        maxWidth="xs"
        fullWidth
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{ paddingRight: 12 }}
        >
          <Grid item>
            <DialogTitle>Do you want to delete this reminder?</DialogTitle>
          </Grid>
          <Grid item>
            <IconButton onClick={handleCloseDeleteCheckModal}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <DialogContentText>
            This is an irreversible operation.
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ padding: "16px 24px" }}>
          <Grid container spacing={1} justifyContent="space-between">
            <Grid item>
              <Button variant="text" onClick={handleCloseDeleteCheckModal}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

ReminderFormDialog.propTypes = ReminderFormDialogProps;

export default ReminderFormDialog;
