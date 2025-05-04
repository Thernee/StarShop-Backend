import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedFileTypes: Record<string, { folder: string }> = {
  'image/jpeg': { folder: 'images' },
  'image/png': { folder: 'images' },
  'image/gif': { folder: 'images' },
  'application/pdf': { folder: 'documents' },
  'application/msword': { folder: 'documents' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    folder: 'documents',
  },
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folder = allowedFileTypes[file.mimetype]?.folder || 'other';
    return {
      folder,
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
    };
  },
});

export const cloudinaryUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (Object.keys(allowedFileTypes).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export { cloudinary };
