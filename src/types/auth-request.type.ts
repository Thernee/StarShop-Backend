import { Request } from 'express';
import { UserRole } from '../modules/users/enums/user-role.enum';

export interface AppUser {
  id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  role: UserRole[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user?: AppUser;
  fileProvider?: 'cloudinary' | 's3';
  fileType?: string;
}
