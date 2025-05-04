import { Repository } from 'typeorm';
import { File, FileType } from '../entities/file.entity';
import { CreateFileDto } from '../dto/create-file.dto';
import { cloudinary } from '../config/cloudinary.config';
import { s3Client } from '../config/s3.config';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import AppDataSource from '../../../config/ormconfig';

export class FileService {
  private fileRepository: Repository<File>;

  constructor() {
    this.fileRepository = AppDataSource.getRepository(File);
  }

  /**
   * Upload a file and store its metadata
   */
  async uploadFile(
    fileData: Express.Multer.File,
    userId: number,
    provider: 'cloudinary' | 's3',
    fileType: FileType
  ): Promise<File> {
    let url: string;
    let providerPublicId: string | undefined;

    // Handle different provider data structures
    if (provider === 'cloudinary') {
      // Cloudinary provides path and filename in a different structure
      const cloudinaryFile = fileData as any;
      url = cloudinaryFile.path;
      providerPublicId = cloudinaryFile.filename;
    } else {
      // S3 structure using multer-s3
      const s3File = fileData as any;
      url = s3File.location;
      providerPublicId = s3File.key;
    }

    const createFileDto: CreateFileDto = {
      url,
      type: fileType,
      filename: fileData.originalname,
      mimetype: fileData.mimetype,
      size: fileData.size,
      providerType: provider,
      providerPublicId,
      uploadedById: userId,
    };

    const file = this.fileRepository.create(createFileDto);
    return this.fileRepository.save(file);
  }

  /**
   * Get a file by id
   */
  async getFileById(id: string): Promise<File | undefined> {
    return this.fileRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
  }

  /**
   * Get files uploaded by a specific user
   */
  async getUserFiles(userId: number): Promise<File[]> {
    return this.fileRepository.find({
      where: { uploadedById: userId },
      order: { uploadedAt: 'DESC' },
    });
  }

  /**
   * Delete a file
   */
  async deleteFile(id: string, userId: number): Promise<boolean> {
    const file = await this.fileRepository.findOne({
      where: { id, uploadedById: userId },
    });

    if (!file) {
      throw new Error('File not found or you do not have permission to delete it');
    }

    // Delete from storage provider
    if (file.providerType === 'cloudinary' && file.providerPublicId) {
      await cloudinary.uploader.destroy(file.providerPublicId);
    } else if (file.providerType === 's3' && file.providerPublicId) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET || 'my-app-bucket',
        Key: file.providerPublicId,
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    // Delete metadata from database
    await this.fileRepository.remove(file);
    return true;
  }

  /**
   * Count user files
   */
  async countUserFiles(userId: number): Promise<number> {
    return this.fileRepository.count({
      where: { uploadedById: userId },
    });
  }

  /**
   * Get files by type
   */
  async getFilesByType(fileType: FileType): Promise<File[]> {
    return this.fileRepository.find({
      where: { type: fileType },
      order: { uploadedAt: 'DESC' },
    });
  }
}
