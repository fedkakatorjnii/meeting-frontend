import React, { createContext } from 'react';
import { RootStore } from '../store';

interface ProviderProps {
  children: React.ReactNode;
}

export const StoreContext = createContext<RootStore>({} as RootStore);

export const StoreContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const store = new RootStore();

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
