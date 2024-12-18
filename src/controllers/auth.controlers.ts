import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { walletAddress } = req.body;
            
            if (!walletAddress) {
                throw new Error('Wallet address is required');
            }

            const token = await AuthService.authenticateUser(walletAddress);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }
}