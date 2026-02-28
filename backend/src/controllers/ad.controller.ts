import { Request, Response, NextFunction } from 'express';
import { adService } from '../services/ad.service';
import { storageService } from '../services/storage.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { IFileRequest } from '../interfaces';

export const getActiveAds = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const placement = (req.query.placement as string) === 'sidebar' ? 'sidebar' : 'home';
    const ads = await adService.getActive(placement);
    ApiResponse.ok(res, 'Active ads retrieved', ads);
  }
);

export const getAllAds = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const ads = await adService.findAll();
    ApiResponse.ok(res, 'Ads retrieved', ads);
  }
);

export const createAd = asyncHandler(
  async (req: IFileRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { title, targetUrl, showOnHome, showOnSidebar } = req.body as {
      title: string;
      targetUrl: string;
      showOnHome?: string;
      showOnSidebar?: string;
    };

    if (!title || !targetUrl) {
      throw ApiError.badRequest('title and targetUrl are required');
    }

    const thumbnailFile = (req.files as Record<string, Express.Multer.File[]> | undefined)?.['thumbnail']?.[0]
      ?? (req.file as Express.Multer.File | undefined);

    let thumbnailUrl: string | undefined;
    if (thumbnailFile) {
      const fileName = storageService.buildFileName(thumbnailFile.originalname, 'ad');
      const result = await storageService.uploadFile(thumbnailFile.path, 'images', fileName);
      storageService.cleanupTempFile(thumbnailFile.path);
      thumbnailUrl = result.url;
    }

    const ad = await adService.create({
      title,
      targetUrl,
      thumbnailUrl,
      showOnHome: showOnHome !== 'false' && showOnHome !== '0',
      showOnSidebar: showOnSidebar === 'true' || showOnSidebar === '1',
    });

    ApiResponse.created(res, 'Ad created', ad);
  }
);

export const toggleAdStatus = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    const ad = await adService.toggleStatus(id);
    ApiResponse.ok(res, 'Ad status updated', ad);
  }
);

export const deleteAd = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params as { id: string };
    await adService.delete(id);
    ApiResponse.ok(res, 'Ad deleted');
  }
);
