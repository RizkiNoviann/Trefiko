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

export type MenuCategory = 'COFFEE' | 'NON_COFFEE' | 'SNACK';

export interface MenuItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: MenuCategory;
  price: number;
  status: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenusResponse extends ApiMessageResponse {
  menus: MenuItem[];
}

export interface MenuResponse extends ApiMessageResponse {
  menu: MenuItem;
}

export interface MenuPayload {
  image: string;
  title: string;
  description: string;
  category: MenuCategory;
  price: number;
  status: boolean;
  favorite: boolean;
}

export interface MenuImageUploadResponse extends ApiMessageResponse {
  image: string;
  filename: string;
}
