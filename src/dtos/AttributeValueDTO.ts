import { IsString, IsNumber, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributeDTO } from './AttributeDTO';

export class AttributeValueDTO {
    @IsNumber()
    id: number;

    @ValidateNested()
    @Type(() => AttributeDTO)
    attribute: AttributeDTO;

    @IsString()
    value: string;

    @IsDate()
    createdAt: Date;
} 