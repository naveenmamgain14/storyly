export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface CreateStoryRequest {
  title: string;
  description?: string;
  collectionId?: string;
  items: CreateStoryItemRequest[];
}

export interface CreateStoryItemRequest {
  mediaId: string;
  type: 'IMAGE' | 'VIDEO';
  duration?: number;
  actionUrl?: string;
  actionText?: string;
  order: number;
}

export interface UpdateStoryRequest {
  title?: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  collectionId?: string;
}
