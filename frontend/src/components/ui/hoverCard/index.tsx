import React from 'react';

interface HoverCardProps {
  info: string;
}

const HoverCard: React.FC<HoverCardProps> = ({ info }) => {
  return (
    <div className="absolute bg-white p-2 shadow-md rounded-lg">
      <p>{info}</p>
    </div>
  );
};

export default HoverCard;
