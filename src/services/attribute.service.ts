import { Repository } from 'typeorm';
import { Attribute } from '../entities/Attribute';
import AppDataSource from '../config/ormconfig';

export class AttributeService {
  private repository: Repository<Attribute>;

  constructor() {
    this.repository = AppDataSource.getRepository(Attribute);
  }

    // Create new attribute with duplicate check
    async create(data: Partial<Attribute>): Promise<Attribute> {
        // Check if an attribute with the same name already exists
        const existingAttribute = await this.repository.findOne({
            where: { name: data.name },
        });

        if (existingAttribute) {
            throw new Error(`Attribute with name '${data.name}' already exists.`);
        }

        // Create and save the new attribute
        const attribute = this.repository.create(data);
        return await this.repository.save(attribute);
    }

    // Get all attributes
    async getAll(): Promise<Attribute[]> {
        return await this.repository.find();
    }

    // Get attribute by ID
    async getById(id: number): Promise<Attribute | null> {
        return await this.repository.findOne({ where: { id } });
    }

    // Update attribute with duplicate check
    async update(id: number, data: Partial<Attribute>): Promise<Attribute | null> {
        const attribute = await this.getById(id);
        if (!attribute) return null;

        // Check if another attribute with the same name exists
        if (data.name) {
            const existingAttribute = await this.repository.findOne({
                where: { name: data.name },
            });

            if (existingAttribute && existingAttribute.id !== id) {
                throw new Error(`Another attribute with name '${data.name}' already exists.`);
            }
        }

        Object.assign(attribute, data);
        return await this.repository.save(attribute);
    }

    // Delete attribute
    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected === 1;
    }
}
