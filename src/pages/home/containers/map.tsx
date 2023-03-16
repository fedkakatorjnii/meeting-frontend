import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';

interface MapComponentProps {
  children?: React.ReactNode;
}

export const MapComponent: React.FC<MapComponentProps> = observer(
  ({ children }) => {
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
      >
        {children}
      </div>
    );
  },
);
