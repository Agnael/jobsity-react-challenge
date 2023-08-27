### Requirements

I'm writing this section right before pushing the challenge to justify why are there requirements missing.

#### Completed

- [x] Ability to add "_reminders_" (max. 30 characters) for a day and time specified by the user.

- [x] Ability to include a city as a location for the reminder.

- [x] Ability to edit reminders - including changing text, city, day, and time.

- [x] (Optional) Expand the calendar to support more than the current month or year.

- [x] (Optional) Properly handle overflow when multiple reminders appear on the same date.

- [x] (Optional) Unit test the functionality: Ability to add "reminders" (max. 30 characters) for a day and time specified by the user. Also, include a city.

#### Missing

- [ ] Add a weather service call from [VisualCrossing](https://www.visualcrossing.com/weather/weather-data-services#) and get the average temperature forecast (e.g. 15° C) for the date of the calendar reminder based on the city.

- [ ] Change the weekend days cells' color.

I spent too much time rolling my own autocomplete component and, at the end, I didn't have time to add the per-reminer weather API call. However, the app is indeed using API calls to get the user's location by IP using one API, and then, on the reminder creation form, I'm also fetching locations using the GeoCode API.

As for the weekend cells colors, I just forgot about it until now, seemed too silly to focus on at the time.

On a side note, I also didn't do much on the styling front because I noticed I was already getting out of time because of my autocomplete fiasco, didn't even got to finish that either (it works fine though, it's just unpolished).

### Some screenshots
Notice the (working) year and month navigation buttons, current day marker (today is 26th), and the "go to today" and "reset navigations" links.  
<img width="956" alt="image" src="https://github.com/Agnael/jobsity-react-challenge/assets/32271030/237b96f6-0faf-42ae-b242-14d1ef854977">

Reminder creation form
<img width="956" alt="image" src="https://github.com/Agnael/jobsity-react-challenge/assets/32271030/530f5ce1-1c03-4905-911e-3af8f91af949">

Created reminder.
That red square was not added with MS Paint, that's a hover border style I forgot to fix so the color. Most colors used by me are decided randomly here, as I mentioned, I didn't really had much time to do actual styling.
<img width="957" alt="image" src="https://github.com/Agnael/jobsity-react-challenge/assets/32271030/2de209ae-93ff-4374-be27-9ec6579008e7">

Reminder update form
<img width="958" alt="image" src="https://github.com/Agnael/jobsity-react-challenge/assets/32271030/ac6ccf54-c4f9-4092-afd0-397e654ad17b">


### Considerations

- Just as a general rule, I'll avoid adding any extra packages to the project (i.e. For this MUI version, the Autocomplete component comes in a separate package), since that seems to better suit the spirit of the challenge.

- Some API calls are intentionally throttled with a small timeout, so that stuff like loading spinners don't disappear too fast.

- Every existing component uses JS and PropTypes so, even though I'd rather use typescript if I were to create this project from scratch, I don't think refactoring everything is a wise use of challenge time and I also prefer the codebase to be consistent, so I won't be mixing approaches.

- The project had MaterialUI preinstalled so I'd generally prefer using it's theming system and general styling tools, but since the challenge explicitly asks for some CSS showcasing and the project also has a SASS structure in place, I'll style everything with that same approach.

- Localization was not a priority.

- API calls are made in-situ, I wanted to move them into separate files later but it was not prioritary.

### Reminders are stored within a structure of nested Maps

This is a convoluted approach compared to just store every reminder in a single central array and then filter results out as necessary, but I figured it might come off as **not scalable** since the array would need to get implicitly iterated for each lookup, whereas the Map object uses a hash table and **access times should be constant**.

This could also have been a structure of nested JS plain objects, not necessarily Maps. In fact, lookups might even be easier to read that way (reminders[year]?.[month]?.[day]?.[time]), but **Maps are arguably faster**.

### Reminders stored in redux are mutable

Even though the reducer returns a new state reference, the reminder map doesn't get re-created (hence a new reference) on each state change, so **the map's reference is the same across reducer executions**.

Not a functional approach but, this way, this complex event map doesn't get copied in memory nor garbage collected after each event creation/update/deletion.

This does expose the store to be mutated in some unexpected place in the application, so the speed boost isn't free of cost, and I would generally prefer to go with the immutable approach but my intent is to showcase some scalability in the design.

### Known bugs

- I'm depending on the already included `DayJs` package but it's unreliable, if "2023-02-31" get's parsed, dayjs will create a date for MARCH instead of FEBRUARY because of the days overflowing the end of the month, and since march does have 31 days, it thinks the date is valid. This affects the reminder creation form.

- The `LocationPicker` general usability is not ideal, standard keyboard navigation won't work as expected, for example, because of me rolling the autocomplete component from scratch and not wanting to dwell on it.
