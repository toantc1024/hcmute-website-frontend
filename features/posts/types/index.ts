export enum PostStatus {
  DRAFT = 0,
  PENDING = 1,
  APPROVED_BY_UNIT_EDITOR = 2,
  APPROVED_BY_UNIT_LEADER = 3,
  APPROVED_BY_UNIT_ADMIN = 4,
  APPROVED_BY_SCHOOL_ADMIN = 7,
  WAITING_PUBLISH = 8,
  PUBLISHED = 9,
  REJECTED = 10,
  HIDDEN = 11,
}

export enum ContentFormat {
  PLAIN_TEXT = 0,
  HTML = 1,
  TIPTAP_JSON = 2,
}

export enum ReviewLevel {
  UNIT_EDITOR = 0,
  UNIT_LEADER = 1,
  UNIT_ADMIN = 2,
  SCHOOL_ADMIN = 5,
}

export enum ReviewSessionStatus {
  CLOSED = 0,
  OPEN = 1,
}

export enum ReviewCommentStatus {
  PENDING = 0,
  RESOLVED = 1,
}

export enum ReviewerDecision {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum AuthorType {
  OWNER = 0,
  CONTRIBUTOR = 1,
}

export enum PromotionStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum EntityStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  DELETED = -1,
}

export interface CategorySimpleView {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface TagSimpleView {
  id: string;
  name: string;
  slug: string;
}

export interface PostAuthorView {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  authorType: AuthorType;
}

export interface PostReviewerView {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  reviewLevel: ReviewLevel;
  status: ReviewerDecision;
}

export interface PostMediaView {
  id: string;
  fileId: string;
  publicUrl: string;
  title?: string;
  caption?: string;
  altText?: string;
  photoCredit?: string;
  sortOrder: number;
}

export interface PostAuditView {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: PostStatus;
  authorId: string;
  authors: PostAuthorView[];
  reviewers: PostReviewerView[];
  coverImageId?: string;
  coverImageUrl?: string;
  photoCredit?: string;
  metaTitle?: string;
  metaDescription?: string;
  extendedAttributes?: ExtendedAttributes;
  allowCloning: boolean;
  viewCount: number;
  publishedAt?: string;
  sourceOriginalId?: string;
  tenantId: string;
  createdDate: string;
  createdBy: string;
  version: number;
}

export interface PostDetailView extends PostAuditView {
  content?: string;
  contentFormat: ContentFormat;
  media: PostMediaView[];
  categories: CategorySimpleView[];
  tags: TagSimpleView[];
}

export interface PostHistoryAuditView {
  id: string;
  postId: string;
  versionNumber: number;
  action: number;
  performedBy: string;
  note?: string;
  tenantId: string;
  createdDate: string;
  createdBy: string;
  version: number;
}

export interface PostMetadataSnapshotDto {
  coverImageId?: string;
  photoCredit?: string;
  metaTitle?: string;
  metaDescription?: string;
  allowCloning?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

export interface PostHistoryDetailView extends PostHistoryAuditView {
  title?: string;
  description?: string;
  content?: string;
  contentFormat?: ContentFormat;
  metadataSnapshot?: PostMetadataSnapshotDto;
}

export interface PostReviewCommentSimpleView {
  id: string;
  content: string;
  selectedText?: string;
  anchorData?: string;
  status: ReviewCommentStatus;
}

export interface PostReviewSessionAuditView {
  id: string;
  postId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewLevel: ReviewLevel;
  status: ReviewSessionStatus;
  statusAtTime: PostStatus;
  overallNote?: string;
  tenantId: string;
  createdDate: string;
  version: number;
}

export interface PostReviewSessionDetailView extends PostReviewSessionAuditView {
  comments: PostReviewCommentSimpleView[];
}

export interface LockDto {
  postId: string;
  lockedBy?: string;
  lockedByName?: string;
  lockedAt?: string;
  expiresAt?: string;
  isLocked: boolean;
  isOwnLock: boolean;
}

export interface MediaMetadataRequest {
  fileId: string;
  title?: string;
  caption?: string;
  altText?: string;
  photoCredit?: string;
  sortOrder?: number;
}

export interface ExtendedAttributes {
  Author?: string;
  Photographer?: string;
  [key: string]: string | undefined;
}

export interface CreatePostRequest {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  contentFormat: ContentFormat;
  extendedAttributes?: ExtendedAttributes;
  allowCloning?: boolean;
  coverImageId?: string;
  photoCredit?: string;
  metaTitle?: string;
  metaDescription?: string;
  mediaMetadata?: MediaMetadataRequest[];
  categoryIds?: string[];
  tagIds?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  content?: string;
  contentFormat?: ContentFormat;
  extendedAttributes?: ExtendedAttributes;
  allowCloning?: boolean;
  coverImageId?: string;
  photoCredit?: string;
  metaTitle?: string;
  metaDescription?: string;
  mediaMetadata?: MediaMetadataRequest[];
  categoryIds?: string[];
  tagIds?: string[];
  version: number;
}

export interface SubmitPostRequest {
  version: number;
}

export interface AssignReviewersRequest {
  userIds: string[];
  level: ReviewLevel;
}

export interface AssignContributorsRequest {
  userIds: string[];
}

export interface ApprovePostRequest {
  comment: string;
  publishedAt?: string;
  version: number;
}

export interface PostReviewCommentRequest {
  selectedText?: string;
  anchorData?: string;
  content: string;
}

export interface RejectPostRequest {
  comment: string;
  highlightComments?: PostReviewCommentRequest[];
  rejectedToLevel?: ReviewLevel | null;
}

export interface ClonePostInternalRequest {
  newTitle: string;
  newSlug: string;
}

export interface CloneCrossTenantRequest {
  sourcePostId: string;
  sourceTenantId: string;
  newTitle: string;
  newSlug: string;
}

export interface PostFilters {
  title?: string;
  status?: PostStatus;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface KeysetPaginationParams {
  cursor?: string;
  size?: number;
  sort?: string;
}

export interface KeysetPaginationResponse<T> {
  content: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface PostsQueryParams extends PostFilters, KeysetPaginationParams {}

export interface PresignedUploadRequest {
  fileName: string;
  fileSize: number;
}

export interface PresignedUrlDto {
  url: string;
  tempPath: string;
  expiresIn: number;
}

export interface PresignedUploadBatchRequest {
  files: PresignedUploadRequest[];
}

export interface PresignedUrlBatchDto {
  items: PresignedUrlDto[];
}

export interface ConfirmUploadRequest {
  tempPath: string;
  checksum: string;
}

export interface ConfirmUploadBatchRequest {
  items: ConfirmUploadRequest[];
}

export interface FileDto {
  id: string;
  fileName: string;
  fileType: string;
  publicUrl: string;
  isSystem: boolean;
  tenantId: string;
  createdDate: string;
  createdBy: string;
  version: number;
}

export interface CategoryAuditView {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  tenantId: string;
  createdDate: string;
  createdBy: string;
  version: number;
}

export interface TagAuditView {
  id: string;
  name: string;
  slug: string;
  tenantId: string;
  createdDate: string;
  createdBy: string;
  version: number;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  version: number;
}

export interface CreateTagRequest {
  name: string;
  slug: string;
}

export interface UpdateTagRequest {
  name: string;
  version: number;
}

export interface PostPromotionAuditView {
  id: string;
  sourcePostId: string;
  sourceTenantId: string;
  requesterId: string;
  status: PromotionStatus;
  adminComment?: string;
  createdDate: string;
  createdBy: string;
  version: number;
}

export interface ApprovePostPromotionRequest {
  newTitle: string;
  newSlug: string;
  adminComment?: string;
}

export interface RejectPostPromotionRequest {
  adminComment?: string;
  highlightComments?: PostReviewCommentRequest[];
}

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  [PostStatus.DRAFT]: "Nháp",
  [PostStatus.PENDING]: "Chờ duyệt",
  [PostStatus.APPROVED_BY_UNIT_EDITOR]: "Biên tập viên duyệt",
  [PostStatus.APPROVED_BY_UNIT_LEADER]: "Trưởng đơn vị duyệt",
  [PostStatus.APPROVED_BY_UNIT_ADMIN]: "Quản trị đơn vị duyệt",
  [PostStatus.APPROVED_BY_SCHOOL_ADMIN]: "Quản trị trường duyệt",
  [PostStatus.WAITING_PUBLISH]: "Chờ xuất bản",
  [PostStatus.PUBLISHED]: "Đã xuất bản",
  [PostStatus.REJECTED]: "Từ chối",
  [PostStatus.HIDDEN]: "Ẩn",
};

export const CONTENT_FORMAT_LABELS: Record<ContentFormat, string> = {
  [ContentFormat.PLAIN_TEXT]: "Văn bản thuần",
  [ContentFormat.HTML]: "HTML",
  [ContentFormat.TIPTAP_JSON]: "Tiptap JSON",
};

export function getPostStatusLabel(status: PostStatus): string {
  return POST_STATUS_LABELS[status] || `Status ${status}`;
}

export function getContentFormatLabel(format: ContentFormat): string {
  return CONTENT_FORMAT_LABELS[format] || `Format ${format}`;
}
