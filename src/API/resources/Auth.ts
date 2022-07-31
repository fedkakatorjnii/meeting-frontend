import { AxiosInstance } from 'axios';

export interface Room {
  id: number;
  name: string;
  description: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface NewUser {
  firstName: string;
  secondName: string;
  username: string;
  email: string;
  password: string;
}

export interface User {
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

export interface Token {
  refresh: string;
  access: string;
}

export interface UserInfo {
  token: Token;
  user: User;
}

export class Auth {
  readonly apiService: AxiosInstance;

  constructor(apiService: AxiosInstance) {
    this.apiService = apiService;
  }

  createUser = async (form: NewUser) => {
    const newUser = await this.apiService.post<User>('/users', {
      ...form,
    });

    return newUser;
  };

  login = async (form: LoginForm) => {
    const token = await this.apiService.post<Token>('/auth/token', {
      ...form,
    });

    return token;
  };

  logout() {}
}
