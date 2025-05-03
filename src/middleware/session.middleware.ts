import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/SessionService';
import AppDataSource from '../config/ormconfig';
import { UnauthorizedException } from '@nestjs/common';

const sessionService = new SessionService(AppDataSource);

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const session = await sessionService.validateSession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // // Attach user to request
    // req.user = {
    //   id: session.user.id,
    //   // walletAddress: session.user.walletAddress,
    //   role: session.user.userRoles[0].role.toString() 
    // };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};
