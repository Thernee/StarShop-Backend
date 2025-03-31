import { Router } from 'express';
import {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
} from '../controllers/AttributeController';

const router = Router();

router.post('/', createAttribute);
router.get('/', getAllAttributes);
router.get('/:id', getAttributeById);
router.put('/:id', updateAttribute);
router.delete('/:id', deleteAttribute);

export default router;
