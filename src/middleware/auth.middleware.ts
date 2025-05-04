import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { Role } from '../modules/auth/entities/role.entity';

/**
 * Interface for extending the Express Request type
 * Adds user information to the request object after authentication
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    walletAddress: string;
    name?: string;
    email?: string;
    role: Role[];
  };
  fileProvider?: 'cloudinary' | 's3';
  fileType?: string;
}

/**
 * Authentication Middleware
 * Checks if the request has a valid JWT token
 * If valid, adds user information to the request object
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token is missing' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify the token and decode its contents
    const decoded = AuthService.verifyToken(token);

    // Create a Role object from the decoded role string
    const roleObj: Role = {
      id: 0, // This will be replaced by the actual role ID in your application
      name: decoded.role as 'buyer' | 'seller' | 'admin',
      userRoles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    req.user = {
      id: decoded.userId,
      walletAddress: decoded.walletAddress,
      role: [roleObj], // Wrap in array to match session middleware
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Role-based Access Control Middleware
 * Checks if the authenticated user has the required role
 * Must be used after authMiddleware
 */
export const requireRole = (roleName: 'buyer' | 'seller' | 'admin') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user exists and has the required role
    if (!req.user || !req.user.role.some((role) => role.name === roleName)) {
      throw new ReferenceError('Insufficient permissions');
    }
    // If role matches, continue to next middleware or route handler
    next();
  };
};
