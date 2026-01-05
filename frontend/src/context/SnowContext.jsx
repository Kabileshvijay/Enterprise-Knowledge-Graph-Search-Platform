import { createContext, useContext, useState } from "react";

const SnowContext = createContext();

export const SnowProvider = ({ children }) => {
  const [isSnowOn, setIsSnowOn] = useState(false);

  const toggleSnow = () => setIsSnowOn(prev => !prev);

  return (
    <SnowContext.Provider value={{ isSnowOn, toggleSnow }}>
      {children}
    </SnowContext.Provider>
  );
};

export const useSnow = () => useContext(SnowContext);
