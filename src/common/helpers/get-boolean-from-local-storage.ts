import { setBooleanToLocalStorage } from './set-boolean-to-local-storage';

export const getBooleanFromLocalStorage = (
  name: string,
  defaultValue: boolean,
) => {
  const value = localStorage.getItem(name);

  if (value === 'true') return true;
  if (value === 'false') return false;

  setBooleanToLocalStorage(name, defaultValue);

  return defaultValue;
};
