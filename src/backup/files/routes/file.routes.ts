import { Router } from 'express';
import { FileController } from '../../../modules/files/controllers/file.controller';
import { uploadFile, validateFileExists } from '../../../modules/files/middlewares/file-upload.middleware';
import { jwtAuthMiddleware } from '../../../modules/auth/middleware/jwt-auth.middleware';

const router = Router();
const fileController = new FileController();

/**
 * @route   POST /files/upload
 * @desc    Upload a file to Cloudinary
 * @access  Private
 */
router.post(
  '/upload',
  jwtAuthMiddleware,
  uploadFile('cloudinary'),
  validateFileExists,
  fileController.uploadFile.bind(fileController)
);

/**
 * @route   POST /files/upload/s3
 * @desc    Upload a file to AWS S3
 * @access  Private
 */
router.post(
  '/upload/s3',
  jwtAuthMiddleware,
  uploadFile('s3'),
  validateFileExists,
  fileController.uploadFile.bind(fileController)
);

/**
 * @route   GET /files/my
 * @desc    Get files uploaded by the authenticated user
 * @access  Private
 */
router.get('/my', jwtAuthMiddleware, fileController.getUserFiles.bind(fileController));

/**
 * @route   GET /files/:id
 * @desc    Get a file by id
 * @access  Public
 */
router.get('/:id', fileController.getFileById.bind(fileController));

/**
 * @route   GET /files/type/:type
 * @desc    Get files by type
 * @access  Public
 */
router.get('/type/:type', fileController.getFilesByType.bind(fileController));

/**
 * @route   DELETE /files/:id
 * @desc    Delete a file
 * @access  Private
 */
router.delete('/:id', jwtAuthMiddleware, fileController.deleteFile.bind(fileController));

export default router;
