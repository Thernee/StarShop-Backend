import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';

export class RoleController {
  constructor(private roleService: RoleService) {}

  async assignRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId, roleName } = req.body;
      await this.roleService.assignRoleToUser(userId, roleName);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.roleService.getUserRoles(req.user.id);
      res.json({ roles: roles.map(role => role.name) });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
} 