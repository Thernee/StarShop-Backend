import jwt from 'jsonwebtoken';
import AppDataSource  from '../config/ormconfig';
import { User } from '../entities/User';
//import { UnauthorizedError } from '../utils/errors';

export class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly JWT_EXPIRES_IN = '24h';

    static async authenticateUser(walletAddress: string): Promise<string> {
        const userRepository = AppDataSource.getRepository(User);
        
        let user = await userRepository.findOne({ where: { walletAddress } });
        
        if (!user) {
            user = userRepository.create({ walletAddress });
            await userRepository.save(user);
        }

        const token = jwt.sign(
            { 
                userId: user.id,
                walletAddress: user.walletAddress,
                role: user.role 
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );

        return token;
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new ReferenceError('Invalid token');
        }
    }
}