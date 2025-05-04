// import { FileType } from '../entities/file.entity';

// export class CreateFileDto {
//   url: string;
//   type: FileType;
//   originalName?: string;
//   mimeType?: string;
//   size?: number;
//   providerId?: string;
//   provider?: string;
//   uploadedBy: number;
// }
import { FileType } from '../entities/file.entity';

export class CreateFileDto {
  url: string;
  type: FileType;
  filename?: string;
  mimetype?: string;
  size?: number;
  providerType: 'cloudinary' | 's3';
  providerPublicId?: string;
  uploadedById: number;
}
