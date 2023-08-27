export const profileActionTypes = {
  SET_INFERRED_CURRENT_LOCATION: "profile/setInferredCurrentLocation",
  SET_THEME: "profile/setTheme",
};

export const profileActions = {
  inferCurrentLocation: () => async (dispatch) => {
    try {
      const ipApiResult = await (
        await fetch("http://ip-api.com/json", { mode: "cors" })
      ).json();

      try {
        // Gets the standard location format from the main location API.
        // The IP API also returns LAT and LONG values but I'd rather use
        // the GeoCode place_id field to absolutly identify results.
        const geoCodeApiUrl =
          `https://geocode.maps.co/search?` +
          `city=${ipApiResult.city}` +
          `&state=${ipApiResult.region}` +
          `&postalcode=${ipApiResult.zip}` +
          `&country=${ipApiResult.countryCode}`;

        const geoCodeApiResults = await (
          await fetch(geoCodeApiUrl, { mode: "cors" })
        ).json();

        if (geoCodeApiResults[0]) {
          const geoCodeApiResult = geoCodeApiResults[0];

          const inferredCurrentLocation = {
            geoCode_placeId: geoCodeApiResult.place_id,
            name: geoCodeApiResult.display_name,
            latitude: Number(geoCodeApiResult.lat),
            longitude: Number(geoCodeApiResult.lon),
          };

          dispatch(
            profileActions.setInferredCurrentLocation(
              ipApiResult.query,
              inferredCurrentLocation
            )
          );
        } else {
          throw new Error(
            "The IP API did find a location but it couldn't be found in GeoCode."
          );
        }
      } catch (geoCodeApiErr) {
        console.error(
          "Failed to get a GeoCode location using the IP API data: ",
          geoCodeApiErr
        );
      }
    } catch (ipApiErr) {
      console.error(
        "Failed to load the inferred current location from the IP API: ",
        ipApiErr
      );
    }
  },
  setInferredCurrentLocation: (currentIp, currentLocation) => ({
    type: profileActionTypes.SET_INFERRED_CURRENT_LOCATION,
    payload: { currentIp, currentLocation },
  }),
  setLightTheme: () => ({
    type: profileActionTypes.SET_THEME,
    payload: "light",
  }),
  setDarkTheme: () => ({
    type: profileActionTypes.SET_THEME,
    payload: "dark",
  }),
};
