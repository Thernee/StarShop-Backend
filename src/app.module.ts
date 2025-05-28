import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './modules/shared/shared.module';
import { CouponModule } from './modules/coupons/coupon.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'starshop',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    SharedModule,
    CouponModule,
  ],
})
export class AppModule {}
