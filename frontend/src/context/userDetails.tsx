import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserDetailsContextType {
  user: any;
  updateUser: (user: any) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);

export const UserDetailsProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (newUser: any) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(initialUser);
  }, []);

  return (
    <UserDetailsContext.Provider value={{ user, updateUser }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error("useUserDetails must be used within a UserProvider");
  }
  return context;
};
