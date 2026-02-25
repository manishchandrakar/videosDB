import { Response, NextFunction } from 'express';
import { videoService } from '../services/video.service';
import { storageService } from '../services/storage.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import {
  IAuthRequest,
  IFileRequest,
  IPublishStatus,
  IUserRole,
  IVideoQuery,
  IVideoUpdateInput,
} from '../interfaces';
import { CONSTANTS } from '../constants';

export const getVideos = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const query = req.query as unknown as IVideoQuery;

    if (!req.user) {
      // Public: only published videos
      query.status = IPublishStatus.PUBLISHED;
    } else if (req.user.role === IUserRole.MINI_ADMIN) {
      // Mini admin: only their own videos (all statuses)
      query.uploadedBy = req.user.userId;
    }
    // Super admin: no restrictions — sees everything

    const result = await videoService.findAll(query);
    ApiResponse.ok(res, 'Videos retrieved', result);
  }
);

export const getVideoBySlug = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { slug } = req.params as { slug: string };
    const video = await videoService.findBySlug(slug);
    ApiResponse.ok(res, 'Video retrieved', video);
  }
);

export const getVideoById = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const video = await videoService.findById(id);
    ApiResponse.ok(res, 'Video retrieved', video);
  }
);

export const getVideoSuggestions = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const suggestions = await videoService.getSuggestions(id);
    ApiResponse.ok(res, 'Suggestions retrieved', suggestions);
  }
);

export const uploadVideo = asyncHandler(
  async (req: IFileRequest, res: Response, _next: NextFunction): Promise<void> => {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;

    if (!files?.['video']?.[0]) {
      throw ApiError.badRequest('Video file is required');
    }

    const videoFile = files['video'][0];
    const thumbnailFile = files['thumbnail']?.[0];
    const userId = req.user!.userId;

    const videoFileName = storageService.buildFileName(videoFile.originalname, `vid-${userId}`);
    const videoUpload = await storageService.uploadFile(
      videoFile.path,
      'videos',
      videoFileName
    );
    storageService.cleanupTempFile(videoFile.path);

    let thumbnailUrl: string | undefined;
    if (thumbnailFile) {
      const thumbFileName = storageService.buildFileName(
        thumbnailFile.originalname,
        `thumb-${userId}`
      );
      const thumbUpload = await storageService.uploadFile(
        thumbnailFile.path,
        'thumbnails',
        thumbFileName
      );
      storageService.cleanupTempFile(thumbnailFile.path);
      thumbnailUrl = thumbUpload.url;
    }

    const body = req.body as {
      title: string;
      tags?: string[];
      tagsRaw?: string;
      status?: IPublishStatus;
    };

    const tags: string[] = Array.isArray(body.tags)
      ? body.tags
      : String(body.tagsRaw ?? body.tags ?? '')
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0);

    const video = await videoService.create({
      title: body.title,
      tags,
      videoUrl: videoUpload.url,
      thumbnailUrl,
      status: body.status ?? IPublishStatus.DRAFT,
      uploadedBy: userId,
    });

    ApiResponse.created(res, 'Video uploaded successfully', video);
  }
);

export const updateVideo = asyncHandler(
  async (req: IFileRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const isSuperAdmin = req.user!.role === IUserRole.SUPER_ADMIN;

    const video = await videoService.update(
      id,
      req.body as IVideoUpdateInput,
      req.user!.userId,
      isSuperAdmin
    );
    ApiResponse.ok(res, 'Video updated successfully', video);
  }
);

export const deleteVideo = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const isSuperAdmin = req.user!.role === IUserRole.SUPER_ADMIN;

    await videoService.delete(id, req.user!.userId, isSuperAdmin);
    ApiResponse.noContent(res);
  }
);

export const togglePublishStatus = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const video = await videoService.toggleStatus(id);
    ApiResponse.ok(
      res,
      `Video ${video.status === IPublishStatus.PUBLISHED ? 'published' : 'unpublished'}`,
      video
    );
  }
);

export const getDashboard = asyncHandler(
  async (_req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const stats = await videoService.getDashboardStats();
    ApiResponse.ok(res, 'Dashboard stats', stats);
  }
);

export const searchVideos = asyncHandler(
  async (req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { q, tags } = req.query as { q?: string; tags?: string };

    const query: IVideoQuery = {
      search: q,
      tags: tags ? tags.split(',').map((t) => t.trim()) : undefined,
      status: IPublishStatus.PUBLISHED,
      limit: CONSTANTS.DEFAULT_LIMIT,
    };

    const result = await videoService.findAll(query);
    ApiResponse.ok(res, 'Search results', result);
  }
);
