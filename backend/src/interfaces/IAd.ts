export enum IAdStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IAd {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  targetUrl: string;
  showOnHome: boolean;
  showOnSidebar: boolean;
  status: IAdStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdCreateInput {
  title: string;
  thumbnailUrl?: string;
  targetUrl: string;
  showOnHome: boolean;
  showOnSidebar: boolean;
}
