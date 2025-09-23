import { createContext, useContext, useState, type ReactNode } from "react";

interface SaveInterface {
  isSave: boolean;
  setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveContext = createContext<SaveInterface | null>(null);

export const SaveProvider = ({ children }:{ children: ReactNode }) => {
  const [isSave, setIsSave] = useState(false);
  return <SaveContext value={{ isSave, setIsSave }}>{children}</SaveContext>;
};

export const useSave = ()=>{
    const context = useContext(SaveContext);
    if (!context) {
        throw new Error("useSave must be used within a SaveProvider");
    }
    return context;
}