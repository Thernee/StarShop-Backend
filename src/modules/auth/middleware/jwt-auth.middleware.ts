import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../../../config';
import { UnauthorizedError } from '../../../utils/errors';
import { AppDataSource } from '../../../config/database';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../../types/role';

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Invalid token format');
    }

    const decoded = verify(token, config.jwtSecret) as { id: string; email: string };
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(decoded.id) } });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = {
      id: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      name: user.name,
      role: user.userRoles.map((ur) => ur.role.name as Role),
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  }
};
