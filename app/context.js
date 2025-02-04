"use client";
import React, { useState, createContext } from "react";

// Create context
export const AppContext = createContext(); 

// Provider component
export const AppProvider = ({ children }) => {
  const [makesessionobj, setSessionobj] = useState({});
  
  return (
    <AppContext.Provider value={{ makesessionobj, setSessionobj }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
