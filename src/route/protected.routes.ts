import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.get('/', authMiddleware, (req, res) => {
    res.json({ message: 'Protected route accessed' });
});

router.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
    res.json({ message: 'Admin route accessed' });
});

export default router;