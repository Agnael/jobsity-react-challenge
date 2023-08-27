import React, { createRef, useEffect, useRef, useState } from "react";
import {
  TextField,
  OutlinedInput,
  CircularProgress,
  Fade,
  Popover,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  MyLocation as MyLocationIcon,
  History as HistoryIcon,
} from "@material-ui/icons";
import PropTypes from "prop-types";
import useDebouncedState from "hooks/useDebouncedState";

const MAX_SEARCH_OPTIONS = 3;

const VALID_RESULT_TYPES = [
  "town",
  "city",
  "suburb",
  "village",
  "administrative",
];

export const LocationShape = PropTypes.shape({
  geoCode_placeId: PropTypes.number,
  name: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
});

export const LocationPickerProps = {
  value: LocationShape,
  currentLocationSuggestion: LocationShape,
  suggestedValues: PropTypes.arrayOf(LocationShape),
};

const OutlinedInputWithResultBox = () => {
  return <OutlinedInput />;
};

/* 
Since we're rolling out our oun autocomplete component, we have to deal 
with the issues that come with the idea of a result box having to be 
shown on top of everything else in the dom but positioned relative to 
the current textfield.

In theory that's not big of a deal because you can just foce an absolute 
position, but you then depend on the parent components to not hide their 
overflow, which would occlude the box.

To avoid that problem we use the MUI Popover component to portal the 
result box to a different DOM location and position it relative to the
DOM reference of our dummy textfield. 

Note that we need the dummy textfield because the popover, once opened,
completely occludes everything else in the DOM, and the original dummy
textfield is unusable with an open popover because clicking on it would
cause the popover to close. That's why the result box has it's own
textfield pretending to be the same one as before.
*/
const LocationPicker = ({
  value = undefined,
  currentLocationSuggestion = undefined,
  suggestedValues = [],
  onChange = () => {},
  ...textFieldProps
} = {}) => {
  const [location, setLocation] = useState(value);

  const [searchValue, setSearchValue] = useState(value?.name);

  // TODO: Look into the location API rate limits and lower the debounce delay
  const debouncedSearchValue = useDebouncedState(searchValue, 500);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(undefined);
  // const dummyRef = createRef();

  const [isLoading, setIsLoading] = useState(false);

  const [isResultBoxVisible, setIsResultBoxVisible] = useState(false);
  const [resultsAnchorEl, setResultsAnchorEl] = useState(null);

  useEffect(() => {
    if (searchValue === "") {
      setLocation(undefined);
      onChange(undefined);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isResultBoxVisible) {
      return;
    }

    if (debouncedSearchValue) {
      setSearchResults([]);
    }

    const abortController = new AbortController();

    setSearchLoading(true);
    setSearchError(undefined);
    const queryStr = encodeURIComponent(debouncedSearchValue);

    const timeoutHandle = setTimeout(() => {
      fetch(`https://geocode.maps.co/search?q=${queryStr}`, {
        mode: "cors",
        signal: abortController.signal,
      })
        .then((res) => res.json())
        .then((json) => {
          const newResults = json
            .filter(
              (x) =>
                VALID_RESULT_TYPES.includes(x.type) &&
                currentLocationSuggestion?.geoCode_placeId !== x.place_id
            )
            .slice(0, MAX_SEARCH_OPTIONS)
            .map(({ place_id, display_name, lat, lon }) => ({
              geoCode_placeId: place_id,
              name: display_name,
              latitude: Number(lat),
              longitude: Number(lon),
            }));

          setSearchResults(newResults);
        })
        .catch((e) => {
          setSearchResults([]);
          setSearchError(e.message);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 0);

    return () => {
      clearTimeout(timeoutHandle);
      abortController.abort();
    };
  }, [debouncedSearchValue, isResultBoxVisible]);

  useEffect(() => {
    if (!isResultBoxVisible && !location) {
      setSearchValue("");

      // dummyRef.current.blur();
      document.activeElement.blur();
    }
  }, [isResultBoxVisible]);

  const ensureResultBoxIsVisible = (anchorEl) => {
    if (resultsAnchorEl == null) {
      setResultsAnchorEl(anchorEl);
    }

    if (!isResultBoxVisible) {
      setIsResultBoxVisible(true);
    }
  };

  const handleDummyClick = (e) => ensureResultBoxIsVisible(e.currentTarget);

  const handleDummyChange = (e) => {
    ensureResultBoxIsVisible(e.currentTarget);
    setSearchValue(e.currentTarget.value);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleResultOptionClick = (resultItem) => (e) => {
    setLocation(resultItem);
    onChange(resultItem);

    setSearchValue(resultItem.name);
    setIsResultBoxVisible(false);
  };

  const TextFieldAdornment = () => {
    if (searchLoading) {
      return <CircularProgress size={18} thickness={3} />;
    } else if (isResultBoxVisible) {
      return <ArrowDropUpIcon />;
    } else {
      return <ArrowDropDownIcon />;
    }
  };

  const EmptyResultsMessage = () => {
    if (
      searchValue === "" ||
      (currentLocationSuggestion &&
        searchValue === currentLocationSuggestion.name)
    ) {
      return <Typography>Start typing to search for locations.</Typography>;
    } else if (searchLoading) {
      return <Typography>Loading results...</Typography>;
    } else {
      return <Typography>No results were found.</Typography>;
    }
  };

  return (
    <div className="location-picker">
      <TextField
        // ref={dummyRef}
        value={searchValue ?? ""}
        className="location-picker-dummy-text-field"
        InputProps={{
          endAdornment: <TextFieldAdornment />,
          // className: "location-picker-dummy-text-field-input",
          ...textFieldProps.InputProps,
        }}
        {...textFieldProps}
        onClick={handleDummyClick}
        onChange={handleDummyChange}
        // onFocus={handleDummyClick}
      />

      <Popover
        data-testid="location-picker-result-box"
        open={isResultBoxVisible && !!resultsAnchorEl}
        anchorEl={resultsAnchorEl}
        onClose={() => setIsResultBoxVisible(false)}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        style={{ marginTop: -8 }}
        PaperProps={{
          square: true,
          elevation: 8,
          style: {
            width: resultsAnchorEl?.offsetWidth + 8,
            paddingLeft: 4,
            paddingRight: 4,
            marginLeft: -4,
          },
        }}
      >
        <TextField
          autoFocus
          value={searchValue ?? ""}
          className="location-picker-text-field"
          InputProps={{
            endAdornment: <TextFieldAdornment />,
            className: "location-picker-text-field-input",
            ...textFieldProps.InputProps,
          }}
          onChange={handleInputChange}
          {...textFieldProps}
          helperText={undefined}
        />

        <List>
          {currentLocationSuggestion && (
            <>
              <ListItem
                selected={
                  location &&
                  location.geoCode_placeId ===
                    currentLocationSuggestion.geoCode_placeId
                }
                button
                key={currentLocationSuggestion.geoCode_placeId}
                onClick={handleResultOptionClick(currentLocationSuggestion)}
              >
                <ListItemIcon style={{ minWidth: "auto", paddingRight: 16 }}>
                  <MyLocationIcon color="action" />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="body1" color="textPrimary">
                      {currentLocationSuggestion.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      Estimated current location
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
            </>
          )}
          {searchResults.length === 0 && <EmptyResultsMessage />}
          {searchResults.map((result, idx) => (
            <ListItem
              button
              data-testid={`result-option-${idx}`}
              key={result.geoCode_placeId}
              onClick={handleResultOptionClick(result)}
            >
              <ListItemText>{result.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};

LocationPicker.propTypes = LocationPickerProps;

export default LocationPicker;
