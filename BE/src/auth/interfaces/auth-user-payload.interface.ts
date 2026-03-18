export interface AuthUserPayload {
  sub: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}
