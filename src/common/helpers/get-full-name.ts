import { UserResponse } from '@API';

type UserNameInfo = Pick<UserResponse, 'lastName' | 'firstName'>;

export const getFullName = ({ lastName, firstName }: UserNameInfo) => {
  let resName = '';

  if (lastName) {
    resName = lastName || '';
  }

  if (!resName) return firstName;

  return `${lastName} ${firstName}`;
};
