import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useMapbox } from '../../../hooks/useMapbox';

const MapWithDraw = () => {
  const { mapRef, initializeMap } = useMapbox();

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return <div id="map" ref={mapRef} className="w-full h-full"></div>;
};

export default MapWithDraw;
