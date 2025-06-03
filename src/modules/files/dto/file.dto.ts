import { IsEnum, IsOptional } from 'class-validator';
import { FileType } from '../entities/file.entity';

export class UploadFileDto {
  @IsEnum(['cloudinary', 's3'])
  @IsOptional()
  provider?: 'cloudinary' | 's3';

  @IsEnum(FileType)
  @IsOptional()
  fileType?: FileType;
}
