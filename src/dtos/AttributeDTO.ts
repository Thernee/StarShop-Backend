import { IsString, IsNumber, IsDate } from 'class-validator';

export class AttributeDTO {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsDate()
    createdAt: Date;
} 