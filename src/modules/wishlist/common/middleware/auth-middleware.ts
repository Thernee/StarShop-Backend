import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}
import { verify } from 'jsonwebtoken';

export const AuthGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as AuthenticatedRequest).user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
