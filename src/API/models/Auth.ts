export interface LoginForm {
  username: string;
  password: string;
}

export interface DecodedToken {
  username: string;
  iat: number;
  exp: number;
}

export interface TokenResponse {
  refresh_token: string;
  access_token: string;
}

export interface Token {
  refresh: string;
  access: string;
}
