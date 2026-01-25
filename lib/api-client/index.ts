export { apiClient, publicApiClient, setAuthHandlers } from './axios-instance';
export { API_CONFIG } from './config';

export { authApi, type TokenResponse, type ExchangeCodeRequest, type RefreshTokenRequest } from './endpoints/auth';
export { usersApi, type UserProfile, type UpdateProfileRequest } from './endpoints/users';
export {
  postsApi,
  type PostAuthor,
  type PostCategory,
  type PostTag,
  type PostMedia,
  type PostDetailView,
  type PostAuditView,
  type KeysetPaginationResponse,
  type PostsQueryParams,
} from './endpoints/posts';
export {
  categoriesApi,
  type CategoryView,
  type CategoriesQueryParams,
} from './endpoints/categories';
export {
  tagsApi,
  type TagView,
  type TagsQueryParams,
} from './endpoints/tags';

export type { ApiResponse, ApiError, PaginatedResponse, PaginationParams } from './types';
