import { createContext } from 'react';

import { services } from '@API';
import { RootStore } from '../store';

export const RootContext = createContext<RootStore | undefined>(undefined);

export const store = new RootStore(services);
