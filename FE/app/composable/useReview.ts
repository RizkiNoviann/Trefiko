import { useApi } from './useApi';
import type {
  AdminReviewsResponse,
  ApiMessageResponse,
  CreateReviewPayload,
  PublicReviewsResponse,
  ReviewResponse,
} from '~/types/api';

export function useReview() {
  const api = useApi();

  const createReview = async (payload: CreateReviewPayload) => {
    return api.create<ReviewResponse, CreateReviewPayload>('/reviews', payload);
  };

  const listPublicReviews = async (cursor?: string, limit = 6) => {
    return api.list<PublicReviewsResponse>('/reviews/public', {
      cursor,
      limit,
    });
  };

  const listAdminReviews = async () => {
    return api.get<AdminReviewsResponse>('/reviews/admin');
  };

  const deleteReviewByAdmin = async (id: string) => {
    return api.remove<ApiMessageResponse>(`/reviews/${id}`);
  };

  return {
    createReview,
    listPublicReviews,
    listAdminReviews,
    deleteReviewByAdmin,
  };
}
