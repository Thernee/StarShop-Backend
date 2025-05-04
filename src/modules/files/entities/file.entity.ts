import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../entities/User';

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  OTHER = 'other',
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.OTHER,
  })
  type: FileType;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  mimetype: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  providerType: 'cloudinary' | 's3';

  @Column({ nullable: true })
  providerPublicId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @Column({ name: 'uploaded_by' })
  uploadedById: number;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
