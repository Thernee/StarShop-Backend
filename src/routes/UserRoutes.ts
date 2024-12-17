import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/UserController';
import { validationMiddleware } from '../middleware/userValidation.middleware';
import { CreateUserDto, UpdateUserDto } from '../dtos/UserDTO';



const router = Router();

router.get('/', getAllUsers);
router.post('/create', validationMiddleware(CreateUserDto), createUser);
router.get('/show/:id', getUser);
router.put('/update/:id',validationMiddleware(UpdateUserDto), updateUser);
router.delete('/delete/:id', deleteUser);


export default router;
