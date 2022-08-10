import { HttpClient } from '../HttpClient';
import { NewUser, UserInfo } from '../models';

export class User {
  readonly apiService: HttpClient;

  constructor(apiService: HttpClient) {
    this.apiService = apiService;
  }

  createUser = async (form: NewUser) => {
    const newUser = await this.apiService.client.post<UserInfo>('/users', {
      ...form,
    });

    return newUser;
  };

  getUser = async (id: string) => {
    const newUser = await this.apiService.client.get<UserInfo>(`/users/${id}`);

    return newUser;
  };
}
