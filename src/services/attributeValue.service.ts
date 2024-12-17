import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttributeValue } from '../entities/AttributeValue';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
  ) {}

  create(data: Partial<AttributeValue>) {
    return this.attributeValueRepository.save(data);
  }

  findAll() {
    return this.attributeValueRepository.find();
  }

  findOne(id: number) {
    return this.attributeValueRepository.findOne({ where: { id } });
  }

  update(id: number, updatedData: Partial<AttributeValue>) {
    return this.attributeValueRepository.update(id, updatedData);
  }

  delete(id: number) {
    return this.attributeValueRepository.delete(id);
  }
}
