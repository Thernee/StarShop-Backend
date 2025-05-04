// Export entities
export { File, FileType } from './entities/file.entity';

// Export DTOs
export { CreateFileDto } from './dto/create-file.dto';

// Export services
export { FileService } from './services/file.service';

// Export controllers
export { FileController } from './controllers/file.controller';

// Export routes
import fileRoutes from './routes/file.routes';
export { fileRoutes };

// Export middlewares
export { uploadFile, validateFileExists } from './middlewares/file-upload.middleware';

// Export config
export { cloudinary, cloudinaryUpload } from './config/cloudinary.config';
export { s3Client, s3Upload, getS3PublicUrl } from './config/s3.config';
