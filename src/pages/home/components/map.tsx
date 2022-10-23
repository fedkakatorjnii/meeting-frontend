import React, { useEffect, useRef } from 'react';
import { useRootStore } from '@common';

export const MapComponent: React.FC = () => {
  const { mapStore } = useRootStore();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapStore.target = mapRef.current;
    }
  }, []);

  return <div id="map" ref={mapRef}></div>;
};
