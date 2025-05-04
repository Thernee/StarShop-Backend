// import { Request, Response, NextFunction } from 'express';
// import { cloudinaryUpload } from '../config/cloudinary.config';
// import { s3Upload } from '../config/s3.config';
// import path from 'path';
// import { FileType } from '../entities/file.entity';

// // Determine file type from extension
// const getFileType = (filename: string): FileType => {
//   const ext = path.extname(filename).toLowerCase();
//   const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
//   const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

//   if (imageExtensions.includes(ext)) {
//     return FileType.IMAGE;
//   } else if (documentExtensions.includes(ext)) {
//     return FileType.DOCUMENT;
//   } else {
//     return FileType.OTHER;
//   }
// };

// // Middleware to handle both Cloudinary and S3 uploads based on configuration
// export const fileUpload = (req: Request, res: Response, next: NextFunction) => {
//   // Choose upload provider based on environment variable
//   const uploadProvider = process.env.FILE_STORAGE_PROVIDER?.toLowerCase() || 'cloudinary';

//   // Add file type info to request object
//   const fileTypeMiddleware = (req: any, res: Response, next: NextFunction) => {
//     if (req.file) {
//       req.fileType = getFileType(req.file.originalname);
//     } else if (req.files) {
//       // Handle multiple files
//       req.fileTypes = Array.isArray(req.files)
//         ? req.files.map((file: any) => getFileType(file.originalname))
//         : Object.keys(req.files).reduce((acc: any, key: string) => {
//             acc[key] = getFileType(req.files[key].originalname);
//             return acc;
//           }, {});
//     }
//     next();
//   };

//   // Use appropriate uploader
//   if (uploadProvider === 's3') {
//     return [s3Upload.single('file'), fileTypeMiddleware].forEach((middleware) =>
//       middleware(req, res, next)
//     );
//   } else {
//     return [cloudinaryUpload.single('file'), fileTypeMiddleware].forEach((middleware) =>
//       middleware(req, res, next)
//     );
//   }
// };

// // Middleware for multiple file uploads
// export const multipleFileUpload = (
//   fieldName: string = 'files',
//   maxCount: number = 5,
//   req,
//   res,
//   next
// ) => {
//   const uploadProvider = process.env.FILE_STORAGE_PROVIDER?.toLowerCase() || 'cloudinary';

//   const fileTypeMiddleware = (req: any, res: Response, next: NextFunction) => {
//     if (req.files && req.files[fieldName]) {
//       req.fileTypes = req.files[fieldName].map((file: any) => getFileType(file.originalname));
//     }
//     next();
//   };

//   if (uploadProvider === 's3') {
//     return [s3Upload.array(fieldName, maxCount), fileTypeMiddleware].forEach((middleware) =>
//       middleware(req, res, next)
//     );
//   } else {
//     return [cloudinaryUpload.array(fieldName, maxCount), fileTypeMiddleware].forEach((middleware) =>
//       middleware(req, res, next)
//     );
//   }
// };

import { Request, Response, NextFunction } from 'express';
import { cloudinaryUpload } from '../config/cloudinary.config';
import { s3Upload } from '../config/s3.config';
import { FileType } from '../entities/file.entity';

// Interface to extend Express Request
declare global {
  namespace Express {
    interface Request {
      fileProvider?: 'cloudinary' | 's3';
      fileType?: FileType;
    }
  }
}

/**
 * Middleware for file upload based on provider preference
 * @param provider - Storage provider ('cloudinary' or 's3')
 */
export const uploadFile = (provider: 'cloudinary' | 's3' = 'cloudinary') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.fileProvider = provider;

    const upload = provider === 's3' ? s3Upload : cloudinaryUpload;
    const uploadMiddleware = upload.single('file');

    uploadMiddleware(req, res, (err): void => {
      if (err) {
        res.status(400).json({
          status: 'error',
          message: err.message,
        });
        return;
      }

      // Determine file type based on mimetype
      if (req.file) {
        const mimetype = req.file.mimetype;
        if (mimetype.startsWith('image/')) {
          req.fileType = FileType.IMAGE;
        } else if (
          mimetype === 'application/pdf' ||
          mimetype === 'application/msword' ||
          mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          req.fileType = FileType.DOCUMENT;
        } else {
          req.fileType = FileType.OTHER;
        }
      }

      next();
    });
  };
};

/**
 * Middleware to validate if file exists in the request
 */
export const validateFileExists = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({
      status: 'error',
      message: 'No file uploaded',
    });
    return;
  }
  next();
};
