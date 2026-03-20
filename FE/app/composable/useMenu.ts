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

    const response = await axios.post<MenuImageUploadResponse>(
      `${config.public.apiBaseUrl}/menus/upload-image`,
      formData,
      {
        headers: {
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      },
    );

    return response.data;
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
