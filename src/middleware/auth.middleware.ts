// auth.middleware.ts - Authentication Middleware

// Import necessary types and services
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

/**
 * Interface for extending the Express Request type
 * Adds user information to the request object after authentication
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

/**
 * Authentication Middleware
 * Checks if the request has a valid JWT token
 * If valid, adds user information to the request object
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token is missing' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };

    req.user = {
      id: decoded.id,
      role: decoded.role,
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
export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user exists and has the required role
    if (!req.user || req.user.role !== role) {
      throw new ReferenceError('Insufficient permissions');
    }
    // If role matches, continue to next middleware or route handler
    next();
  };
};
