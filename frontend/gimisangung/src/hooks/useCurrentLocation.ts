import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const path = useSelector((state: RootState) => state.account.path);

  const [currentLocation, setCurrentLocation] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (path.length > 0) {
      setCurrentLocation(path[path.length - 1]);
    } else {
      setCurrentLocation(undefined);
    }
  }, [path]);

  return currentLocation;
};

export default useCurrentLocation;
