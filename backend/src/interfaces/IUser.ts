export enum IUserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MINI_ADMIN = 'MINI_ADMIN',
  USER = 'USER',
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: IUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserPublic = Omit<IUser, 'password'>;

export interface IUserCreateInput {
  username: string;
  email: string;
  password: string;
  role?: IUserRole;
}
