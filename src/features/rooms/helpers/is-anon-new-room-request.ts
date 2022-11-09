import { NewAnonRoomRequest, PartialNewAnonRoomRequest } from '@API';

export const isAnonNewRoomRequest = (
  values: PartialNewAnonRoomRequest,
): values is NewAnonRoomRequest => {
  const { name, description, photo } = values;

  if (name === undefined || typeof name !== 'string' || name === '') {
    return false;
  }
  if (description !== undefined && (typeof name !== 'string' || name === '')) {
    return false;
  }
  if (photo !== undefined && (typeof photo !== 'string' || photo === '')) {
    return false;
  }

  return true;
};
