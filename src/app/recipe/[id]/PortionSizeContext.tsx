"use client";
import {
  Dispatch,
  createContext,
  useContext,
  useState,
  SetStateAction,
  ReactNode,
} from "react";

const PortionSizeContext = createContext<{
  portionSize: number;
  setPortionSize: Dispatch<SetStateAction<number>>;
}>({
  portionSize: 1,
  setPortionSize: () => {},
});

export const PortionSizeProvider = ({ children }: { children: ReactNode }) => {
  const [portionSize, setPortionSize] = useState(1);

  return (
    <PortionSizeContext.Provider value={{ portionSize, setPortionSize }}>
      {children}
    </PortionSizeContext.Provider>
  );
};

export const usePortionSize = () => {
  return useContext(PortionSizeContext);
};
