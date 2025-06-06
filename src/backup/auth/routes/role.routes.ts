import { Router, Request, Response, NextFunction } from 'express';
import { RoleController } from '../../../modules/auth/controllers/role.controller';
import { RoleService } from '../../../modules/auth/services/role.service';
import { jwtAuthMiddleware } from '../../../modules/auth/middleware/jwt-auth.middleware';
import { authorizeRoles } from '../../../modules/auth/middleware/authorize-roles.middleware';
import { Role } from '../../../modules/auth/entities/role.entity';
import { UserRole } from '../../../modules/auth/entities/user-role.entity';
import AppDataSource from '../../../config/ormconfig';
import { Role as RoleEnum } from '../../../types/role';

// Define proper middleware type that matches Express's expectations
type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

const router = Router();
const roleService = new RoleService(
  AppDataSource.getRepository(Role),
  AppDataSource.getRepository(UserRole)
);
const roleController = new RoleController(roleService);

// Apply JWT auth middleware to all routes
router.use(jwtAuthMiddleware as unknown as ExpressMiddleware);

// Assign role to user (admin only)
router.post(
  '/assign-role',
  authorizeRoles([RoleEnum.ADMIN]) as unknown as ExpressMiddleware,
  roleController.assignRole.bind(roleController)
);

// Get current user's roles
router.get('/me/roles', roleController.getMyRoles.bind(roleController));

export default router;
