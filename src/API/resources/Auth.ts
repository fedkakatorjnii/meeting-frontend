import { HttpClient } from '../HttpClient';
import jwtDecode from 'jwt-decode';
import { LoginForm, TokenResponse, DecodedToken } from '../models';

export class Auth extends HttpClient {
  constructor() {
    super();
  }

  login = async (form: LoginForm): Promise<string> => {
    const token = await this.client.post<TokenResponse>('/auth/token', {
      ...form,
    });
    const { access_token, refresh_token } = token.data;
    const decoded: DecodedToken = jwtDecode(access_token);
    const { username, exp } = decoded;
    this.token = {
      access: access_token,
      refresh: refresh_token,
    };

    window.localStorage.setItem('refreshToken', this.token.refresh);

    return username;
  };

  logout() {}
}
