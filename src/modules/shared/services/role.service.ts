import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async getUserRoles(userId: string): Promise<string[]> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.userRoles', 'userRole')
      .where('userRole.userId = :userId', { userId })
      .getMany();

    return roles.map((role) => role.name);
  }

  async assignRoleToUser(userId: string, roleName: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'userRoles')
      .of(role)
      .add({ userId });
  }

  async removeRoleFromUser(userId: string, roleName: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'userRoles')
      .of(role)
      .remove({ userId });
  }
}
