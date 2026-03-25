import { useApi } from './useApi';
import axios from 'axios';
import type {
  MenuImageUploadResponse,
  MenuPayload,
  MenuResponse,
  MenusResponse,
} from '../types/api';

export function useMenu() {
  const api = useApi();
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('trefiko_token', {
    default: () => null,
    sameSite: 'lax',
  });

  const listMenus = async () => {
    return api.list<MenusResponse>('/menus');
  };

  const getMenu = async (id: string) => {
    return api.get<MenuResponse>(`/menus/${id}`);
  };

  const createMenu = async (payload: MenuPayload) => {
    return api.create<MenuResponse, MenuPayload>('/menus', payload);
  };

  const updateMenu = async (id: string, payload: Partial<MenuPayload>) => {
    return api.update<MenuResponse, Partial<MenuPayload>>(`/menus/${id}`, payload);
  };

  const deleteMenu = async (id: string) => {
    return api.remove<{ message: string }>(`/menus/${id}`);
  };

  const uploadMenuImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post<MenuImageUploadResponse>(
        `${config.public.apiBaseUrl}/menus/upload-image`,
        formData,
        {
          headers: {
            ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
          },
          timeout: 30000,
        },
      );

      return response.data;
    }
    catch (error: any) {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      if (status === 503) {
        throw new Error('Upload gambar sedang bermasalah di server. Coba ulang beberapa saat lagi.');
      }

      throw new Error(backendMessage || 'Gagal upload gambar menu');
    }
  };

  return {
    listMenus,
    getMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    uploadMenuImage,
  };
}
