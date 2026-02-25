export enum IPublishStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface IVideo {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string | null;
  status: IPublishStatus;
  uploadedBy: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoCreateInput {
  title: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  status?: IPublishStatus;
  uploadedBy: string;
}

export interface IVideoUpdateInput {
  title?: string;
  tags?: string[];
  thumbnailUrl?: string;
  status?: IPublishStatus;
}

export interface IVideoQuery {
  search?: string;
  tags?: string[];
  status?: IPublishStatus;
  uploadedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface IVideoPaginated {
  videos: IVideo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IVideoSuggestion {
  videos: IVideo[];
  reason: 'tag_match' | 'title_match' | 'latest' | 'trending';
}
