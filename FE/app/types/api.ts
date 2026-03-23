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

export type PaymentMethod = 'COD' | 'DIRECT';
export type AdminOrderStatus = 'PENDING' | 'PROCESS' | 'COMPLETED';
export type UserOrderStatus = 'PROCESS' | 'COMPLETED';

export interface OrderItem {
  id: string;
  menuId: string;
  quantity: number;
  temperature?: 'hot' | 'iced' | null;
  unitPrice: number;
  lineTotal: number;
  menu: MenuItem;
}

export interface Order {
  id: string;
  code: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  payment: PaymentMethod;
  status: AdminOrderStatus;
  note?: string | null;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  userStatus?: UserOrderStatus;
}

export interface CheckoutPayload {
  payment: PaymentMethod;
  note?: string;
  items: Array<{
    menuId: string;
    quantity: number;
    temperature?: 'hot' | 'iced';
  }>;
}

export interface CheckoutResponse extends ApiMessageResponse {
  order: Order;
}

export interface OrdersResponse extends ApiMessageResponse {
  orders: Order[];
}

export interface OrderResponse extends ApiMessageResponse {
  order: Order;
}

export interface Review {
  id: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
  };
  order?: {
    id: string;
    code: string;
  };
}

export interface CreateReviewPayload {
  orderId: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse extends ApiMessageResponse {
  review: Review;
}

export interface PublicReviewsResponse extends ApiMessageResponse {
  reviews: Review[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AdminReviewsResponse extends ApiMessageResponse {
  reviews: Review[];
}
