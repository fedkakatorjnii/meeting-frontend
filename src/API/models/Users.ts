export interface Room {
  id: number;
  name: string;
  description: string;
}

export interface NewUser {
  firstName: string;
  secondName: string;
  username: string;
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  consistsRooms: Room[];
  ownsRooms: Room[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  isSuperuser: boolean;
}
