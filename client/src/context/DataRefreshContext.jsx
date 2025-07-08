import React, { createContext, useContext, useState } from "react";

const DataRefreshContext = createContext();

export const DataRefreshProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <DataRefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </DataRefreshContext.Provider>
  );
};

export const useDataRefresh = () => useContext(DataRefreshContext);
