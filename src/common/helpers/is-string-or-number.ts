import { isString } from './is-string';
import { isNumber } from './is-number';

export const isStringOrNumber = (value?: any): value is string => {
  if (!isNumber(value) && !isString(value)) return false;

  return true;
};
