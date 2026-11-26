import { httpClient } from '@core/api/httpClient';
import type { AuthUser } from './authStore';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<TokenResponse> {
    const { data } = await httpClient.post<TokenResponse>('/auth/login', payload);
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await httpClient.get<AuthUser>('/auth/me');
    return data;
  },
};
