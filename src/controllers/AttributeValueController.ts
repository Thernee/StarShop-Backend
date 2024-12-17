import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AttributeValueService } from '../services/attributeValue.service';
import { AttributeValue } from '../entities/AttributeValue';

@Controller('attribute-values')
export class AttributeValueController {
  constructor(private readonly attributeValueService: AttributeValueService) {}

  @Post()
  create(@Body() data: Partial<AttributeValue>) {
    return this.attributeValueService.create(data);
  }

  @Get()
  findAll() {
    return this.attributeValueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.attributeValueService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<AttributeValue>) {
    return this.attributeValueService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.attributeValueService.delete(id);
  }
}
