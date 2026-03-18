import { useApi } from './useApi';
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  MeResponse,
  RegisterPayload,
  UserRole,
} from '../types/api';

const TOKEN_STORAGE_KEY = 'trefiko_token';
const USER_STORAGE_KEY = 'trefiko_auth_user';

export function useAuth() {
  const api = useApi();
  const token = useCookie<string | null>('trefiko_token', {
    default: () => null,
    sameSite: 'lax',
  });
  const user = useState<AuthUser | null>('auth_user', () => null);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const restoreAuthState = () => {
    if (!import.meta.client) {
      return;
    }

    if (!token.value) {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        token.value = storedToken;
      }
    }

    if (!user.value) {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser) as AuthUser;
        }
        catch {
          sessionStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    }
  };

  const persistAuthState = (newToken: string | null, newUser: AuthUser | null) => {
    if (!import.meta.client) {
      return;
    }

    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    }
    else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (newUser) {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    }
    else {
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  restoreAuthState();

  if (token.value) {
    api.setAuthToken(token.value);
  }

  const applyAuth = (response: AuthResponse) => {
    token.value = response.token;
    user.value = response.user;
    api.setAuthToken(response.token);
    persistAuthState(response.token, response.user);
  };

  const getLandingPathByRole = (role: UserRole) => {
    return role === 'ADMIN' ? '/dashboard/home' : '/';
  };

  const register = async (payload: RegisterPayload) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await api.create<AuthResponse, RegisterPayload>('/auth/register', payload);
      applyAuth(response);
      return response;
    }
    catch (error: any) {
      errorMessage.value = error?.message || 'Register gagal';
      throw error;
    }
    finally {
      isLoading.value = false;
    }
  };

  const login = async (payload: LoginPayload) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await api.create<AuthResponse, LoginPayload>('/auth/login', payload);
      applyAuth(response);
      return response;
    }
    catch (error: any) {
      errorMessage.value = error?.message || 'Login gagal';
      throw error;
    }
    finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    api.setAuthToken(null);
    persistAuthState(null, null);
  };

  const fetchMe = async () => {
    const response = await api.get<MeResponse>('/auth/me');
    user.value = response.user;
    persistAuthState(token.value, response.user);
    return response;
  };

  const getInitials = (name: string) => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return 'U';
    }

    const firstPart = parts[0] || '';
    const lastPart = parts[parts.length - 1] || '';

    if (!firstPart) {
      return 'U';
    }

    if (parts.length === 1) {
      return firstPart.slice(0, 1).toUpperCase();
    }

    return `${firstPart.slice(0, 1)}${lastPart.slice(0, 1)}`.toUpperCase();
  };

  const userInitials = computed(() => {
    if (!user.value?.name) {
      return 'U';
    }

    return getInitials(user.value.name);
  });

  const isAuthenticated = computed(() => Boolean(token.value));

  return {
    user,
    token,
    isLoading,
    errorMessage,
    isAuthenticated,
    userInitials,
    register,
    login,
    logout,
    fetchMe,
    getLandingPathByRole,
    getInitials,
  };
}
