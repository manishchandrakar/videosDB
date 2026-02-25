import { Prisma } from '../generated/prisma';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { generateUniqueSlug } from '../utils/slugify';
import { ERROR_MESSAGES, CONSTANTS } from '../constants';
import {
  IVideo,
  IVideoCreateInput,
  IVideoUpdateInput,
  IVideoQuery,
  IVideoPaginated,
  IVideoSuggestion,
  IPublishStatus,
} from '../interfaces';

const mapVideo = (v: {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string | null;
  status: string;
  uploadedBy: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}): IVideo => ({ ...v, status: v.status as IPublishStatus });

export class VideoService {
  async create(input: IVideoCreateInput): Promise<IVideo> {
    const slug = generateUniqueSlug(input.title);

    const video = await prisma.video.create({
      data: {
        title: input.title,
        slug,
        tags: input.tags,
        videoUrl: input.videoUrl,
        thumbnailUrl: input.thumbnailUrl ?? null,
        status: input.status ?? 'DRAFT',
        uploadedBy: input.uploadedBy,
      },
    });

    return mapVideo(video);
  }

  async findAll(query: IVideoQuery): Promise<IVideoPaginated> {
    const {
      search,
      tags,
      status,
      uploadedBy,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const page = Number(query.page ?? CONSTANTS.DEFAULT_PAGE);
    const limit = Math.min(Number(query.limit ?? CONSTANTS.DEFAULT_LIMIT), CONSTANTS.MAX_LIMIT);

    const where: Prisma.VideoWhereInput = {
      ...(status && { status }),
      ...(uploadedBy && { uploadedBy }),
      ...(search && {
        OR: [{ title: { contains: search, mode: 'insensitive' } }, { tags: { hasSome: [search] } }],
      }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
    };

    const [videos, total] = await prisma.$transaction([
      prisma.video.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.video.count({ where }),
    ]);

    return {
      videos: videos.map(mapVideo),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<IVideo> {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('Video'));
    return mapVideo(video);
  }

  async findBySlug(slug: string): Promise<IVideo> {
    const video = await prisma.video.findUnique({ where: { slug } });
    if (!video) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('Video'));

    await prisma.video.update({ where: { id: video.id }, data: { views: { increment: 1 } } });

    return mapVideo({ ...video, views: video.views + 1 });
  }

  async update(
    id: string,
    input: IVideoUpdateInput,
    uploadedBy: string,
    isSuperAdmin: boolean
  ): Promise<IVideo> {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('Video'));

    if (!isSuperAdmin && video.uploadedBy !== uploadedBy) {
      throw ApiError.forbidden(ERROR_MESSAGES.FORBIDDEN);
    }

    const updated = await prisma.video.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.tags && { tags: input.tags }),
        ...(input.thumbnailUrl !== undefined && { thumbnailUrl: input.thumbnailUrl }),
        ...(input.status && { status: input.status }),
      },
    });

    return mapVideo(updated);
  }

  async delete(id: string, uploadedBy: string, isSuperAdmin: boolean): Promise<void> {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('Video'));

    if (!isSuperAdmin && video.uploadedBy !== uploadedBy) {
      throw ApiError.forbidden(ERROR_MESSAGES.FORBIDDEN);
    }

    await prisma.video.delete({ where: { id } });
  }

  async toggleStatus(id: string): Promise<IVideo> {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('Video'));

    const newStatus = video.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const updated = await prisma.video.update({ where: { id }, data: { status: newStatus } });
    return mapVideo(updated);
  }

  async getSuggestions(videoId: string): Promise<IVideoSuggestion> {
    const source = await prisma.video.findUnique({ where: { id: videoId } });
    if (!source) throw ApiError.notFound(ERROR_MESSAGES.NOT_FOUND('Video'));

    // Try tag match first
    if (source.tags.length > 0) {
      const tagMatches = await prisma.video.findMany({
        where: {
          id: { not: videoId },
          status: 'PUBLISHED',
          tags: { hasSome: source.tags },
        },
        orderBy: { views: 'desc' },
        take: CONSTANTS.SUGGESTION_LIMIT,
      });

      if (tagMatches.length > 0) {
        return { videos: tagMatches.map(mapVideo), reason: 'tag_match' };
      }
    }

    // Fallback: title keyword match
    const titleWords = source.title.split(' ').filter((w) => w.length > 3);
    if (titleWords.length > 0) {
      const titleMatches = await prisma.video.findMany({
        where: {
          id: { not: videoId },
          status: 'PUBLISHED',
          title: { contains: titleWords[0], mode: 'insensitive' },
        },
        orderBy: { views: 'desc' },
        take: CONSTANTS.SUGGESTION_LIMIT,
      });

      if (titleMatches.length > 0) {
        return { videos: titleMatches.map(mapVideo), reason: 'title_match' };
      }
    }

    // Final fallback: latest videos
    const latest = await prisma.video.findMany({
      where: { id: { not: videoId }, status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: CONSTANTS.SUGGESTION_LIMIT,
    });

    return { videos: latest.map(mapVideo), reason: 'latest' };
  }

  async getDashboardStats(): Promise<{
    totalVideos: number;
    publishedVideos: number;
    draftVideos: number;
    totalViews: number;
    recentUploads: IVideo[];
  }> {
    const [totalVideos, publishedVideos, draftVideos, viewsAgg, recentUploads] =
      await prisma.$transaction([
        prisma.video.count(),
        prisma.video.count({ where: { status: 'PUBLISHED' } }),
        prisma.video.count({ where: { status: 'DRAFT' } }),
        prisma.video.aggregate({ _sum: { views: true } }),
        prisma.video.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    return {
      totalVideos,
      publishedVideos,
      draftVideos,
      totalViews: viewsAgg._sum.views ?? 0,
      recentUploads: recentUploads.map(mapVideo),
    };
  }
}

export const videoService = new VideoService();
