import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { AttributeValue } from './AttributeValue';
import { ProductVariant } from './ProductVariant';


@Entity('product_variant_attributes')
export class ProductVariantAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, { eager: true })
  productVariant: ProductVariant;

  @ManyToOne(() => AttributeValue, { eager: true })
  attributeValue: AttributeValue;

  @CreateDateColumn()
  createdAt: Date;
}





