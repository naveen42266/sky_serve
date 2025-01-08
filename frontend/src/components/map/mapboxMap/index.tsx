import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { useMapbox } from '../../../hooks/useMapbox';
import { useCoordinatesDetails } from '@/context/coordinatesDetails';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import { useUserDetails } from '@/context/userDetails';

interface MeasurementInfo {
  distance?: number;
  area?: number;
}

interface MapWithDrawProps {
  handleMeasurement: (key: boolean, value: MeasurementInfo) => void;
}

const MapWithDraw: React.FC<MapWithDrawProps> = ({ handleMeasurement }) => {
  const { mapRef, initializeMap } = useMapbox();
  const { coordinates, updateCoordinates } = useCoordinatesDetails();
  const { user, updateUser } = useUserDetails();
  const router = useRouter();
  const [coordinate, setCoordinates] = useState<[number, number][]>([]);
  const [measurementInfo, setMeasurementInfo] = useState<MeasurementInfo>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to toggle the dialog
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const mapRef2 = useRef<mapboxgl.Map | null>(null);
  const isDraggingRef = useRef<number | null>(null);

  console.log(mapRef2.current, "mapRef2", mapRef.current)

  const handleInitializeMap = () => {
    const map = initializeMap();
    mapRef2.current = map;

    if (map) {
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'measurement-popup',
      });

      map.on('click', handleMapClick);
      map.on('mousedown', 'points', handleMouseDown);
      map.on('mousemove', handleMouseMove);
      map.on('mouseup', handleMouseUp);

      map.on('mouseover', 'points', () => {
        map.getCanvas().style.cursor = 'move';
      });
      map.on('mouseout', 'points', () => {
        map.getCanvas().style.cursor = '';
      });

      return () => {
        map.off('click', handleMapClick);
        map.off('mousedown', 'points', handleMouseDown);
        map.off('mousemove', handleMouseMove);
        map.off('mouseup', handleMouseUp);
        if (popupRef.current) popupRef.current.remove();
      };
    }
  }

  const handleClearMapData = () => {
    if (!mapRef2.current) return;

    const map = mapRef2.current;

    // Check if layers and sources exist before removing them
    if (map.getLayer('shape-fill')) {
      map.removeLayer('shape-fill');
    }
    if (map.getLayer('shape-line')) {
      map.removeLayer('shape-line');
    }
    if (map.getLayer('points')) {
      map.removeLayer('points');
    }

    if (map.getSource('shape')) {
      map.removeSource('shape');
    }
    if (map.getSource('points')) {
      map.removeSource('points');
    }

    // Optionally clear map state (coordinates, measurementInfo, etc.)
    setCoordinates([]);
    setMeasurementInfo({});

    // Re-initialize the map to create a fresh instance
    handleInitializeMap();
  };

  useEffect(() => {
    handleInitializeMap();
  }, [initializeMap]);

  // useEffect(() => {
  //   if (coordinates?.Coordinates) {
  //     const savedCoords = coordinates.Coordinates.coords;
  //     setCoordinates(savedCoords);
  //     updateMapLayers(savedCoords);
  //   } else {
  //     // handleClearMapData();
  //   }
  // }, [coordinates]);



  useEffect(() => {
    if (coordinates === null) {
      handleClearMapData(); // Clear data when coordinates become null
    }
  }, [coordinates])

  // useEffect(() => {
  //   handleInitializeMap();
  // }, [initializeMap]);

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!e.originalEvent.defaultPrevented) {
      const newCoordinate: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => {
        const newCoordinates = [...prev, newCoordinate];
        updateMapLayers(newCoordinates);
        return newCoordinates;
      });
    }
  };

  const handleMouseDown = (e: mapboxgl.MapMouseEvent) => {
    if (e.features && e.features[0]) {
      e.preventDefault();
      const pointId = e.features[0].properties?.index;
      isDraggingRef.current = pointId;

      if (mapRef2.current) {
        mapRef2.current.getCanvas().style.cursor = 'grab';
      }
    }
  };

  const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
    if (isDraggingRef.current !== null && mapRef2.current) {
      const pointId = isDraggingRef.current;

      setCoordinates((prev) => {
        const newCoordinates = [...prev];
        newCoordinates[pointId] = [e.lngLat.lng, e.lngLat.lat];
        updateMapLayers(newCoordinates);
        return newCoordinates;
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = null;
    if (mapRef2.current) {
      mapRef2.current.getCanvas().style.cursor = '';
    }
  };

  const updateMapLayers = (newCoordinates: [number, number][]) => {
    if (!mapRef2?.current || newCoordinates?.length === 0) return;

    const map = mapRef2.current;

    const pointsGeoJson = {
      type: 'FeatureCollection',
      features: newCoordinates?.map((coord, index) => ({
        type: 'Feature',
        properties: { index },
        geometry: {
          type: 'Point',
          coordinates: coord,
        },
      })),
    } as GeoJSON.FeatureCollection;

    if (map?.getSource('points')) {
      (map?.getSource('points') as mapboxgl.GeoJSONSource).setData(pointsGeoJson);
    } else {
      map?.addSource('points', {
        type: 'geojson',
        data: pointsGeoJson,
      });

      map?.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#007cbf',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      });
    }

    if (newCoordinates?.length >= 2) {
      const isClosedShape =
        newCoordinates?.length > 2 &&
        newCoordinates[0][0] === newCoordinates[newCoordinates?.length - 1][0] &&
        newCoordinates[0][1] === newCoordinates[newCoordinates?.length - 1][1];

      const geoJsonData = {
        type: 'Feature',
        geometry: isClosedShape
          ? {
            type: 'Polygon' as const,
            coordinates: [newCoordinates],
          }
          : {
            type: 'LineString' as const,
            coordinates: newCoordinates,
          },
        properties: {},
      } as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.LineString>;

      if (map.getSource('shape')) {
        (map.getSource('shape') as mapboxgl.GeoJSONSource).setData(geoJsonData);
      } else {
        map.addSource('shape', {
          type: 'geojson',
          data: geoJsonData,
        });

        map.addLayer(
          {
            id: 'shape-line',
            type: 'line',
            source: 'shape',
            paint: {
              'line-color': '#007cbf',
              'line-width': 2,
            },
          },
          'points'
        );

        map.addLayer({
          id: 'shape-fill',
          type: 'fill',
          source: 'shape',
          paint: {
            'fill-color': '#007cbf',
            'fill-opacity': 0.1,
          },
        });
      }

      updateMeasurements(newCoordinates, isClosedShape);
    }
  };

  // const updateMeasurements = (
  //   coords: [number, number][],
  //   isClosedShape: boolean
  // ) => {
  //   if (coords.length < 2 || !mapRef2.current) return;

  //   const line = turf.lineString(coords);
  //   const distance = turf.length(line, { units: 'kilometers' });

  //   let measurement: MeasurementInfo = {
  //     distance: Number(distance.toFixed(2)),
  //   };

  //   if (isClosedShape) {
  //     const polygon = turf.polygon([coords]);
  //     const area = turf.area(polygon);
  //     measurement.area = Number((area / 1000000).toFixed(2));
  //   }

  //   setMeasurementInfo(measurement);
  //   let data = {
  //     isBoolean: true,
  //     data: measurement
  //   }
  //   updateCoordinates(measurement);
  //   localStorage.setItem('coordinates', JSON.stringify(measurement))
  //   // handleMeasurement(true, measurement); 
  // };


  const updateMeasurements = (coords: [number, number][], isClosedShape: boolean) => {
    console.log(coords, "coords");

    if (coords.length < 3 || !mapRef2.current) return;

    // Remove duplicate coordinates
    const uniqueCoords = coords.filter((coord, index, self) =>
      index === self.findIndex((c) => c[0] === coord[0] && c[1] === coord[1])
    );

    // Ensure at least 3 unique points for a Polygon
    if (isClosedShape && uniqueCoords.length < 4) {
      console.error("Polygon requires at least 4 unique points.");
      return;
    }

    const line = turf.lineString(uniqueCoords);
    const distance = turf.length(line, { units: 'kilometers' });

    let measurement: MeasurementInfo = {
      distance: Number(distance.toFixed(2)),
    };

    if (isClosedShape) {
      const polygon = turf.polygon([uniqueCoords]);
      const area = turf.area(polygon);
      measurement.area = Number((area / 1000000).toFixed(2)); // Convert area to square kilometers
    }

    let total: any = {
      Coordinates: uniqueCoords,
      area: measurement.area,
      distance: measurement.distance,
    };

    setMeasurementInfo(measurement);
    updateCoordinates(total);
  };


  return (
    <>
      <div id="map" ref={mapRef} className="w-full h-full relative" />
      <div className='absolute top-0 left-12 right-0 z-10'>
        <Header setOpen={(value: boolean) => { router.push(`/user/${user?.userId}`) }} />
      </div>
      {/* {isDialogOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex flex-col items-center justify-end z-50">
          <div className="bg-white rounded-md p-1 w-96 shadow-lg">
            <h3 className="text-base font-bold mb-4">Measurement Info</h3>
            {measurementInfo.distance && (
              <p>Distance: {measurementInfo.distance} km</p>
            )}
            {measurementInfo.area && <p>Area: {measurementInfo.area} km²</p>}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </>
  );
};

export default MapWithDraw;
