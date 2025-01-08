import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface MarkerManagerProps {
  map: mapboxgl.Map | null;
}

const MarkerManager: React.FC<MarkerManagerProps> = ({ map }) => {
  useEffect(() => {
    if (map) {
      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([0, 0]) // Default position
        .addTo(map);

      marker.on('dragend', () => {
        console.log('Marker moved to:', marker.getLngLat());
      });
    }
  }, [map]);

  return null;
};

export default MarkerManager;
