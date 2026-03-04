"use client";

import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        alert("Please enable location access!");
      }
    );
  }, []);

  return location;
};
