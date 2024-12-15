import { QueryFailedError, Repository } from "typeorm";
import { User } from "../entities/User";
import { DataSource } from "typeorm";


export class UserService {
    private userRepository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(User);
    }

    async createUser(data: Partial<User>): Promise<User> {
        
        try {
            const user = this.userRepository.create(data);
            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes("UNIQUE constraint failed")) {
                throw new Error("The wallet address is already in use. Please use a unique wallet address.");
              }
            if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT') { // Handle unique constraint errors
                if (error.message.includes('UQ_fc71cd6fb73f95244b23e2ef113')) {
                    throw new Error('The wallet address is already in use. Please use a unique wallet address.');
                }
            }
            throw error; 
        }
        
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }

    async updateUser(id: number, data: Partial<User>): Promise<User | null> {
        try {
            await this.userRepository.update(id, data);
            return await this.getUserById(id);
        } catch (error) {
            if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT') { // Handle unique constraint errors
                if (error.message.includes('UQ_fc71cd6fb73f95244b23e2ef113')) {
                    throw new Error('The wallet address is already in use. Please use a unique wallet address.');
                }
            }
            
            if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT') { // Handle unique constraint errors
                if (error.message.includes('UQ_fc71cd6fb73f95244b23e2ef113')) {
                    throw new Error('The wallet address is already in use. Please use a unique wallet address.');
                }
            }
            throw error;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected === 1;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
}

export default UserService;
