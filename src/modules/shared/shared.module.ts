import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleService } from './services/role.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, UserRole]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [RoleService, AuthGuard, RoleGuard],
  exports: [RoleService, AuthGuard, RoleGuard, JwtModule],
})
export class SharedModule {}
