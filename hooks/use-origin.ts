import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const getOrigin = () => {
      if (typeof window !== "undefined" && window.location.origin) {
        setOrigin(window.location.origin);
      }
    };

    getOrigin(); // Call the function once to set the initial value

    // Return a cleanup function if needed
    return () => {};
  }, []);

  return origin;
};
