import { UserIdRequest } from '@API';

export const isUserId = (value?: any): value is UserIdRequest => {
  if (typeof value === 'number' && !Number.isNaN(value)) return true;
  if (typeof value === 'string' && value !== '') return true;

  return false;
};
