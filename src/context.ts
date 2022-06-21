import { createContext } from 'react';
import { services } from './services';
import { RootStore } from './stores';

export const RootContext = createContext<RootStore | undefined>(undefined);

export const store = new RootStore(services);
