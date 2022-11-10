import { UserResponse } from '@API';
import { getFullName } from './get-full-name';

export const getFullUserName = (user: UserResponse) => {
  return getFullName(user) || user.username;
};
