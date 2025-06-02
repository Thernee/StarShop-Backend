import { Request } from 'express';
import { Role } from '../../../auth/entities/role.entity';

export interface AuthRequest extends Request {
  user: {
    id: string | number;
    walletAddress: string;
    name?: string;
    email?: string;
    role: Role[];
    createdAt?: Date;
    updatedAt?: Date;
  };
}
