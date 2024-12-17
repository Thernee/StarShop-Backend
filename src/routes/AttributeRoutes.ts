import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from '../entities/Attribute';
import { AttributeService } from '../services/attribute.service';
import { AttributeController } from '../controllers/Attribute.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
