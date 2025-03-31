import { IsNumber, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantDTO } from './ProductVariantDTO';
import { AttributeValueDTO } from './AttributeValueDTO';

export class ProductVariantAttributeDTO {
    @IsNumber()
    id: number;

    @ValidateNested()
    @Type(() => ProductVariantDTO)
    productVariant: ProductVariantDTO;

    @ValidateNested()
    @Type(() => AttributeValueDTO)
    attributeValue: AttributeValueDTO;

    @IsDate()
    createdAt: Date;
} 