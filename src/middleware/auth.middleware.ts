// // auth.middleware.ts - Authentication Middleware

// // Import necessary types and services
// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from '../services/auth.service';

// /**
//  * Interface for extending the Express Request type
//  * Adds user information to the request object after authentication
//  */
// export interface AuthenticatedRequest extends Request {
//   user?: {
//     id: number;
//     walletAddress: string;
//     name?: string;
//     email?: string;
//     role: 'buyer' | 'seller' | 'admin';
//   };
// }

// /**
//  * Authentication Middleware
//  * Checks if the request has a valid JWT token
//  * If valid, adds user information to the request object
//  */
// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Get the authorization header
//     const authHeader = req.headers.authorization;

//     // Check if authorization header exists and has correct format
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new ReferenceError('No token provided');
//     }

//     // Extract the token from the header
//     // Format: "Bearer <token>"
//     const token = authHeader.split(' ')[1];

//     // Verify the token and decode its contents
//     const decoded = AuthService.verifyToken(token);

//     // Add user information to the request object
//     req.user = {
//       id: decoded.userId,
//       walletAddress: decoded.walletAddress,
//       role: decoded.role,
//     };

//     // Continue to the next middleware or route handler
//     next();
//   } catch (error) {
//     // Pass any errors to error handling middleware
//     next(error);
//   }
// };

// /**
//  * Role-based Access Control Middleware
//  * Checks if the authenticated user has the required role
//  * Must be used after authMiddleware
//  */
// export const requireRole = (role: string) => {
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     // Check if user exists and has the required role
//     if (!req.user || req.user.role !== role) {
//       throw new ReferenceError('Insufficient permissions');
//     }
//     // If role matches, continue to next middleware or route handler
//     next();
//   };
// };

// auth.middleware.ts - Authentication Middleware

// Import necessary types and services
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
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ReferenceError('No token provided');
    }

    // Extract the token from the header
    // Format: "Bearer <token>"
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

    // Add user information to the request object
    req.user = {
      id: decoded.userId,
      walletAddress: decoded.walletAddress,
      role: [roleObj], // Wrap in array to match session middleware
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Pass any errors to error handling middleware
    next(error);
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
