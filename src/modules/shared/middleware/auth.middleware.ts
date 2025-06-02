import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../services/role.service';

/**
 * Interface for extending the Express Request type
 * Adds user information to the request object after authentication
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    walletAddress: string;
    name?: string;
    email?: string;
    role: string[];
    createdAt?: Date;
    updatedAt?: Date;
  };
  fileProvider?: 'cloudinary' | 's3';
  fileType?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No authorization header');
      }

      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer') {
        throw new UnauthorizedException('Invalid authorization type');
      }

      const decoded = this.jwtService.verify(token);
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }

      const userRoles = await this.roleService.getUserRoles(decoded.id);
      req.user = {
        ...decoded,
        role: userRoles,
      };

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

/**
 * Role-based Access Control Middleware
 * Checks if the authenticated user has the required role
 * Must be used after authMiddleware
 */
export const requireRole = (
  roleName: 'buyer' | 'seller' | 'admin'
): ((req: AuthenticatedRequest, res: Response, next: NextFunction) => void) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user exists and has the required role
    if (!req.user || !req.user.role.includes(roleName)) {
      throw new ReferenceError('Insufficient permissions');
    }
    // If role matches, continue to next middleware or route handler
    next();
  };
};
