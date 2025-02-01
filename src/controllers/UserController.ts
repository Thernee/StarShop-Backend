import { Request, Response } from 'express';
import { UserService } from '../services/User.service';
import AppDataSource from '../config/ormconfig';

const userService = new UserService(AppDataSource);

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User Created Successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.status(200).json({
        success: true,
        message: 'User Retrieved Successfully',
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.status(200).json({
        success: true,
        message: 'User Updated Successfully',
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await userService.deleteUser(Number(req.params.id));
    if (!success) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, message: 'Users Retrieved', data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
