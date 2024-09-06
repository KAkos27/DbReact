import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((postion) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            postion.coords.latitude,
            postion.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({ message: error.message || "Something went wrong..." });
        setIsFetching(false);
      }
    };

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="Error!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Loading..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
