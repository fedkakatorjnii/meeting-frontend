import { isStringOrNumber } from './is-string-or-number';

export const addOrJoinStr = ({
  newValue,
  oldValue,
  joinMessage,
}: {
  newValue?: string | number;
  oldValue?: string | number;
  joinMessage?: string | number;
}) => {
  const join = joinMessage || ' ';

  if (isStringOrNumber(newValue)) {
    if (isStringOrNumber(oldValue)) {
      return `${oldValue}${join}${newValue}`;
    } else {
      return `${newValue}`;
    }
  }

  return `${oldValue}`;
};
