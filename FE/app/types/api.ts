export type UserRole = 'ADMIN' | 'USER';

export interface ApiMessageResponse {
  message: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse extends ApiMessageResponse {
  token: string;
  user: AuthUser;
}

export interface MeResponse extends ApiMessageResponse {
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}
