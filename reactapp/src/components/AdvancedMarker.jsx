import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';

const AdvancedMarker = ({ position, map, icon }) => {
  const markerRef = useRef(null);

  console.log(position)
  console.log(map)
  console.log(icon)

  useEffect(() => {
    if (map && !markerRef.current) {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        icon,
      });

      markerRef.current = marker;
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, position, icon]);

  return null;
};

export default AdvancedMarker;
