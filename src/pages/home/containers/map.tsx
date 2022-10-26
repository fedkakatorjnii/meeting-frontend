import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';

export const MapComponent: React.FC = observer(() => {
  const { mapStore } = useRootStore();
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapStore.target = mapRef.current;
    }
  }, []);

  return (
    <div
      style={{ height: '100vh', width: '100%' }}
      className="map"
      ref={mapRef}
    ></div>
  );
});
