export interface LoginRequest {
  username: string;
  password: string;
}

export type PartialLoginRequest = Partial<LoginRequest>;

export interface DecodedToken {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}

export type UserInfoForToken = Pick<DecodedToken, 'userId' | 'username'>;

export interface TokenResponse {
  refresh: string;
  access: string;
}
