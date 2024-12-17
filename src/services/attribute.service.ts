
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from '../entities/Attribute';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  create(attribute: Partial<Attribute>) {
    return this.attributeRepository.save(attribute);
  }

  findAll() {
    return this.attributeRepository.find();
  }

  findOne(id: number) {
    return this.attributeRepository.findOne({ where: { id } });
  }

  update(id: number, updatedData: Partial<Attribute>) {
    return this.attributeRepository.update(id, updatedData);
  }

  delete(id: number) {
    return this.attributeRepository.delete(id);
  }
}