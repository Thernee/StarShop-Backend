import { AppDataSource } from '../../../config/database';
import { User } from '../entities/user.entity';
import { BadRequestError } from '../../../utils/errors';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return user;
  }

  async updateUser(id: string, data: { name?: string; email?: string }): Promise<User> {
    const user = await this.getUserById(id);

    if (data.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestError('Email already in use');
      }
      user.email = data.email;
    }

    if (data.name) {
      user.name = data.name;
    }

    return this.userRepository.save(user);
  }

  async getUserOrders(id: string): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['orders'],
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user.orders;
  }

  async getUserWishlist(id: string): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['wishlist'],
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user.wishlist;
  }
}
