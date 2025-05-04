import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuring S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Allowed file types
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Function to determine the appropriate folder based on mimetype
const getFolder = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) {
    return 'images';
  } else if (
    mimetype === 'application/pdf' ||
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'documents';
  }
  return 'other';
};

// Configure S3 storage
export const s3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET || 'my-app-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const folder = getFolder(file.mimetype);
      const filename = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB size limit
  },
});

// Helper function to get public URL from S3 object key
export const getS3PublicUrl = (key: string): string => {
  const bucketName = process.env.AWS_S3_BUCKET || 'my-app-bucket';
  const region = process.env.AWS_REGION || 'us-east-1';
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};
