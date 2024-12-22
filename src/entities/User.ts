<<<<<<< HEAD
// user.entity.ts - User Database Model

// Import decorators from TypeORM to define database structure
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
* User Entity
* Represents the structure of the User table in the database
* Uses TypeORM decorators to define table columns and properties
*/
@Entity()  // Marks this class as a database table
export class User {
   // Primary key - Auto-incrementing ID number
   @PrimaryGeneratedColumn()
   id: number;

   // User's blockchain wallet address
   // unique: true means no two users can have the same address
   @Column({ unique: true })
   walletAddress: string;

   // User's role in the system 
   // default: 'user' means new users automatically get this role
   @Column({ default: 'user' })
   role: string;

   // Automatically tracks when the user record was created
   @CreateDateColumn()
   createdAt: Date;

   // Automatically updates whenever the user record is modified
   @UpdateDateColumn()
   updatedAt: Date;
=======
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  walletAddress: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  role: 'buyer' | 'seller' | 'admin';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
>>>>>>> main
}