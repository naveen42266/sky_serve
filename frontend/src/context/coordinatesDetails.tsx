import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface CoordinatesDetailsContextType {
  coordinates: any;
  updateCoordinates: (Coordinates: any) => void;
}

interface CoordinatesProviderProps {
  children: ReactNode;
}

export const CoordinatesDetailsContext = createContext<CoordinatesDetailsContextType | undefined>(undefined);

export const CoordinatesDetailsProvider: React.FC<CoordinatesProviderProps> = ({ children }) => {
  const [coordinates, setCoordinates] = useState(null);

  const updateCoordinates = (newCoordinates: any) => {
    setCoordinates(newCoordinates);
    localStorage.setItem('coordinates', JSON.stringify(newCoordinates));
  };

  useEffect(() => {
    const storedCoordinates = localStorage.getItem('coordinates');
    const initialCoordinates = storedCoordinates ? JSON.parse(storedCoordinates) : null;
    setCoordinates(initialCoordinates);
  }, []);

  return (
    <CoordinatesDetailsContext.Provider value={{ coordinates, updateCoordinates }}>
      {children}
    </CoordinatesDetailsContext.Provider>
  );
};

export const useCoordinatesDetails = () => {
  const context = useContext(CoordinatesDetailsContext);
  if (!context) {
    throw new Error("useCoordinatesDetails must be used within a CoordinatesProvider");
  }
  return context;
};
