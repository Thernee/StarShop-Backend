import { IsString, IsNotEmpty, IsEnum, IsNumber, IsPositive, IsOptional, IsUUID } from 'class-validator';
export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  min_cart_value?: number;

  @IsOptional()
  @IsString()
  expires_at?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  max_uses?: number;

  @IsUUID()
  created_by: string;
}

export class ApplyCouponDto {
  code: string;
  user_id: string;
  total: number;
}