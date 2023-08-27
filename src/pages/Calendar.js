import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profileActions } from "store/profile";

import { DateNavigator, CalendarGrid } from "components";
import { getCurrentDate } from "utils/dateUtils";
import dayjs from "dayjs";

const Calendar = () => {
  const currentDate = useMemo(() => new Date(), []);

  const [year, setYear] = useState(() => currentDate.getFullYear());
  const [month, setMonth] = useState(() => currentDate.getMonth());

  const dispatch = useDispatch();

  const inferredCurrentUserLocation = useSelector(
    (state) => state.profile.inferredCurrentUserLocation
  );

  if (!inferredCurrentUserLocation) {
    dispatch(profileActions.inferCurrentLocation());
  }

  const handleReset = () => {
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth());
  };

  return (
    <div className="container">
      <DateNavigator
        year={year}
        month={month}
        onMonthChange={setMonth}
        onYearChange={setYear}
        today={currentDate}
        onReset={handleReset}
      />
      <CalendarGrid year={year} month={month} today={currentDate} />
    </div>
  );
};

export default Calendar;
