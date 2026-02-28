import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { storageService } from './storage.service';
import { IAd, IAdCreateInput, IAdStatus } from '../interfaces';

const mapAd = (a: {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  targetUrl: string;
  showOnHome: boolean;
  showOnSidebar: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): IAd => ({ ...a, status: a.status as IAdStatus });

export class AdService {
  async create(input: IAdCreateInput): Promise<IAd> {
    const ad = await prisma.advertisement.create({
      data: {
        title: input.title,
        thumbnailUrl: input.thumbnailUrl ?? null,
        targetUrl: input.targetUrl,
        showOnHome: input.showOnHome,
        showOnSidebar: input.showOnSidebar,
      },
    });
    return mapAd(ad);
  }

  async findAll(): Promise<IAd[]> {
    const ads = await prisma.advertisement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return ads.map(mapAd);
  }

  async getActive(placement: 'home' | 'sidebar'): Promise<IAd[]> {
    const where =
      placement === 'home'
        ? { status: 'ACTIVE' as const, showOnHome: true }
        : { status: 'ACTIVE' as const, showOnSidebar: true };

    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return ads.map(mapAd);
  }

  async toggleStatus(id: string): Promise<IAd> {
    const existing = await prisma.advertisement.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Ad not found');

    const newStatus = existing.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = await prisma.advertisement.update({
      where: { id },
      data: { status: newStatus },
    });
    return mapAd(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await prisma.advertisement.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound('Ad not found');

    await prisma.advertisement.delete({ where: { id } });

    if (existing.thumbnailUrl) {
      const parts = existing.thumbnailUrl.split('/');
      const fileName = parts[parts.length - 1];
      storageService.deleteFile('images', fileName).catch(() => {});
    }
  }
}

export const adService = new AdService();
