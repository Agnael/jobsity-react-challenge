import { useState, useEffect } from "react";

const useDebouncedState = (value, delayMs) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeoutHandler);
  }, [value, delayMs]);

  return debouncedValue;
};

export default useDebouncedState;
