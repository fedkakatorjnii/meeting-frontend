import { useContext } from 'react';
import { RootContext } from '../../context';

export const useRootStore = () => {
  const store = useContext(RootContext);

  if (store === undefined) throw new Error('Store cannot be undefined...');

  return store;
};
