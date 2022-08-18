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

export interface TokenResponse {
  refresh: string;
  access: string;
}
