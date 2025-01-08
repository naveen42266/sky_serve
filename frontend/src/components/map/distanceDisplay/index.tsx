import React from 'react';

interface DistanceDisplayProps {
  distance: number;
}

const DistanceDisplay: React.FC<DistanceDisplayProps> = ({ distance }) => {
  return <div className="text-lg">Distance: {distance.toFixed(2)} km</div>;
};

export default DistanceDisplay;
