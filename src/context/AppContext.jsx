import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [dataReady, setDataReady] = useState(false);

  return (
    <AppContext.Provider value={{ dataReady, setDataReady }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  return useContext(AppContext);
};

export default AppProvider;