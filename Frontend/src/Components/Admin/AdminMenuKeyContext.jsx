import React, { createContext, useContext, useState } from "react";

const AdminMenuKeyContext = createContext();

export const AdminMenuKeyProvider = ({ children }) => {
  const [selectedMenuKey, setSelectedMenuKey] = useState(
    localStorage.getItem("selectedMenuKey") || "setting:2"
  );

  const updateSelectedMenuKey = (key) => {
    localStorage.setItem("selectedMenuKey", key);
    setSelectedMenuKey(key);
  };

  return (
    <AdminMenuKeyContext.Provider
      value={{ selectedMenuKey, updateSelectedMenuKey }}
    >
      {children}
    </AdminMenuKeyContext.Provider>
  );
};

export const useAdminMenuKey = () => useContext(AdminMenuKeyContext);
