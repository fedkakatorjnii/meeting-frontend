export const isNumber = (value?: any): value is number => {
  if (typeof value !== 'number') return false;

  return true;
};
