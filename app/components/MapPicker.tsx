"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import type { LatLngExpression } from "leaflet";

interface Props {
  onSelect: (lat: number, lng: number) => void;
  initialPosition?: LatLngExpression;
}

export default function MapPicker({ onSelect, initialPosition }: Props) {
  const [position, setPosition] = useState<LatLngExpression | null>(initialPosition || null);

  const defaultPosition: LatLngExpression = [11.2588, 75.7804]; // Kozhikode

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newPos: LatLngExpression = [lat, lng];
        setPosition(newPos);
        onSelect(lat, lng);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}