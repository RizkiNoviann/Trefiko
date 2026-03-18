import { useAuth } from '../composable/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) {
    return;
  }

  const { token, user, fetchMe, logout } = useAuth();

  if (!token.value) {
    return navigateTo('/auth/login');
  }

  if (!user.value) {
    try {
      await fetchMe();
    }
    catch {
      logout();
      return navigateTo('/auth/login');
    }
  }

  if (user.value?.role !== 'ADMIN') {
    return navigateTo('/');
  }
});
