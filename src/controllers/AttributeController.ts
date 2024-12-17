// attribute.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AttributeService } from '../services/attribute.service';
import { Attribute } from '../entities/Attribute';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() data: Partial<Attribute>) {
    return this.attributeService.create(data);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Attribute>) {
    return this.attributeService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.attributeService.delete(id);
  }
}
