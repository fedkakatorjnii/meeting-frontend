import { useContext } from 'react';

import { RootContext } from '@common';

export const useRootStore = () => {
  const store = useContext(RootContext);

  if (store === undefined) throw new Error('Store cannot be undefined...');

  return store;
};
