import { Request } from 'express';
import { User } from '../entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        walletAddress: string;
        role: User['role'];
      };
    }
  }
} 