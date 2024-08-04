import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const api = "https://kt7mfs37-3001.euw.devtunnels.ms/api";

  return (
    <UserContext.Provider value={{ user, setUser, cart, setCart, api }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
