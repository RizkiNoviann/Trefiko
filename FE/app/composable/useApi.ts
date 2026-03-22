import axios, { type AxiosRequestConfig } from 'axios';

export function useApi() {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('trefiko_token', {
    default: () => null,
    sameSite: 'lax',
  });

  const apiClient = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token.value) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token.value}`;
  }

  const setAuthToken = (newToken: string | null) => {
    token.value = newToken;

    if (newToken) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      return;
    }

    delete apiClient.defaults.headers.common.Authorization;
  };

  const request = async <T>(requestConfig: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient.request<T>(requestConfig);
      return response.data;
    }
    catch (error: any) {
      // Fallback to backend default URL when current base URL accidentally points to Nuxt app.
      const shouldFallback =
        error?.response?.status === 404
        && typeof requestConfig.url === 'string'
        && requestConfig.url.startsWith('/');

      if (shouldFallback) {
        const fallbackClient = axios.create({
          baseURL: 'http://localhost:3001',
          headers: {
            'Content-Type': 'application/json',
            ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
          },
        });

        try {
          const fallbackResponse = await fallbackClient.request<T>(requestConfig);
          return fallbackResponse.data;
        }
        catch {
          // Ignore fallback error and throw original normalized API error below.
        }
      }

      const message =
        error?.response?.data?.message || error?.message || 'Unknown API error';
      throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  const list = <T>(url: string, params?: Record<string, unknown>, requestConfig?: AxiosRequestConfig) =>
    request<T>({
      ...requestConfig,
      method: 'GET',
      url,
      params,
    });

  const get = <T>(url: string, requestConfig?: AxiosRequestConfig) =>
    request<T>({
      ...requestConfig,
      method: 'GET',
      url,
    });

  const create = <TResponse, TPayload = Record<string, unknown>>(
    url: string,
    payload: TPayload,
    requestConfig?: AxiosRequestConfig,
  ) =>
    request<TResponse>({
      ...requestConfig,
      method: 'POST',
      url,
      data: payload,
    });

  const update = <TResponse, TPayload = Record<string, unknown>>(
    url: string,
    payload: TPayload,
    requestConfig?: AxiosRequestConfig,
  ) =>
    request<TResponse>({
      ...requestConfig,
      method: 'PUT',
      url,
      data: payload,
    });

  const patch = <TResponse, TPayload = Record<string, unknown>>(
    url: string,
    payload: TPayload,
    requestConfig?: AxiosRequestConfig,
  ) =>
    request<TResponse>({
      ...requestConfig,
      method: 'PATCH',
      url,
      data: payload,
    });

  const remove = <T>(url: string, requestConfig?: AxiosRequestConfig) =>
    request<T>({
      ...requestConfig,
      method: 'DELETE',
      url,
    });

  return {
    list,
    get,
    create,
    update,
    patch,
    remove,
    setAuthToken,
  };
}
