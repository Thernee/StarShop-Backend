import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValue } from '../entities/AttributeValue';
import { AttributeValueService } from '../services/attributeValue.service';
import { AttributeValueController } from '../controllers/AttributeValueController';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValue])],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
})
export class AttributeValueModule {}
