import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { mapboxConfig } from '../../../config/mapbox';

export const useMapbox = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  const initializeMap = useCallback(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: mapboxConfig.style,
        center: [77.5946, 12.9716],
        zoom: 10,
        accessToken: mapboxConfig.accessToken,
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add scale control
      map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: 'metric'
        }),
        'bottom-left'
      );

      mapInstance.current = map;
    }
    return mapInstance.current;
  }, []);

  return { mapRef, initializeMap };
};