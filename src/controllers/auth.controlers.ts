// Import necessary types and services
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../modules/auth/dto/auth.dto';

/**
 * Authentication Controller
 * Handles login requests and user authentication
 */
export class AuthController {
  /**
   * Login Handler
   * Processes user login attempts using wallet addresses
   * Returns a JWT token if authentication is successful
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;

      // Authenticate user and get JWT token
      const token = await AuthService.authenticateUser(loginDto.walletAddress);
      if (!token) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid wallet address or authentication failed' });
        return;
      }
      // Send token back to client
      res.status(200).json({ token });
    } catch (error) {
      // Pass any errors to error handling middleware
      next(error);
    }
  }
}
