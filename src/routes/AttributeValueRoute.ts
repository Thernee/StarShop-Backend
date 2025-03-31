import { Router } from 'express';
import {
  createAttributeValue,
  getAllAttributesValues,
  getAttributeValueById,
  updateAttributeValue,
  deleteAttributeValue,
} from '../controllers/AttributeValueController';

const router = Router();

router.post('/', createAttributeValue);
router.get('/', getAllAttributesValues);
router.get('/:id', getAttributeValueById);
router.put('/:id', updateAttributeValue);
router.delete('/:id', deleteAttributeValue);

export default router;
