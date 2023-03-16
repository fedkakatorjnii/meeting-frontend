export const isString = (value?: any): value is string => {
  if (typeof value !== 'string') return false;

  return true;
};
